import { useState } from "react";
import { MdNavigateNext } from "react-icons/md";
import { MdNavigateBefore } from "react-icons/md";

function NewHabitFormCalendar({ oneTimeTodoDate, setOneTimeTodoDate }) {
  // variables
  const currentDate = new Date();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // state

  // this is the current year that you see on top of calendar
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  // this is the current month that you see on top of calendar
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());

  // this is the date that the user selects by clicking on it
  // const [selectedDate, setSelectedDate] = useState({
  //   year: currentDate.getFullYear(),
  //   month: currentDate.getMonth(),
  //   date: new Date().getDate(),
  // });
  const datesArr = getDatesArr(selectedMonth, selectedYear);

  // functions

  function handleMonthIncrement() {
    setSelectedMonth(selectedMonth + 1 === 12 ? 0 : selectedMonth + 1);

    if (selectedMonth + 1 === 12) {
      setSelectedYear(selectedYear + 1);
    }
  }

  function handleMonthDecrement() {
    setSelectedMonth(selectedMonth - 1 === -1 ? 11 : selectedMonth - 1);

    if (selectedMonth - 1 === -1) {
      setSelectedYear(selectedYear - 1);
    }
  }

  function getDatesArr(month, year) {
    const isLeapYear = (year) =>
      (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

    const monthDaysCount = (year) => [
      31,
      isLeapYear(year) ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ];

    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const datesArr = [];

    // pushing current month days to the array
    for (let i = 1; i <= monthDaysCount(year)[month]; i++) {
      datesArr.push({ date: i, month, year });
    }

    // pushing next month days if any
    const monthLastDay = String(
      new Date(year, month, datesArr[datesArr.length - 1].date),
    ).slice(0, 3);

    for (let i = 1; i <= 6 - weekDays.indexOf(monthLastDay); i++) {
      datesArr.push({
        date: i,
        month: month + 1 === 12 ? 0 : month + 1,
        year: month + 1 === 12 ? year + 1 : year,
      });
    }

    // pushing prev month days if any
    const monthFirstDay = String(new Date(year, month, 1)).slice(0, 3);
    for (let i = 0; i < weekDays.indexOf(monthFirstDay); i++) {
      const date = monthDaysCount(year)[month - 1 === -1 ? 11 : month - 1] - i;

      datesArr.unshift({
        date: date,
        month: month - 1 === -1 ? 11 : month - 1,
        year: month - 1 === -1 ? year - 1 : year,
      });
    }

    return datesArr;
  }

  // getDatesArr(10, 2025);

  return (
    <div className="flex flex-col justify-between border-[2px] border-gray-400  rounded-2xl overflow-hidden">
      <div className="flex justify-between items-center gap-x-4 w-[250px] mx-auto select-none">
        <MdNavigateBefore
          onClick={handleMonthDecrement}
          className="text-xl bg-[#44a8de] text-white rounded-[50%] cursor-pointer"
        />

        <span className="text-3xl font-medium">
          {months[selectedMonth].toUpperCase()} {selectedYear}
        </span>

        <MdNavigateNext
          onClick={handleMonthIncrement}
          className="text-xl bg-[#44a8de] text-white rounded-[50%] cursor-pointer"
        />
      </div>

      <div className="grid grid-cols-7 text-center font-semibold ">
        <span className="bg-[#44a8de] text-white">Mon</span>
        <span className="bg-[#44a8de] text-white">Tue</span>
        <span className="bg-[#44a8de] text-white">Wed</span>
        <span className="bg-[#44a8de] text-white">Thu</span>
        <span className="bg-[#44a8de] text-white">Fri</span>
        <span className="bg-[#44a8de] text-white">Sat</span>
        <span className="bg-[#44a8de] text-white">Sun</span>

        {datesArr.map((dateObj, i) => {
          return (
            <button
              type="button"
              disabled={
                new Date(
                  "" +
                    months[dateObj.month] +
                    " " +
                    dateObj.date +
                    " " +
                    dateObj.year,
                ) < new Date().setHours(0, 0, 0, 0)
              }
              onClick={() => {
                setOneTimeTodoDate({
                  year: dateObj.year,
                  month: dateObj.month,
                  date: dateObj.date,
                });
              }}
              className={`disabled:cursor-not-allowed cursor-pointer text-lg  ${
                dateObj.date === new Date().getDate() &&
                dateObj.month === new Date().getMonth() &&
                dateObj.year === new Date().getFullYear() &&
                "text-[#44a8de] font-extrabold"
              } ${i < 7 && dateObj.date > 7 && "text-gray-400 bg-gray-200"} ${
                dateObj.date === oneTimeTodoDate.date &&
                dateObj.month === oneTimeTodoDate.month &&
                dateObj.year === oneTimeTodoDate.year
                  ? "border-2 border-[#44a8de]"
                  : "border-[0.1px] border-gray-300"
              }`}
            >
              {dateObj.date}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default NewHabitFormCalendar;
