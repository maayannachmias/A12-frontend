import React from "react";
import { FaBars, FaUserCircle } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import ticTacTask from "../assets/tictactask.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = ({ sideBarToggle, setSideBarToggle }) => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });
  const handleClick = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <nav className=" bg-violet-200 dark:bg-violet-950 px-4 py-3 flex justify-between">
      <div className="flex items-center text-xl">
        <FaBars
          className="text-violet-950 dark:text-violet-300 dark:hover:text-violet-200 me-4 cursor-pointer hover:text-violet-800"
          onClick={() => setSideBarToggle(!sideBarToggle)}
        ></FaBars>
      </div>

      <img
        alt="tictactask"
        className="size-1/10 flex invisible lg:visible"
        src={ticTacTask}
      />

      <div className="flex items-center gap-x-5">
        <button onClick={toggleDarkMode} aria-label="Toggle Dark Mode">
          <div className="w-10 h-5 bg-slate-300 rounded-full px-0.5 dark:bg-slate-700 relative flex items-center dark:justify-end">
            <div className="w-4 h-4 rounded-full bg-violet-600 absolute"></div>
          </div>
        </button>
        <div className="relative">
          <button className="text-black group">
            <FaUserCircle className="dark:text-white text-purple-800 w-10 h-10 mt-1" />
            <div className="z-10 hidden absolute rounded-lg shadow w-40 group-focus:block top-full right-0 bg-slate-200">
              <ul className="py-2 text-sm text-gray-950">
                <li className="py-1">
                  {user && (
                    <span className="relative">
                      Hello, {user.fullName || user.email}!
                    </span>
                  )}
                </li>
                <li onClick={handleClick} className="py-2 rounded hover:shadow hover:bg-violet-800 hover:text-white dark:hover:bg-violet-400 dark:hover:text-violet-950">
                  <IoLogOutOutline className="inline-block w-6 h-6 mr-2 -mt-1" />{" "}
                  Log Out
                </li>
              </ul>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;