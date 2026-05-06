import { useState, useEffect } from "react";
import Habit from "./Habit.jsx";
import { FaPlus } from "react-icons/fa";
import Loader from "./Loader.jsx";
import Calendar from "./Calendar.jsx";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setHabits } from "../features/habitsSlice.js";
import { FaLessThan } from "react-icons/fa6";
import { FaGreaterThan } from "react-icons/fa6";

function getWeekBoundsForDate(dateObj) {
  const dayOfWeek = dateObj.getDay();
  const monday = new Date(dateObj);
  monday.setDate(dateObj.getDate() - ((dayOfWeek + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { monday, sunday };
}

function HabitsDisplay({
  selectedFilter,
  setIsNewHabitFormVisible,
  setSelectedHabitId,
}) {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const habits = useSelector((state) => state.habits);
  const habitItems = habits.items;
  const areHabitsLoaded = habits.isDataLoaded;

  const [selectedDate, setSelectedDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    date: new Date().getDate(),
  });

  const [selectedMonthCalendar, setSelectedMonthCalendar] = useState(
    new Date().getMonth(),
  );
  const [selectedYearCalendar, setSelectedYearCalendar] = useState(
    new Date().getFullYear(),
  );

  useEffect(() => {
    (async () => {
      try {
        if (areHabitsLoaded) return;

        setIsLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/habits`,
          { credentials: "include" },
        );
        const result = await response.json();
        if (result.success) {
          dispatch(
            setHabits({ items: result.data.habits, isDataLoaded: true }),
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  function getArrowSign() {
    if (
      new Date(
        `${selectedYearCalendar}-${String(selectedMonthCalendar + 1).length === 1 ? "0" + (selectedMonthCalendar + 1) : String(selectedMonthCalendar + 1)}`,
      ) >
      new Date(
        `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).length === 1 ? "0" + (new Date().getMonth() + 1) : new Date().getMonth()}`,
      )
    ) {
      return <FaLessThan className="text-xl" />;
    } else if (
      new Date(
        `${selectedYearCalendar}-${String(selectedMonthCalendar + 1).length === 1 ? "0" + (selectedMonthCalendar + 1) : String(selectedMonthCalendar + 1)}`,
      ) <
      new Date(
        `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).length === 1 ? "0" + (new Date().getMonth() + 1) : new Date().getMonth()}`,
      )
    ) {
      return <FaGreaterThan className="text-xl" />;
    } else if (
      new Date(
        Number(selectedDate.year),
        Number(selectedDate.month),
        Number(selectedDate.date),
      ) >
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
      )
    ) {
      return <FaLessThan className="text-xl" />;
    } else if (
      new Date(
        Number(selectedDate.year),
        Number(selectedDate.month),
        Number(selectedDate.date),
      ) <
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
      )
    ) {
      return <FaGreaterThan className="text-xl" />;
    }
  }

  function renderHabitCell(habit) {
    const selectedDate2 = new Date(
      `${selectedDate.year}-${selectedDate.month + 1}-${selectedDate.date}`,
    );

    let label = null;
    if (habit.type === "regular" && habit.scheduleType === "timesPerWeek") {
      const { monday, sunday } = getWeekBoundsForDate(selectedDate2);
      const selectedDateStr = `${selectedDate.year}-${String(selectedDate.month + 1).padStart(2, "0")}-${String(selectedDate.date).padStart(2, "0")}`;
      const mondayStr = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, "0")}-${String(monday.getDate()).padStart(2, "0")}`;

      const weekLogCount = habit.logs.filter((log) => {
        return (
          log.date >= mondayStr &&
          log.date <= selectedDateStr &&
          log.isCompleted
        );
      }).length;
      const isWeekComplete = weekLogCount >= habit.timesPerWeek;

      label = (
        // absolute so it floats above the card without adding to the wrapper height
        <div
          className="absolute left-0 right-0 flex items-center px-3 py-1 rounded-br-xl rounded-bl-xl w-max bg-black mx-auto"
          style={{ top: "0px" }}
        >
          <span
            className="text-[11px] font-bold tracking-widest uppercase leading-none"
            style={{ color: isWeekComplete ? "#4ade80" : "#f59e0b" }}
          >
            <span style={{ fontSize: "13px" }}>
              {weekLogCount}/{habit.timesPerWeek}
            </span>{" "}
            DAYS FINISHED THIS WEEK
          </span>
        </div>
      );
    } else if (habit.type === "one-time todo") {
      const formattedDate = new Date(habit.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      label = (
        <div
          className="absolute left-0 right-0 flex items-center px-5 py-1 rounded-br-xl rounded-bl-xl w-max bg-black mx-auto"
          style={{ top: "0px" }}
        >
          <span className="text-[11px] font-bold tracking-widest uppercase leading-none text-white">
            {formattedDate}
          </span>
        </div>
      );
    }

    return (
      // relative + pt-6 only when label exists so the label doesn't get clipped
      <div key={habit._id} className={`relative${label ? "" : ""}`}>
        {label}
        <Habit
          {...habit}
          selectedDate={selectedDate}
          setSelectedHabitId={setSelectedHabitId}
        />
      </div>
    );
  }

  return isLoading ? (
    <div className="flex justify-center items-center h-[85vh]">
      <Loader
        width="w-16"
        height="h-16"
        border="border-8"
        borderBgColor="border-gray-300"
      />
    </div>
  ) : (
    <div className="grid grid-cols-3 gap-3 py-5 px-4">
      <Calendar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedMonth={selectedMonthCalendar}
        setSelectedMonth={setSelectedMonthCalendar}
        selectedYear={selectedYearCalendar}
        setSelectedYear={setSelectedYearCalendar}
      />
      {habitItems.map((habit) => {
        const selectedDate2 = new Date(
          `${selectedDate.year}-${selectedDate.month + 1}-${selectedDate.date}`,
        );

        const habitDate = new Date(habit.date);
        const habitCreatedAtDate = new Date(
          new Date(habit.createdAt).setHours(0, 0, 0, 0),
        );

        if (habitCreatedAtDate > selectedDate2) return null;

        if (
          habit.type === "one-time todo" &&
          !(
            selectedDate2.getFullYear() === habitDate.getFullYear() &&
            selectedDate2.getMonth() === habitDate.getMonth() &&
            selectedDate2.getDate() === habitDate.getDate()
          )
        ) {
          return null;
        }

        if (habit.type === "regular" && habit.scheduleType === "daysOfWeek") {
          const isPastDate =
            selectedDate2 < new Date(new Date().setHours(0, 0, 0, 0));

          if (isPastDate) {
            const hasLog = habit.logs.some(
              (log) =>
                log.date ===
                `${selectedDate.year}-${String(selectedDate.month + 1).padStart(2, "0")}-${String(selectedDate.date).padStart(2, "0")}`,
            );
            const isInCurrentSchedule = habit.daysOfWeek.includes(
              selectedDate2
                .toLocaleDateString("en-US", { weekday: "long" })
                .toLowerCase(),
            );
            if (!hasLog && !isInCurrentSchedule) return null;
          } else {
            if (
              !habit.daysOfWeek.includes(
                selectedDate2
                  .toLocaleDateString("en-US", { weekday: "long" })
                  .toLowerCase(),
              )
            )
              return null;
          }
        }

        if (habit.type === "regular" && habit.scheduleType === "timesPerWeek") {
          const weekStart = new Date(selectedDate2);
          const dayOfWeek = weekStart.getDay();
          const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
          weekStart.setDate(weekStart.getDate() + diff);
          weekStart.setHours(0, 0, 0, 0);

          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          weekEnd.setHours(23, 59, 59, 999);

          const completionsThisWeek = habit.logs.filter((log) => {
            const logDate = new Date(log.date);
            return (
              log.isCompleted && logDate >= weekStart && logDate <= weekEnd
            );
          }).length;

          const selectedDateStr = `${selectedDate.year}-${String(selectedDate.month + 1).padStart(2, "0")}-${String(selectedDate.date).padStart(2, "0")}`;
          const hasLogOnSelectedDate = habit.logs.some(
            (log) => log.date === selectedDateStr,
          );

          if (
            completionsThisWeek >= habit.timesPerWeek &&
            !hasLogOnSelectedDate
          )
            return null;
        }

        if (
          selectedFilter === "one-time todo" &&
          habit.type === "one-time todo"
        ) {
          return renderHabitCell(habit);
        } else if (selectedFilter === "all") {
          return renderHabitCell(habit);
        } else if (
          selectedFilter === habit.preferredTimeOfDay ||
          (habit.preferredTimeOfDay === "anytime" &&
            selectedFilter !== "one-time todo")
        ) {
          return renderHabitCell(habit);
        }

        return null;
      })}

      <button
        onClick={() => setIsNewHabitFormVisible(true)}
        className="flex flex-col justify-center items-center gap-y-2 border-2 border-dashed rounded-[18px] border-gray-700 cursor-pointer py-16 hover:bg-blue-100"
      >
        <FaPlus className="text-[35px] text-gray-800" />
        <span className="text-4xl text-gray-800 font-extrabold">New Habit</span>
      </button>

      {new Date(
        `${selectedYearCalendar}-${selectedMonthCalendar + 1}-${selectedDate.date}`,
      ).setHours(0, 0, 0, 0) !== new Date().setHours(0, 0, 0, 0) && (
        <button
          onClick={() => {
            setSelectedMonthCalendar(new Date().getMonth());
            setSelectedYearCalendar(new Date().getFullYear());
            setSelectedDate({
              year: new Date().getFullYear(),
              month: new Date().getMonth(),
              date: new Date().getDate(),
            });
          }}
          style={{
            borderTopLeftRadius: "40px",
            borderBottomLeftRadius: "40px",
          }}
          className="fixed right-0 top-[50%] translate-y-[-50%] bg-blue-500 text-white font-bold text-3xl pr-3 pl-7 py-2 cursor-pointer flex items-center gap-2"
        >
          {getArrowSign()}
          <span>Today</span>
        </button>
      )}
    </div>
  );
}

export default HabitsDisplay;
