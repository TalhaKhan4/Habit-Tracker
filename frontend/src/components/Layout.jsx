import Nav from "./Nav";
import CreateNewHabit from "./CreateNewHabit";
import { Outlet } from "react-router-dom";
function Layout({ isNewHabitFormVisible, setIsNewHabitFormVisible }) {
  return (
    <div className="relative">
      <CreateNewHabit
        isNewHabitFormVisible={isNewHabitFormVisible}
        setIsNewHabitFormVisible={setIsNewHabitFormVisible}
      />

      <header>
        <Nav
          isNewHabitFormVisible={isNewHabitFormVisible}
          setIsNewHabitFormVisible={setIsNewHabitFormVisible}
        />
      </header>

      <main className="ml-[60px]">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
