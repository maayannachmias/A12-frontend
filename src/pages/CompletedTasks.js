import React, { useEffect, useState } from "react";
import { useTasksContext } from "../hooks/useTasksContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { BiSortAlt2 } from "react-icons/bi";
import { FaFilter } from "react-icons/fa";
import tLetter from "../assets/bigLogo.png";

// Components
import TaskDetails from "../components/TaskDetails";
import TaskFrom from "../components/TasksForm";
import NoTasksImage from "../assets/no-finished-tasks-image.png"; // Import the image

const CompletedTasks = () => {
  const { tasks, dispatch } = useTasksContext();
  const { user } = useAuthContext();
  const [sortBy, setSortBy] = useState("");
  const [selectByPriority, setSortByPriority] = useState(""); // State for sorting by priority
  const [selectByType, setSortByType] = useState(""); // State for sorting by type

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

  const sortedTasks = () => {
    let sorted = [...tasks];

    if (sortBy) {
      sorted.sort((a, b) => {
        switch (sortBy) {
          case "title-asc":
            return a.title.localeCompare(b.title);
          case "title-desc":
            return b.title.localeCompare(a.title);
          case "deadline-nearest":
            return new Date(a.deadline) - new Date(b.deadline);
          case "deadline-farthest":
            return new Date(b.deadline) - new Date(a.deadline);
          default:
            return 0;
        }
      });
    }

    if (selectByPriority) {
      sorted = sorted.filter((task) => task.priority === selectByPriority);
    }

    if (selectByType) {
      sorted = sorted.filter((task) => task.type === selectByType);
    }

    return sorted;
  };

  const clearSearch = () => {
    setSortBy("");
    setSortByPriority("");
    setSortByType("");
  };

  return (
    <div className="min-h-screen bg-purple-50 dark:bg-slate-800 p-4">
      <div className="flex justify-between mt-4 bg-purple-50 dark:bg-slate-800 p-4 mb-3">
        <div className="flex">
          <BiSortAlt2 className="dark:fill-purple-100 inline-block w-6 h-6 mr-1 mt-2" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-purple-300 rounded p-2"
          >
            <option value="">Sort By...</option>
            <option value="title-asc">A-Z</option>
            <option value="title-desc">Z-A</option>
            <option value="deadline-nearest">Nearest Deadline</option>
            <option value="deadline-farthest">Farthest Deadline</option>
          </select>
        </div>

        <div className="flex gap-x-4">
          <FaFilter className="dark:fill-purple-100 inline-block w-6 h-6 -mr-1 mt-2" />
          <select
            value={selectByPriority}
            onChange={(e) => setSortByPriority(e.target.value)}
            className="border border-purple-300 rounded p-2"
          >
            <option value="">Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            value={selectByType}
            onChange={(e) => setSortByType(e.target.value)}
            className="border border-purple-300 rounded p-2"
          >
            <option value="">Category</option>
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="home">Home</option>
            <option value="educational">Educational</option>
          </select>
          <button
            onClick={clearSearch}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Clear Search
          </button>
        </div>
      </div>
      {sortedTasks().filter((task) => task.isCompleted).length == 0 ? (
        <div>
          <img src={tLetter} className="mx-auto opacity-50" />
          {/* This is when no tasks page */}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortedTasks()
            .filter((task) => task.isCompleted)
            .map((task) => (
              <div
                key={task._id}
                className="bg-violet-800 rounded-lg shadow-lg p-2"
              >
                <TaskDetails key={task._id} task={task} />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default CompletedTasks;
