import { useState } from "react";
import HabitsFilterBar from "../components/HabitsFilterBar.jsx";
import HabitsDisplay from "../components/HabitsDisplay.jsx";
import DatePicker from "../components/DatePicker.jsx";
import { useSelector } from "react-redux";
import HabitDetails from "../components/HabitDetails.jsx";

function Home({ isNewHabitFormVisible, setIsNewHabitFormVisible }) {
  // component state
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedHabitId, setSelectedHabitId] = useState(null);

  return (
    <div className="min-h-[100vh]">
      {/* <DatePicker /> */}

      <HabitsFilterBar
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
      />

      <HabitsDisplay
        selectedFilter={selectedFilter}
        isNewHabitFormVisible={isNewHabitFormVisible}
        setIsNewHabitFormVisible={setIsNewHabitFormVisible}
        setSelectedHabitId={setSelectedHabitId}
      />
      {selectedHabitId !== null && (
        <HabitDetails
          selectedHabitId={selectedHabitId}
          setSelectedHabitId={setSelectedHabitId}
        />
      )}
    </div>
  );
}

export default Home;
