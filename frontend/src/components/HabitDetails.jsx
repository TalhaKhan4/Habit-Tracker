import { useSelector } from "react-redux";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { useEffect } from "react";
import DeleteHabitModal from "./DeleteHabitModal";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { removeHabit } from "../features/habitsSlice.js"; // adjust path
import EditHabitForm from "./EditHabitForm.jsx";
import { toast } from "react-toastify";

import HabitCalendar from "./HabitCalendar.jsx";

function HabitDetails({ selectedHabitId, setSelectedHabitId }) {
  const dispatch = useDispatch();

  const selectedHabit = useSelector((state) =>
    state.habits.items.find((habit) => habit._id === selectedHabitId),
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  if (!selectedHabit) return null;

  // hiding scroll bar from body when the form is visible
  document.body.style.overflow = "hidden";

  const logs = selectedHabit.logs || [];
  const isNegative = selectedHabit.type === "negative";

  // For regular: log present = done. For negative: log present = NOT done (failed day).
  // So "completed" days = logs for regular, non-log days for negative.
  // We'll work with sets of date strings.

  const logDateStrings = new Set(
    logs.map((log) => new Date(log.date).toDateString()),
  );

  // Build the full set of days the habit has been active (from createdAt to today)
  const createdAt = new Date(selectedHabit.createdAt);
  createdAt.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // All scheduled days since creation
  const scheduledDays = [];
  const cursor = new Date(createdAt);
  const dayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  while (cursor <= today) {
    const dayName = dayNames[cursor.getDay()];
    let isScheduled = false;

    if (selectedHabit.scheduleType === "daysOfWeek") {
      isScheduled = selectedHabit.daysOfWeek?.includes(dayName);
    } else if (selectedHabit.scheduleType === "timesPerWeek") {
      isScheduled = true; // treat every day as potentially scheduled
    } else {
      isScheduled = true;
    }

    if (isScheduled) {
      scheduledDays.push(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  const todayStr = today.toDateString();
  const todayIsLogged = logDateStrings.has(todayStr);
  const effectiveScheduledDays = scheduledDays.filter(
    (d) => d.toDateString() !== todayStr || todayIsLogged || isNegative,
  );

  // A day is "completed" based on habit type
  const isDayCompleted = (date) => {
    const ds = date.toDateString();
    if (isNegative) {
      return !logDateStrings.has(ds); // negative: no log = success
    } else {
      return logDateStrings.has(ds); // regular: log present = success
    }
  };

  // Habit finished = total completed scheduled days
  const habitFinished = effectiveScheduledDays.filter(isDayCompleted).length;

  // This week completions
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  startOfWeek.setHours(0, 0, 0, 0);
  const thisWeekCount = effectiveScheduledDays.filter(
    (d) => d >= startOfWeek && isDayCompleted(d),
  ).length;

  // Completion rate
  const completionRate =
    effectiveScheduledDays.length > 0
      ? Math.round((habitFinished / effectiveScheduledDays.length) * 100)
      : 0;

  // Current streak: consecutive completed scheduled days going backwards from today
  const currentStreak = (() => {
    let streak = 0;
    const todayStr = today.toDateString();

    // Exclude today from the backwards walk
    const pastScheduledDays = scheduledDays.filter(
      (d) => d.toDateString() !== todayStr,
    );

    const reversed = [...pastScheduledDays].reverse();
    for (const day of reversed) {
      if (isDayCompleted(day)) {
        streak++;
      } else {
        break;
      }
    }

    // If today is scheduled, count it toward the streak regardless of
    // whether it's been logged yet (the day isn't over)
    const todayIsScheduled = scheduledDays.some(
      (d) => d.toDateString() === todayStr,
    );
    if (todayIsScheduled && isDayCompleted(today)) {
      streak++;
    }

    return streak;
  })();

  // Best streak
  const bestStreak = (() => {
    let best = 0;
    let current = 0;
    for (const day of scheduledDays) {
      if (isDayCompleted(day)) {
        current++;
        best = Math.max(best, current);
      } else {
        current = 0;
      }
    }
    return best;
  })();

  // ── Schedule badge label ────────────────────────────────────────────────────
  const getScheduleLabel = () => {
    if (selectedHabit.scheduleType === "timesPerWeek") {
      return `${selectedHabit.timesPerWeek} days per week`;
    }
    if (selectedHabit.type === "one-time todo" && selectedHabit) {
      return new Date(selectedHabit.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }

    const days = selectedHabit.daysOfWeek || [];
    const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    const weekends = ["saturday", "sunday"];
    const allDays = [...weekdays, ...weekends];
    const shortMap = {
      monday: "Mon",
      tuesday: "Tue",
      wednesday: "Wed",
      thursday: "Thu",
      friday: "Fri",
      saturday: "Sat",
      sunday: "Sun",
    };

    const sorted = [...days].sort(
      (a, b) => allDays.indexOf(a) - allDays.indexOf(b),
    );

    const isWeekdays =
      sorted.length === 5 && weekdays.every((d) => sorted.includes(d));
    const isWeekends =
      sorted.length === 2 && weekends.every((d) => sorted.includes(d));
    const isAllDays = sorted.length === 7;

    if (isAllDays) return "Everyday";
    if (isWeekdays) return "Weekdays";
    if (isWeekends) return "Weekends";

    // Check "everyday except X"
    const missing = allDays.filter((d) => !sorted.includes(d));
    if (missing.length === 1) {
      return `Everyday except ${shortMap[missing[0]]}`;
    }

    return sorted.map((d) => shortMap[d]).join(", ");
  };

  // ── Stat cards ──────────────────────────────────────────────────────────────
  const statCards = [
    {
      label: "Current Streak",
      value: `${currentStreak}`,
      sub: `Best Streak: ${bestStreak} days`,
      bg: "bg-blue-500",
    },
    {
      label: "Habit Finished",
      value: habitFinished,
      sub: `This week: ${thisWeekCount}`,
      bg: "bg-red-500",
    },
    {
      label: "Completion Rate",
      value: `${completionRate}%`,
      sub: `${habitFinished}/${effectiveScheduledDays.length} days`,
      bg: "bg-amber-500",
    },
  ];

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.code === "Escape") {
        setSelectedHabitId(null);
      }
    });
  }, []);

  const handleDeleteHabit = async () => {
    try {
      setIsDeleting(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/habits/${selectedHabitId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const result = await response.json();

      if (result.success) {
        // 1. Remove from Redux
        dispatch(removeHabit(selectedHabitId));

        // 2. Close both modals
        setShowDeleteModal(false);
        setSelectedHabitId(null);

        // 3. Restore scroll
        document.body.style.overflow = "auto";

        // 4. Toast
        toast.success("Habit deleted successfully");
      } else {
        toast.error(result.message || "Failed to delete habit");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed top-0 left-0 z-10 bg-black/70 w-[100vw] h-[100vh] flex items-center justify-center"
      onClick={() => {
        if (showDeleteModal) return; // prevent closing parent modal
        setSelectedHabitId(null);
        document.body.style.overflow = "auto";
      }}
    >
      <div
        className="bg-white text-gray-900 rounded-2xl shadow-2xl flex flex-col gap-5 p-8"
        style={{ width: "82%", maxHeight: "88vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-extrabold">{selectedHabit.name}</h2>

          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
              title="Edit habit"
              onClick={() => setShowEditForm(true)}
            >
              <FiEdit2 size={23} className="text-gray-900" />
            </button>
            <button
              className="p-2 rounded-lg bg-gray-100 hover:bg-red-100 transition-colors cursor-pointer"
              title="Delete habit"
              onClick={() => setShowDeleteModal(true)}
            >
              <FiTrash2 size={23} className="text-red-500" />
            </button>
          </div>
        </div>

        {/* ── Badges ── */}
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-gray-200">
            {selectedHabit.preferredTimeOfDay}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-gray-200">
            {getScheduleLabel()}
          </span>
        </div>

        {/* ── Stat Cards ── */}
        <div
          className={`grid grid-cols-3 gap-4 ${selectedHabit.type === "one-time todo" ? "opacity-40 pointer-events-none cursor-not-allowed" : ""}`}
        >
          {statCards.map((card) => (
            <div
              key={card.label}
              className={`${card.bg} rounded-xl p-5 flex flex-col gap-1 text-white`}
            >
              <span className="font-bold uppercase tracking-wider opacity-90">
                {card.label}
              </span>
              <span className="text-5xl font-black">{card.value}</span>
              <span className="text-sm font-semibold text-white opacity-80">
                {selectedHabit.type === "one-time todo" &&
                card.label === "Completion Rate"
                  ? "0/1 days"
                  : card.sub}
              </span>
            </div>
          ))}
        </div>

        {/* ── Calendar placeholder ── */}
        {/* ── Calendar ── */}
        <div
          className={`${selectedHabit.type === "one-time todo" ? "opacity-50 pointer-events-none" : ""}`}
        >
          <HabitCalendar habit={selectedHabit} />
        </div>
      </div>

      <button
        onClick={() => {
          setSelectedHabitId(null);
          document.body.style.overflow = "auto";
        }}
        className="fixed outline-none top-9 right-16 cursor-pointer"
      >
        <MdClose className="text-lg text-white" />
      </button>

      {showDeleteModal && (
        <DeleteHabitModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteHabit}
          isDeleting={isDeleting}
          selectedHabit={selectedHabit}
        />
      )}

      {showEditForm && (
        <EditHabitForm
          habit={selectedHabit}
          onClose={() => {
            setShowEditForm(false);
          }}
          onFullClose={() => {
            setShowEditForm(false);
            document.body.style.overflow = "auto";

            setSelectedHabitId(null);
          }}
        />
      )}
    </div>
  );
}

export default HabitDetails;
