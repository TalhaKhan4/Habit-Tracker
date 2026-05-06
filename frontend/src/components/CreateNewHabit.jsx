import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { FaRepeat } from "react-icons/fa6";
import { LuBan } from "react-icons/lu";
// import { FaRegCheckCircle } from "react-icons/fa";
import { FaRegSquareCheck } from "react-icons/fa6";
import { MdClose } from "react-icons/md";
import NewHabitFormCalendar from "./NewHabitFormCalendar.jsx";
("./Calendar.jsx");
import { addHabit } from "../features/habitsSlice.js";
import Loader from "./Loader.jsx";
import { toast } from "react-toastify";

function CreateNewHabit({ isNewHabitFormVisible, setIsNewHabitFormVisible }) {
  const dispatch = useDispatch();

  const [habitName, setHabitName] = useState("");
  const [habitDescription, setHabitDescription] = useState("");
  const [habitIcon, setHabitIcon] = useState("");
  const [selectedColor, setSelectedColor] = useState("#80d8ff");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [selectedHabitType, setSelectedHabitType] = useState("regular");
  const [selectedHabitTime, setSelectedHabitTime] = useState("anytime");
  const [habitRepeatChoice, setHabitRepeatChoice] = useState("days-in-week");
  const [daysInWeek, setDaysInWeek] = useState([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ]);

  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const [timesPerWeek, setTimesPerWeek] = useState("6");
  const [oneTimeTodoDate, setOneTimeTodoDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    date: new Date().getDate(),
  });

  const createNewHabitFormRef = useRef(null);

  if (isNewHabitFormVisible) {
    // hiding scroll bar from body when the form is visible
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflowY = "auto";
    // document.body.style.overflowX = "auto";
  }

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
      // we are just seeing if there is only day on which the user does not wants to repeat the habit
      daysInWeek.reduce((missingDaysCount, day) => {
        if (day === "") missingDaysCount++;
        return missingDaysCount;
      }, 0) === 1
    ) {
      const days = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];
      return `Everyday except ${days[daysInWeek.indexOf("")]}`;
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

  function resetForm() {
    setHabitName("");
    setHabitDescription("");
    setHabitIcon("");
    setSelectedColor("#80d8ff");
    setIsFormSubmitted(false);
    setSelectedHabitType("regular");
    setSelectedHabitTime("anytime");
    setHabitRepeatChoice("days-in-week");
    setDaysInWeek([
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ]);
    setTimesPerWeek("6");
    setOneTimeTodoDate({
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      date: new Date().getDate(),
    });
  }

  async function handleFormSubmit(e) {
    setIsFormSubmitted(true);

    e.preventDefault();

    if (habitName === "") {
      createNewHabitFormRef.current.scrollTop = 325;
      return;
    }
    if (habitDescription === "") {
      createNewHabitFormRef.current.scrollTop = 475;
      return;
    }
    if (habitIcon === "") {
      createNewHabitFormRef.current.scrollTop = 620;
      return;
    }

    const data = {
      name: habitName,
      description: habitDescription,
      color: selectedColor,
      type: selectedHabitType,
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
        isCompleted: false,
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
      // console.log(data);
      setIsFormSubmitting(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/habits`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();
      // console.log(result);
      if (result.success) {
        dispatch(addHabit(result.data.newHabit));
        toast.success(
          `${result.data.newHabit.type === "one-time todo" ? "Todo" : "Habit"} created successfully!`,
        );
      }

      // alert(result.message);
    } catch (error) {
      console.log(error);
    } finally {
      setIsNewHabitFormVisible(false);
      resetForm();
      setIsFormSubmitting(false);
      createNewHabitFormRef.current.scrollTop = 0;
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.code === "Escape") {
        setIsNewHabitFormVisible(false);
        resetForm();
        createNewHabitFormRef.current.scrollTop = 0;
        // without this line of code below, after closing the form with Esc btn there will be a border around the New Habit btn added by the browser
        requestAnimationFrame(() => {
          document.activeElement?.blur();
        });
      }
    });
  }, []);

  const triangleBeforeCss = `
  relative
  before:content-['']
  before:absolute
  before:-top-3
  before:-translate-x-1/2
  before:w-0
  before:h-0
  before:border-l-12
  before:border-r-12
  before:border-b-12
  before:border-l-transparent
  before:border-r-transparent
  before:border-b-gray-800
  ${selectedHabitType === "regular" ? "before:left-[10%]" : selectedHabitType === "negative" ? "before:left-[43%]" : "before:left-[83%]"}
`;

  return (
    <div
      className={`absolute z-10 bg-[rgba(0,0,0,0.7)] w-[100%] h-[100%] ${
        isNewHabitFormVisible ? "block" : "hidden"
      }`}
      onClick={() => {
        setIsNewHabitFormVisible(false);
        resetForm();
        createNewHabitFormRef.current.scrollTop = 0;
      }}
    >
      <div
        ref={createNewHabitFormRef}
        className="overflow-auto bg-white fixed top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] w-[90vw] h-[90vh] py-7"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <p className="text-left pb-2 font-extrabold text-2xl w-[600px] mx-auto">
          Select a habit type
        </p>
        <div className="w-[600px] mx-auto flex justify-between font-semibold text-2xl">
          <button
            className={`flex flex-col items-center gap-y-2 cursor-pointer border-2 p-3 rounded-xl ${
              selectedHabitType === "regular"
                ? "bg-green-500 text-white"
                : "bg-gray-800 text-white"
            }`}
            onClick={() => setSelectedHabitType("regular")}
          >
            <FaRepeat />
            <span>Regular</span>
          </button>

          <button
            className={`flex flex-col items-center gap-y-2 cursor-pointer border-2 p-3 rounded-xl ${
              selectedHabitType === "negative"
                ? "bg-red-500 text-white"
                : "bg-gray-800 text-white"
            }`}
            onClick={() => {
              setSelectedHabitType("negative");
              setHabitRepeatChoice("days-in-week");
              setDaysInWeek([
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday",
              ]);
            }}
          >
            <LuBan />
            <span>Negative</span>
          </button>

          <button
            className={`flex flex-col items-center gap-y-2 cursor-pointer border-2 p-3 rounded-xl ${
              selectedHabitType === "one-time todo"
                ? "bg-sky-500 text-white"
                : "bg-gray-800 text-white"
            }`}
            onClick={() => setSelectedHabitType("one-time todo")}
          >
            <FaRegSquareCheck />
            <span>One-Time Todo</span>
          </button>
        </div>

        <div
          className={`${triangleBeforeCss} border-2 w-[600px] mx-auto mt-5 bg-gray-800 text-white p-4 rounded-xl`}
        >
          <span className="font-bold text-xl mb-2 block">
            {selectedHabitType === "regular"
              ? "Regular"
              : selectedHabitType === "negative"
                ? "Negative"
                : "One-Time Todo"}
          </span>
          <p className="text-[18px] text-gray-200">
            {selectedHabitType === "regular"
              ? "Related to your daily routine. Check it in a regular and repeated way. E.g. Do yoga three times a week"
              : selectedHabitType === "negative"
                ? "Start each day as complete. Only to uncheck it when you fail. E.g. quit smoking or sugar"
                : "Remind you of important one-time events on a specific date you set. E.g. Take a medical test on Friday"}
          </p>
        </div>

        <form className="flex flex-col justify-center items-center">
          <label
            className="block font-extrabold text-2xl pb-2 mt-12 text-left w-[600px]"
            htmlFor="habit-name"
          >
            {selectedHabitType === "one-time todo" ? "Todo Name" : "Habit Name"}
          </label>

          <input
            id="habit-name"
            type="text"
            value={habitName}
            onInput={(e) => {
              setHabitName(e.target.value);
            }}
            placeholder={`Enter ${
              selectedHabitType === "one-time todo" ? "Todo" : "Habit"
            } Name here`}
            className={`border-2 border-black text-xl p-3 font-bold w-[600px] rounded-md outline-0 focus:border-transparent focus:outline-3 focus:outline-[#1818ad]`}
          />

          {habitName === "" && isFormSubmitted && (
            <span className="text-red-500 font-bold w-[600px] pl-1.5 pt-1">
              {selectedHabitType === "one-time todo" ? "Todo" : "Habit"} name is
              required
            </span>
          )}

          <label
            className="block font-extrabold text-2xl pb-2 mt-12 text-left w-[600px]"
            htmlFor="habit-desc"
          >
            {selectedHabitType === "one-time todo"
              ? "Todo description"
              : "Habit description"}
          </label>

          <input
            id="habit-desc"
            type="text"
            value={habitDescription}
            onInput={(e) => {
              setHabitDescription(e.target.value);
            }}
            placeholder={`Enter ${
              selectedHabitType === "one-time todo" ? "Todo" : "Habit"
            } description here`}
            className={`border-2 border-black text-xl p-3 font-bold w-[600px] rounded-md outline-0 focus:border-transparent focus:outline-3 focus:outline-[#1818ad]`}
          />

          {habitDescription === "" && isFormSubmitted && (
            <span className="text-red-500 font-bold w-[600px] pl-1.5 pt-1">
              {selectedHabitType === "one-time todo" ? "Todo" : "Habit"}{" "}
              description is required
            </span>
          )}

          <label
            className="block font-extrabold text-2xl pb-2 mt-12 text-left w-[600px]"
            htmlFor="habit-icon"
          >
            {selectedHabitType === "one-time todo" ? "Todo Icon" : "Habit Icon"}
          </label>

          <input
            id="habit-icon"
            type="text"
            value={habitIcon}
            onInput={(e) => setHabitIcon(e.target.value)}
            placeholder={`Enter ${
              selectedHabitType === "one-time todo" ? "Todo" : "Habit"
            } icon here`}
            className={`border-2 border-black text-xl p-3 font-bold w-[600px] rounded-md outline-0 focus:border-transparent focus:outline-3 focus:outline-[#1818ad]`}
          />

          {habitIcon === "" && isFormSubmitted && (
            <span className="text-red-500 font-bold w-[600px] pl-1.5 pt-1">
              {selectedHabitType === "one-time todo" ? "Todo" : "Habit"} icon is
              required
            </span>
          )}

          <span
            className="block font-extrabold text-2xl pb-2 mt-12 text-left w-[600px]"
            htmlFor="habit-color"
          >
            Select a {selectedHabitType === "one-time todo" ? "todo" : "habit"}{" "}
            color
          </span>

          <div className="w-[600px]">
            <div className="flex gap-x-8">
              <div
                // ok
                className={`bg-[#80d8ff] w-[50px] h-[50px] rounded-sm cursor-pointer ${
                  selectedColor === "#80d8ff" && "border-3"
                }`}
                onClick={() => setSelectedColor("#80d8ff")}
              ></div>
              <div
                // ok
                className={`bg-[#71ffa6] w-[50px] h-[50px] rounded-sm cursor-pointer ${
                  selectedColor === "#71ffa6" && "border-3"
                }`}
                onClick={() => setSelectedColor("#71ffa6")}
              ></div>
              <div
                // ok
                className={`bg-[#fcf300] w-[50px] h-[50px] rounded-sm cursor-pointer ${
                  selectedColor === "#fcf300" && "border-3"
                }`}
                onClick={() => setSelectedColor("#fcf300")}
              ></div>
              <div
                // ok
                className={`bg-[#b388ff] w-[50px] h-[50px] rounded-sm cursor-pointer ${
                  selectedColor === "#b388ff" && "border-3"
                }`}
                onClick={() => setSelectedColor("#b388ff")}
              ></div>
              <div
                // ok
                className={`bg-[#ff9b4b] w-[50px] h-[50px] rounded-sm cursor-pointer ${
                  selectedColor === "#ff9b4b" && "border-3"
                }`}
                onClick={() => setSelectedColor("#ff9b4b")}
              ></div>
              <div
                className={`bg-[#ea80fc] w-[50px] h-[50px] rounded-sm cursor-pointer ${
                  selectedColor === "#ea80fc" && "border-3"
                }`}
                onClick={() => setSelectedColor("#ea80fc")}
              ></div>
              <div
                // ok
                className={`bg-[#ff5172] w-[50px] h-[50px] rounded-sm cursor-pointer ${
                  selectedColor === "#ff5172" && "border-3"
                }`}
                onClick={() => setSelectedColor("#ff5172")}
              ></div>
              <div
                // ok
                className={`bg-[#ff8a80] w-[50px] h-[50px] rounded-sm cursor-pointer ${
                  selectedColor === "#ff8a80" && "border-3"
                }`}
                onClick={() => setSelectedColor("#ff8a80")}
              ></div>
            </div>
          </div>

          <div
            className={`flex flex-col w-[600px] ${
              selectedHabitType === "negative" ? "hidden" : "block"
            }`}
          >
            <span className="text-left pb-2 font-extrabold text-2xl w-[600px] mx-auto mt-12">
              Do it at
            </span>

            <div className={`flex justify-between`}>
              <button
                className={`flex items-center gap-x-2 cursor-pointer border-2 p-3 rounded-xl ${
                  selectedHabitTime === "anytime"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-800 text-white"
                }`}
                onClick={() => setSelectedHabitTime("anytime")}
                type="button"
              >
                <span className="font-semibold text-xl px-3">Anytime</span>
              </button>
              <button
                className={`flex items-center gap-x-2 cursor-pointer border-2 p-3 rounded-xl ${
                  selectedHabitTime === "morning"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-800 text-white"
                }`}
                onClick={() => setSelectedHabitTime("morning")}
                type="button"
              >
                <span className="font-semibold text-xl px-3">Morning</span>
              </button>
              <button
                className={`flex items-center gap-x-2 cursor-pointer border-2 p-3 rounded-xl ${
                  selectedHabitTime === "afternoon"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-800 text-white"
                }`}
                onClick={() => setSelectedHabitTime("afternoon")}
                type="button"
              >
                <span className="font-semibold text-xl px-3">Afternoon</span>
              </button>{" "}
              <button
                className={`flex items-center gap-x-2 cursor-pointer border-2 p-3 rounded-xl ${
                  selectedHabitTime === "evening"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-800 text-white"
                }`}
                onClick={() => setSelectedHabitTime("evening")}
                type="button"
              >
                <span className="font-semibold text-xl px-3">Evening</span>
              </button>{" "}
            </div>
          </div>

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
                />

                <span className="font-bold text-xl">Specific days in week</span>
              </div>

              <div
                className={`mt-2 flex gap-x-5 ${
                  habitRepeatChoice === "days-in-week" ? "block" : "hidden"
                }`}
              >
                {[
                  "monday",
                  "tuesday",
                  "wednesday",
                  "thursday",
                  "friday",
                  "saturday",
                  "sunday",
                ].map((day, i) => (
                  <button
                    className={`
                      cursor-pointer disabled:cursor-not-allowed font-semibold text-xl py-2 px-4 rounded-md ${
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
                        else return copy;
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
                  disabled={selectedHabitType === "negative"}
                />

                <span className="font-bold text-xl">X days per week</span>
              </div>

              <div
                className={`mt-2 flex gap-x-2 ${
                  habitRepeatChoice === "days-per-week" ? "block" : "hidden"
                }`}
              >
                {["1", "2", "3", "4", "5", "6"].map((dayCount, i) => (
                  <button
                    className={`
                      cursor-pointer font-semibold text-xl py-2 px-4 rounded-md 
                      ${
                        timesPerWeek !== dayCount
                          ? "bg-gray-800 text-gray-200"
                          : "bg-blue-500 text-white"
                      }`}
                    type="button"
                    onClick={() => setTimesPerWeek(String(dayCount))}
                  >
                    {dayCount}
                  </button>
                ))}
              </div>
            </div>{" "}
          </div>

          <div
            className={`flex flex-col w-[600px] ${
              selectedHabitType === "regular" ||
              selectedHabitType === "negative"
                ? "hidden"
                : "block"
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

          {/* <button
            onClick={(e) => handleFormSubmit(e)}
            className="text-3xl font-semibold mt-8 bg-green-500 text-white w-[230px] py-2 cursor-pointer rounded-md"
          >
            {isFormSubmitting ? <Loader /> : "Submit"}
          </button> */}

          <button
            disabled={isFormSubmitting}
            className="mt-8 border-1 rounded-xl py-[13px] hover:bg-black bg-gray-800 text-white font-medium text-3xl cursor-pointer w-[200px]"
            onClick={handleFormSubmit}
          >
            {isFormSubmitting ? <Loader width="w-8" height="h-8" /> : "Create"}
          </button>
        </form>
      </div>

      <button
        onClick={() => {
          setIsNewHabitFormVisible(false);
          resetForm();
        }}
        className="fixed outline-none top-8 right-4 cursor-pointer"
      >
        <MdClose className="text-lg text-white" />
      </button>
    </div>
  );
}

export default CreateNewHabit;
