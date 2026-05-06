import { useDispatch } from "react-redux";
import { useState, useRef } from "react";
import { MdClose } from "react-icons/md";
import NewHabitFormCalendar from "./NewHabitFormCalendar.jsx";
import Loader from "./Loader.jsx";
import { toast } from "react-toastify";
import { updateHabit } from "../features/habitsSlice.js";

function EditHabitForm({ habit, onClose, onFullClose }) {
  const dispatch = useDispatch();

  const [habitName, setHabitName] = useState(habit.name || "");
  const [habitDescription, setHabitDescription] = useState(
    habit.description || "",
  );
  const [habitIcon, setHabitIcon] = useState(habit.icon || "");
  const [selectedColor, setSelectedColor] = useState(habit.color || "#80d8ff");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // Habit type is fixed — read from the existing habit
  const selectedHabitType = habit.type;

  // Time of day
  const [selectedHabitTime, setSelectedHabitTime] = useState(
    habit.preferredTimeOfDay || "anytime",
  );

  // Repeat / schedule
  const [habitRepeatChoice, setHabitRepeatChoice] = useState(
    habit.scheduleType === "timesPerWeek" ? "days-per-week" : "days-in-week",
  );

  const allWeekDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  // Build the daysInWeek array (empty string = deselected)
  const [daysInWeek, setDaysInWeek] = useState(() =>
    allWeekDays.map((day) => (habit.daysOfWeek?.includes(day) ? day : "")),
  );

  const [timesPerWeek, setTimesPerWeek] = useState(
    String(habit.timesPerWeek || "6"),
  );

  // One-time todo date
  const parseHabitDate = () => {
    if (habit.date) {
      const d = new Date(habit.date);
      return {
        year: d.getFullYear(),
        month: d.getMonth(),
        date: d.getDate(),
      };
    }
    return {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      date: new Date().getDate(),
    };
  };
  const [oneTimeTodoDate, setOneTimeTodoDate] = useState(parseHabitDate);

  const editHabitFormRef = useRef(null);

  // Prevent body scroll while open
  document.body.style.overflow = "hidden";

  function getRepeatText() {
    if (habitRepeatChoice === "days-per-week") {
      return `${timesPerWeek} ${timesPerWeek === "1" ? "day" : "days"} per week`;
    }

    if (
      daysInWeek.join() ===
      "monday,tuesday,wednesday,thursday,friday,saturday,sunday"
    ) {
      return "Everyday";
    } else if (
      daysInWeek.join() === "monday,tuesday,wednesday,thursday,friday,,"
    ) {
      return "Weekdays";
    } else if (daysInWeek.join() === ",,,,,saturday,sunday") {
      return "Weekends";
    } else if (
      daysInWeek.reduce((missingDaysCount, day) => {
        if (day === "") missingDaysCount++;
        return missingDaysCount;
      }, 0) === 1
    ) {
      return `Everyday except ${allWeekDays[daysInWeek.indexOf("")]}`;
    } else {
      const dayAbbreviations = {
        monday: "Mon",
        tuesday: "Tue",
        wednesday: "Wed",
        thursday: "Thu",
        friday: "Fri",
        saturday: "Sat",
        sunday: "Sun",
      };
      return daysInWeek
        .filter((day) => day !== "")
        .map((day) => dayAbbreviations[day])
        .join(", ");
    }
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    setIsFormSubmitted(true);

    if (habitName === "") {
      editHabitFormRef.current.scrollTop = 100;
      return;
    }
    if (habitDescription === "") {
      editHabitFormRef.current.scrollTop = 250;
      return;
    }
    if (habitIcon === "") {
      editHabitFormRef.current.scrollTop = 400;
      return;
    }

    const data = {
      name: habitName,
      description: habitDescription,
      color: selectedColor,
      icon: habitIcon,
      preferredTimeOfDay:
        selectedHabitType === "negative" ? "anytime" : selectedHabitTime,

      ...(selectedHabitType !== "one-time todo" && {
        scheduleType:
          habitRepeatChoice === "days-in-week"
            ? "daysOfWeek"
            : habitRepeatChoice === "days-per-week"
              ? "timesPerWeek"
              : "",
      }),

      ...(selectedHabitType !== "one-time todo" &&
        habitRepeatChoice === "days-in-week" && {
          daysOfWeek: daysInWeek.filter((day) => day !== ""),
        }),

      ...(selectedHabitType !== "one-time todo" &&
        habitRepeatChoice === "days-per-week" && {
          timesPerWeek: Number(timesPerWeek),
        }),

      ...(selectedHabitType === "one-time todo" && {
        date: `${oneTimeTodoDate.year}-${
          String(oneTimeTodoDate.month + 1).length === 1
            ? "0" + (oneTimeTodoDate.month + 1)
            : oneTimeTodoDate.month + 1
        }-${
          String(oneTimeTodoDate.date).length === 1
            ? "0" + oneTimeTodoDate.date
            : oneTimeTodoDate.date
        }`,
      }),
    };

    try {
      setIsFormSubmitting(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/habits/${habit._id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();
      console.log(result);

      if (result.success) {
        // 1. Update Redux
        dispatch(updateHabit({ habitId: habit._id, updatedData: data }));

        // 2. Close modal / restore scroll
        onFullClose();
        // 3. Toast
        toast.success("Habit updated successfully");
      } else {
        toast.error(result.message || "Failed to update habit");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsFormSubmitting(false);
    }
  }

  function handleClose(e) {
    e.stopPropagation();
    document.body.style.overflow = "auto";
    onClose();
  }

  // Type label and accent colour for the read-only badge
  const typeConfig = {
    regular: { label: "Regular", accent: "bg-green-500" },
    negative: { label: "Negative", accent: "bg-red-500" },
    "one-time todo": { label: "One-Time Todo", accent: "bg-sky-500" },
  };
  const { label: typeLabel, accent: typeAccent } =
    typeConfig[selectedHabitType] ?? typeConfig["regular"];

  return (
    <div
      className="absolute z-20 bg-[rgba(0,0,0,0.7)] w-[100%] h-[100%]"
      onClick={handleClose}
    >
      <div
        ref={editHabitFormRef}
        className="overflow-auto bg-white fixed top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] w-[90vw] h-[90vh] py-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <p className="text-left pb-2 font-extrabold text-2xl w-[600px] mx-auto">
          Edit {selectedHabitType === "one-time todo" ? "Todo" : "Habit"}
        </p>

        {/* ── Read-only habit type badge ── */}
        <div className="w-[600px] mx-auto mt-3 font-semibold">
          <div className="flex items-center gap-x-3 bg-gray-100 border border-gray-300 rounded-xl px-5 py-5">
            <svg
              width="17"
              height="17"
              viewBox="0 0 12 12"
              fill="none"
              className="text-gray-500 shrink-0"
            >
              <rect
                x="1"
                y="5"
                width="10"
                height="6"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <path
                d="M3.5 5V3.5a2.5 2.5 0 0 1 5 0V5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-gray-700 text-base">
              This is a <strong className="text-gray-900">{typeLabel}</strong>{" "}
              {selectedHabitType !== "one-time todo" && "habit"} — the type
              can't be changed after creation.
            </span>
          </div>
        </div>

        <form className="flex flex-col justify-center items-center mt-6">
          {/* ── Habit Name ── */}
          <label
            className="block font-extrabold text-2xl pb-2 text-left w-[600px]"
            htmlFor="edit-habit-name"
          >
            {selectedHabitType === "one-time todo" ? "Todo Name" : "Habit Name"}
          </label>

          <input
            id="edit-habit-name"
            type="text"
            value={habitName}
            onInput={(e) => setHabitName(e.target.value)}
            placeholder={`Enter ${
              selectedHabitType === "one-time todo" ? "Todo" : "Habit"
            } Name here`}
            className="border-2 border-black text-xl p-3 font-bold w-[600px] rounded-md outline-0 focus:border-transparent focus:outline-3 focus:outline-[#1818ad]"
          />
          {habitName === "" && isFormSubmitted && (
            <span className="text-red-500 font-bold w-[600px] pl-1.5 pt-1">
              {selectedHabitType === "one-time todo" ? "Todo" : "Habit"} name is
              required
            </span>
          )}

          {/* ── Habit Description ── */}
          <label
            className="block font-extrabold text-2xl pb-2 mt-12 text-left w-[600px]"
            htmlFor="edit-habit-desc"
          >
            {selectedHabitType === "one-time todo"
              ? "Todo description"
              : "Habit description"}
          </label>

          <input
            id="edit-habit-desc"
            type="text"
            value={habitDescription}
            onInput={(e) => setHabitDescription(e.target.value)}
            placeholder={`Enter ${
              selectedHabitType === "one-time todo" ? "Todo" : "Habit"
            } description here`}
            className="border-2 border-black text-xl p-3 font-bold w-[600px] rounded-md outline-0 focus:border-transparent focus:outline-3 focus:outline-[#1818ad]"
          />
          {habitDescription === "" && isFormSubmitted && (
            <span className="text-red-500 font-bold w-[600px] pl-1.5 pt-1">
              {selectedHabitType === "one-time todo" ? "Todo" : "Habit"}{" "}
              description is required
            </span>
          )}

          {/* ── Habit Icon ── */}
          <label
            className="block font-extrabold text-2xl pb-2 mt-12 text-left w-[600px]"
            htmlFor="edit-habit-icon"
          >
            {selectedHabitType === "one-time todo" ? "Todo Icon" : "Habit Icon"}
          </label>

          <input
            id="edit-habit-icon"
            type="text"
            value={habitIcon}
            onInput={(e) => setHabitIcon(e.target.value)}
            placeholder={`Enter ${
              selectedHabitType === "one-time todo" ? "Todo" : "Habit"
            } icon here`}
            className="border-2 border-black text-xl p-3 font-bold w-[600px] rounded-md outline-0 focus:border-transparent focus:outline-3 focus:outline-[#1818ad]"
          />
          {habitIcon === "" && isFormSubmitted && (
            <span className="text-red-500 font-bold w-[600px] pl-1.5 pt-1">
              {selectedHabitType === "one-time todo" ? "Todo" : "Habit"} icon is
              required
            </span>
          )}

          {/* ── Color Picker ── */}
          <span className="block font-extrabold text-2xl pb-2 mt-12 text-left w-[600px]">
            Select a {selectedHabitType === "one-time todo" ? "todo" : "habit"}{" "}
            color
          </span>

          <div className="w-[600px]">
            <div className="flex gap-x-8">
              {[
                "#80d8ff",
                "#71ffa6",
                "#fcf300",
                "#b388ff",
                "#ff9b4b",
                "#ea80fc",
                "#ff5172",
                "#ff8a80",
              ].map((color) => (
                <div
                  key={color}
                  className={`w-[50px] h-[50px] rounded-sm cursor-pointer ${
                    selectedColor === color ? "border-3" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          {/* ── Time of Day (hidden for negative) ── */}
          <div
            className={`flex flex-col w-[600px] ${
              selectedHabitType === "negative" ? "hidden" : "block"
            }`}
          >
            <span className="text-left pb-2 font-extrabold text-2xl w-[600px] mx-auto mt-12">
              Do it at
            </span>

            <div className="flex justify-between">
              {["anytime", "morning", "afternoon", "evening"].map((time) => (
                <button
                  key={time}
                  className={`flex items-center gap-x-2 cursor-pointer border-2 p-3 rounded-xl ${
                    selectedHabitTime === time
                      ? "bg-blue-500 text-white"
                      : "bg-gray-800 text-white"
                  }`}
                  onClick={() => setSelectedHabitTime(time)}
                  type="button"
                >
                  <span className="font-semibold text-xl px-3">
                    {time.charAt(0).toUpperCase() + time.slice(1)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Repeat (hidden for one-time todo) ── */}
          <div
            className={`flex flex-col w-[600px] ${
              selectedHabitType === "one-time todo" ? "hidden" : "block"
            }`}
          >
            <span className="text-left pb-2 font-extrabold text-2xl w-[600px] mx-auto mt-12">
              Repeat : {getRepeatText()}
            </span>

            <div>
              <div className="flex gap-x-4">
                <input
                  type="radio"
                  className="cursor-pointer"
                  checked={habitRepeatChoice === "days-in-week"}
                  onClick={() => setHabitRepeatChoice("days-in-week")}
                  onChange={() => {}}
                />
                <span className="font-bold text-xl">Specific days in week</span>
              </div>

              <div
                className={`mt-2 flex gap-x-5 ${
                  habitRepeatChoice === "days-in-week" ? "block" : "hidden"
                }`}
              >
                {allWeekDays.map((day, i) => (
                  <button
                    key={day}
                    className={`cursor-pointer disabled:cursor-not-allowed font-semibold text-xl py-2 px-4 rounded-md ${
                      daysInWeek[i] === ""
                        ? "bg-gray-800 text-gray-200"
                        : "bg-blue-500 text-white"
                    }`}
                    type="button"
                    disabled={selectedHabitType === "negative"}
                    onClick={() => {
                      setDaysInWeek((prev) => {
                        const copy = [...prev];
                        copy[i] = copy[i] === "" ? day : "";
                        if (copy.join("").length === 0) return [...prev];
                        return copy;
                      });
                    }}
                  >
                    {day[0].toUpperCase() + day.slice(1, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mt-3 flex gap-x-4">
                <input
                  type="radio"
                  className="disabled:cursor-not-allowed cursor-pointer"
                  checked={habitRepeatChoice === "days-per-week"}
                  onClick={() => setHabitRepeatChoice("days-per-week")}
                  onChange={() => {}}
                  disabled={selectedHabitType === "negative"}
                />
                <span className="font-bold text-xl">X days per week</span>
              </div>

              <div
                className={`mt-2 flex gap-x-2 ${
                  habitRepeatChoice === "days-per-week" ? "block" : "hidden"
                }`}
              >
                {["1", "2", "3", "4", "5", "6"].map((dayCount) => (
                  <button
                    key={dayCount}
                    className={`cursor-pointer font-semibold text-xl py-2 px-4 rounded-md ${
                      timesPerWeek !== dayCount
                        ? "bg-gray-800 text-gray-200"
                        : "bg-blue-500 text-white"
                    }`}
                    type="button"
                    onClick={() => setTimesPerWeek(dayCount)}
                  >
                    {dayCount}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Date picker (one-time todo only) ── */}
          <div
            className={`flex flex-col w-[600px] ${
              selectedHabitType === "one-time todo" ? "block" : "hidden"
            }`}
          >
            <span className="text-left pb-2 font-extrabold text-2xl w-[600px] mx-auto mt-12">
              Select a date
            </span>
            <div>
              <NewHabitFormCalendar
                oneTimeTodoDate={oneTimeTodoDate}
                setOneTimeTodoDate={setOneTimeTodoDate}
              />
            </div>
          </div>

          {/* ── Submit ── */}
          <button
            disabled={isFormSubmitting}
            className="mt-8 border-1 rounded-xl py-[13px] hover:bg-black bg-gray-800 text-white font-medium text-3xl cursor-pointer w-[200px]"
            onClick={handleFormSubmit}
          >
            {isFormSubmitting ? <Loader width="w-8" height="h-8" /> : "Update"}
          </button>
        </form>
      </div>

      {/* ── Close button ── */}
      <button
        onClick={handleClose}
        className="fixed outline-none top-8 right-4 cursor-pointer"
      >
        <MdClose className="text-lg text-white" />
      </button>
    </div>
  );
}

export default EditHabitForm;
