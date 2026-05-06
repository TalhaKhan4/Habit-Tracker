import { useEffect, useState } from "react";
import Nav from "../components/Nav.jsx";
import { useNavigate } from "react-router-dom";
import { logOut } from "../features/userSlice.js";
import { useDispatch } from "react-redux";
import Loader from "../components/Loader.jsx";
import { toast } from "react-toastify";

function LogOut() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  async function handleLogOut() {
    try {
      setIsLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {
          method: "POST",

          credentials: "include",
        },
      );

      const result = await response.json();

      if (result.success) {
        dispatch(logOut());
        toast.success("Logged out successfully!");
      }
      console.log(result);
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    }
  }
  return (
    <div className="flex flex-col justify-center items-center gap-y-7 min-h-[100vh]">
      <p className="text-4xl font-bold">Are you sure you want to logout?</p>
      <button
        disabled={isLoading}
        className="border-1 rounded-xl py-[13px] hover:bg-black bg-[rgba(0,0,0,0.85)] text-white font-medium text-2xl cursor-pointer w-[200px]"
        onClick={handleLogOut}
      >
        {isLoading ? <Loader width="w-8" height="h-8" /> : "Log Out"}
      </button>
    </div>
  );
}

export default LogOut;
