import { useState } from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

const DAY_NAMES = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function toYMD(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function HabitCalendar({ habit }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const logSet = new Set((habit.logs || []).map((l) => l.date));

  function isDone(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date > today) return false;
    const has = logSet.has(toYMD(date));
    return habit.type === "negative" ? !has : has;
  }

  function buildCells() {
    const first = new Date(viewYear, viewMonth, 1);
    let dow = first.getDay();
    dow = dow === 0 ? 6 : dow - 1;

    const dim = new Date(viewYear, viewMonth + 1, 0).getDate();
    const pmd = new Date(viewYear, viewMonth, 0).getDate();
    const cells = [];

    for (let i = dow - 1; i >= 0; i--) {
      const pm = viewMonth === 0 ? 11 : viewMonth - 1;
      const py = viewMonth === 0 ? viewYear - 1 : viewYear;
      cells.push({ date: pmd - i, month: pm, year: py, other: true });
    }
    for (let d = 1; d <= dim; d++)
      cells.push({ date: d, month: viewMonth, year: viewYear, other: false });

    const rem = 42 - cells.length;
    for (let d = 1; d <= rem; d++) {
      const nm = viewMonth === 11 ? 0 : viewMonth + 1;
      const ny = viewMonth === 11 ? viewYear + 1 : viewYear;
      cells.push({ date: d, month: nm, year: ny, other: true });
    }
    return cells;
  }

  function handlePrev() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  }
  function handleNext() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  }

  return (
    <div className="rounded-xl border-2 border-gray-200 p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <MdNavigateBefore size={24} />
        </button>
        <span className="text-2xl font-black tracking-tight text-gray-900">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          onClick={handleNext}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <MdNavigateNext size={24} />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div
            key={d}
            className="text-center text-sm font-bold text-gray-500 uppercase tracking-wide pb-2"
          >
            {d}
          </div>
        ))}

        {buildCells().map((cell, i) => {
          if (cell.other) return <div key={i} className="h-12 invisible" />;

          const date = new Date(cell.year, cell.month, cell.date);
          const createdAt = new Date(habit.createdAt);
          createdAt.setHours(0, 0, 0, 0);
          const done = date >= createdAt && isDone(date);

          return (
            <div
              key={i}
              className={`h-12 rounded-lg flex items-center justify-center text-[17px] font-semibold
                ${done ? "bg-[#97C459] text-[#173404]" : "bg-gray-100 text-gray-500"}`}
            >
              {cell.date}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HabitCalendar;
