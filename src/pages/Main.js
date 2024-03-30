import React from 'react';
import { Link } from "react-router-dom";
import logo from "../assets/tictactask.png";
import flyingRocket from "../assets/Wavy_Bus-03_Single-06.png";
import { useEffect, useState } from "react";
import '../style/App.css';

const MainPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return (
        localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) &&
            window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
});

useEffect(() => {
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
}, [isDarkMode]);

const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return ( 
    <div className="min-h-screen bg-slate-200 dark:bg-slate-800 dark:text-slate-400 flex flex-col items-center justify-center p-4">
      {/* Main Picture */}
      <div className="flex justify-center">
        <img src={flyingRocket} alt="Main" className="xs:max-w-xs sm:max-w-sm md:max-w-sm lg:max-w-md xl:max-w-md" />
      </div>
      {/* Logo */}
      <div className="mb-4 mt-4">
        <img src={logo} className="w-40 md:w-48 lg:w-56" alt="Logo" />
      </div>

      {/* Sentence about Productivity */}
      <p className="text-center text-sm sm:text-md md:text-lg lg:text-xl xl:text-2xl text-gray-700 dark:text-slate-200 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mb-6">
        Unlock your productivity with our tools and make every day more efficient.
      </p>

      {/* Let's Start Button */}
      <button
        className="group relative flex justify-center rounded-md border border-transparent bg-purple-700 py-2 px-4 sm:px-8 text-sm sm:text-md md:text-lg font-medium
         text-white hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <Link to="/login" className="text-white no-underline">Let's Start</Link>
      </button>

      <div className="flex justify-center items-center mt-8">
        <button onClick={toggleDarkMode} aria-label="Toggle Dark Mode">
          <div className="w-10 h-5 bg-slate-300 rounded-full px-0.5 dark:bg-slate-700/[.3] relative flex items-center dark:justify-end">
            <div className="w-4 h-4 rounded-full bg-violet-600 absolute"></div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default MainPage;
