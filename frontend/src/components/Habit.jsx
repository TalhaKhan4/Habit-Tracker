import {
  pushHabitLog,
  removeHabitLog,
  updateOneTimeTodoStatus,
} from "../features/habitsSlice";
import { useDispatch } from "react-redux";
import Loader from "./Loader.jsx";
import { useState } from "react";

function Habit({
  name,
  type,
  description,
  icon,
  color,
  logs,
  selectedDate,
  _id,
  isCompleted,
  setSelectedHabitId,
}) {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const selectedDate2 = new Date(
    `${selectedDate.year}-${selectedDate.month + 1}-${selectedDate.date}`,
  );

  const doesLogExist =
    type !== "one-time todo" &&
    logs.some((log) => {
      const logDate = new Date(log.date);
      return (
        logDate.getFullYear() === selectedDate2.getFullYear() &&
        logDate.getMonth() === selectedDate2.getMonth() &&
        logDate.getDate() === selectedDate2.getDate()
      );
    });

  const isChecked =
    (type === "regular" && doesLogExist) ||
    (type === "negative" &&
      !doesLogExist &&
      selectedDate2 <= new Date(new Date().setHours(0, 0, 0, 0))) ||
    (type === "one-time todo" && isCompleted);

  async function handleInputChange(e) {
    try {
      setIsLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}${type === "one-time todo" ? "/api/habits/set-one-time-todo-is-completed-status" : "/api/habit-logs/set-habit-completion"}`,
        {
          method: type === "one-time todo" ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            habitId: _id,
            date: `${selectedDate.year}-${
              String(selectedDate.month + 1).length === 1
                ? "0" + (selectedDate.month + 1)
                : selectedDate.month + 1
            }-${
              String(selectedDate.date).length === 1
                ? "0" + selectedDate.date
                : selectedDate.date
            }`,
            isCompleted: e.target.checked,
          }),
        },
      );

      const result = await response.json();
      if (result.data && result.data.todo) {
        dispatch(
          updateOneTimeTodoStatus({
            todoId: _id,
            isCompleted: result.data.todo.isCompleted,
          }),
        );
      } else if (result.success && result.data) {
        dispatch(pushHabitLog({ habitId: _id, log: result.data.habitLog }));
      } else if (result.success && !result.data) {
        dispatch(
          removeHabitLog({
            habitId: _id,
            date: `${selectedDate.year}-${
              String(selectedDate.month + 1).length === 1
                ? "0" + (selectedDate.month + 1)
                : selectedDate.month + 1
            }-${
              String(selectedDate.date).length === 1
                ? "0" + selectedDate.date
                : selectedDate.date
            }`,
          }),
        );
      } else {
        console.log(result);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      style={{
        backgroundColor: isChecked ? "#ebebeb" : color,
        boxShadow:
          !isChecked &&
          "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
        border: isChecked ? "0.5px solid #80808054" : "none",
      }}
      onClick={() => setSelectedHabitId(_id)}
      className="rounded-[18px] px-4 py-6 cursor-pointer h-full"
    >
      <div className="flex justify-between items-center">
        <span className={`text-3xl ${isChecked && "opacity-40"}`}>{icon}</span>

        {isLoading ? (
          <div>
            <Loader width="w-6" height="h-6" />
          </div>
        ) : (
          <form
            onClick={(e) => e.stopPropagation()}
            className={`${
              new Date(
                `${selectedDate.year}-${selectedDate.month + 1}-${selectedDate.date}`,
              ) > new Date() && "hidden"
            }`}
          >
            <label className="inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleInputChange}
                className="peer hidden"
              />
              <span
                className="
                  relative w-6 h-6 p-[2px] border-2 rounded-full
                  peer-checked:bg-black
                  peer-checked:after:content-['']
                  peer-checked:after:absolute
                  peer-checked:after:left-1/2
                  peer-checked:after:top-1/2
                  peer-checked:after:-translate-x-1/2
                  peer-checked:after:-translate-y-1/2
                  peer-checked:after:rotate-45
                  peer-checked:after:w-[6px]
                  peer-checked:after:h-[11px]
                  peer-checked:after:border-white
                  peer-checked:after:border-r-2
                  peer-checked:after:border-b-2
                "
              ></span>
            </label>
          </form>
        )}
      </div>

      <div className="mt-12">
        <h3 className={`font-extrabold text-2xl ${isChecked && "opacity-50"}`}>
          {name}
        </h3>
        <p className={`mt-1 font-semibold ${isChecked && "opacity-50"}`}>
          {description}
        </p>
      </div>
    </div>
  );
}

export default Habit;
