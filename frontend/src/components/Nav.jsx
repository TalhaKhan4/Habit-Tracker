import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// plus icon
import { HiOutlinePlus } from "react-icons/hi2";
// profile icon
import { faUser as faUserSolid } from "@fortawesome/free-solid-svg-icons";
// home icon
import { faHouse as faHouseSolid } from "@fortawesome/free-solid-svg-icons";
// logout icon
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
// friends icon
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";

function Nav({ page, isNewHabitFormVisible, setIsNewHabitFormVisible }) {
  const dispatch = useDispatch();

  // #252422
  // #353535
  // #372549

  const location = useLocation();

  return (
    <nav className="flex flex-col gap-y-8 w-max fixed top-[50%] translate-y-[-50%] px-2 py-8 bg-[#252422] rounded-tr-xl rounded-br-xl">
      {/* home link */}

      <NavLink to="/" className="flex flex-col items-center text-white">
        <div
          className={`p-[6px] flex justify-center items-center rounded-md ${
            location.pathname === "/"
              ? "bg-[#ffffff33]"
              : "hover:bg-[#ffffff33]"
          }`}
        >
          <FontAwesomeIcon
            icon={faHouseSolid}
            className={`text-[25px] ${
              location.pathname !== "/" && "text-gray-400"
            }`}
          />
        </div>

        <span className="font-semibold text-xs mt-[0px]">Home</span>
      </NavLink>

      {/* friends link */}

      <NavLink to="/social" className="flex flex-col items-center text-white">
        <div
          className={`p-[6px] flex justify-center items-center rounded-md ${
            location.pathname === "/social"
              ? "bg-[#ffffff33]"
              : "hover:bg-[#ffffff33]"
          }`}
        >
          <FontAwesomeIcon
            icon={faUserGroup}
            className={`text-[25px] ${
              location.pathname !== "/social" && "text-gray-400"
            }`}
          />
        </div>

        <span className="font-semibold text-xs mt-[0px]">Social</span>
      </NavLink>

      {/* create btn */}

      <button
        className="flex flex-col items-center cursor-pointer text-white"
        onClick={() => {
          setIsNewHabitFormVisible(true);
        }}
      >
        <div className="bg-blue-500 rounded-full p-1 hover:bg-blue-600 mb-2">
          <HiOutlinePlus className="text-2xl" />
        </div>
        <span className="font-semibold text-xs">Create</span>
      </button>

      {/* account link */}

      <NavLink to="/profile" className="flex flex-col items-center text-white">
        <div
          className={`p-[6px] flex justify-center items-center rounded-md ${
            location.pathname === "/profile"
              ? "bg-[#ffffff33]"
              : "hover:bg-[#ffffff33]"
          }`}
        >
          <FontAwesomeIcon
            icon={faUserSolid}
            className={`text-[25px] ${
              location.pathname !== "/profile" && "text-gray-400"
            }`}
          />
        </div>

        <span className="font-semibold text-xs mt-[0px]">Profile</span>
      </NavLink>

      {/* logout link */}

      <NavLink to="/logout" className="flex flex-col items-center text-white">
        <div
          className={`p-[6px] flex justify-center items-center rounded-md ${
            location.pathname === "/logout"
              ? "bg-[#ffffff33]"
              : "hover:bg-[#ffffff33]"
          }`}
        >
          <FontAwesomeIcon
            icon={faRightFromBracket}
            className={`text-[25px] ${
              location.pathname !== "/logout" && "text-gray-400"
            }`}
          />
        </div>

        <span className="font-semibold text-xs mt-[0px]">Logout</span>
      </NavLink>
    </nav>
  );
}

export default Nav;
