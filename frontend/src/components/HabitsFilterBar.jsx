// react icons

import { FaRegMoon } from "react-icons/fa";
import { WiSunrise } from "react-icons/wi";
import { AiOutlineSun } from "react-icons/ai";
import { FaRegSquareCheck } from "react-icons/fa6";

function HabitsFilterBar({ selectedFilter, setSelectedFilter }) {
  // 252422
  return (
    <div className="flex justify-center flex-wrap gap-7 text-xl font-bold py-3">
      {/* All */}
      <button
        className={`${
          selectedFilter === "all"
            ? "bg-blue-500 text-white"
            : "bg-[#252422] text-gray-200 hover:bg-[#000] hover:text-white hover:scale-[1.03] transition-all duration-75"
        } px-8 py-[9px] rounded-[25px] cursor-pointer`}
        onClick={() => {
          setSelectedFilter("all");
        }}
      >
        ALL
      </button>

      {/* Morning */}
      <button
        className={`${
          selectedFilter === "morning"
            ? "bg-blue-500 text-white"
            : "bg-[#252422] text-gray-200 hover:bg-[#000] hover:text-white hover:scale-[1.03] transition-all duration-75"
        } px-8 py-[9px] rounded-[25px]  cursor-pointer flex items-center gap-x-2`}
        onClick={() => {
          setSelectedFilter("morning");
        }}
      >
        <WiSunrise
          className={`text-3xl ${
            selectedFilter === "morning" && "text-[#ffbf00]"
          }`}
        />
        <span>MORNING</span>
      </button>

      {/* Afternoon */}
      <button
        className={`${
          selectedFilter === "afternoon"
            ? "bg-blue-500 text-white"
            : "bg-[#252422] text-gray-200 hover:bg-[#000] hover:text-white hover:scale-[1.03] transition-all duration-75"
        } px-8 py-[9px] rounded-[25px] cursor-pointer flex items-center gap-x-2`}
        onClick={() => {
          setSelectedFilter("afternoon");
        }}
      >
        <AiOutlineSun
          className={`text-2xl ${
            selectedFilter === "afternoon" && "text-[#ffbf00]"
          }`}
        />
        <span>AFTERNOON</span>
      </button>

      {/* evening */}

      <button
        className={`${
          selectedFilter === "evening"
            ? "bg-blue-500 text-white"
            : "bg-[#252422] text-gray-200 hover:bg-[#000] hover:text-white hover:scale-[1.03] transition-all duration-75"
        } px-8 py-[9px] rounded-[25px] cursor-pointer flex items-center gap-x-2`}
        onClick={() => {
          setSelectedFilter("evening");
        }}
      >
        <FaRegMoon
          className={`text-lg ${
            selectedFilter === "evening" && "text-[#ffbf00]"
          }`}
        />
        <span>EVENING</span>
      </button>

      {/* one-time todo */}

      <button
        className={`${
          selectedFilter === "one-time todo"
            ? "bg-blue-500 text-white"
            : "bg-[#252422] text-gray-200 hover:bg-[#000] hover:text-white hover:scale-[1.03] transition-all duration-75"
        } px-8 py-[9px] rounded-[25px] cursor-pointer flex items-center gap-x-2`}
        onClick={() => {
          setSelectedFilter("one-time todo");
        }}
      >
        <FaRegSquareCheck
          className={`${
            selectedFilter === "one-time todo" && "text-[#ffbf00]"
          }`}
        />
        <span>ONE-TIME TODO</span>
      </button>
    </div>
  );
}

export default HabitsFilterBar;
