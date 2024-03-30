import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, addYears, isSameMonth, isSameDay } from "date-fns";
import "../style/Calendar.css";
import { useTasksContext } from "../hooks/useTasksContext";
import { useAuthContext } from "../hooks/useAuthContext";
import TaskDetails from "./TaskDetails";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { tasks, dispatch } = useTasksContext();
  const { user } = useAuthContext();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isFadeIn, setIsFadeIn] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch("/api/tasks", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_TASKS", payload: json });
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [dispatch, user]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const days = [];
  let day = startDate;

  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const getTasksForDay = (day) => {
    const tasksForDay = tasks.filter((task) => isSameDay(new Date(task.deadline), day));
    return tasksForDay;
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsPopupVisible(true);
    setIsFadeIn(true);
  };

  const closePopup = () => {
    setIsFadeIn(false);

    setTimeout(() => {
      setIsPopupVisible(false);
      setIsFadeIn(false);
    }, 300); // Delay of 300 milliseconds to match the CSS transition duration
  };

  const navigateToPrev = () => {
    setCurrentDate(addMonths(currentDate, -1));
  };

  const navigateToNext = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const navigateToToday = () => {
    setCurrentDate(new Date());
  };

  const navigateToDate = (date) => {
    const selectedDate = new Date(date);
    if (!isNaN(selectedDate)) {
      setCurrentDate(selectedDate);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="flex items-center justify-between mb-4">
        <button className="text-gray-600 hover:text-gray-700 dark:hover:text-white transition" onClick={navigateToPrev}>
          Prev
        </button>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{format(currentDate, "MMMM yyyy")}</h2>
        <button className="text-gray-600 hover:text-gray-700 dark:hover:text-white transition" onClick={navigateToNext}>
          Next
        </button>
        <button className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition" onClick={navigateToToday}>
          Today
        </button>
        <div className="flex items-center">
          <label htmlFor="datepicker" className="text-sm text-gray-600 dark:text-gray-400 mr-2">Go to Date:</label>
          <input
            type="date"
            id="datepicker"
            className="p-2 border rounded"
            value={format(currentDate, "yyyy-MM-dd")}
            onChange={(e) => navigateToDate(new Date(e.target.value))}
          />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-4">
        {days.map((day) => (
          <div
            key={day.toString()}
            className={`p-4 border rounded-lg ${!isSameMonth(day, monthStart) ? "bg-gray-200 dark:bg-gray-700" : "bg-white dark:bg-gray-800"}`}
          >
            <div className="font-semibold text-gray-700 dark:text-gray-300">{format(day, "EEE")}</div>
            <div className="text-lg font-bold text-gray-800 dark:text-white">{format(day, "d")}</div>
            <div className="mt-2">
              {getTasksForDay(day).map((task) => (
                <button
                  key={task._id}
                  className={`block truncate w-full text-left ${task.isCompleted ? "text-gray-400 line-through" : "text-gray-700 hover:underline dark:text-gray-300 dark:hover:text-white"} p-2 my-1 transition`}
                  onClick={() => handleTaskClick(task)}
                >
                  {task.title}
                  {task.isCompleted && <span className="material-icons">check</span>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {isPopupVisible && (
        <div
          className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4 ${isFadeIn ? "fade-in" : "fade-out"}`}
          onClick={closePopup}
          >
          <div
            className="bg-violet-800 dark:bg-gray-800 p-2 rounded-lg shadow-lg max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
            >
            <TaskDetails task={selectedTask} onClose={closePopup} />
            <button className="absolute top-2 right-2 text-gray-700 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-400" onClick={closePopup}>
              <span className="material-icons">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
