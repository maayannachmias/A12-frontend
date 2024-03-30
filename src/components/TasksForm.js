import { useState, useEffect } from "react";
import { Input, Textarea, Radio } from "@material-tailwind/react";
import { useTasksContext } from "../hooks/useTasksContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { FaPerson } from "react-icons/fa6";
import { IoSchool, IoClose} from "react-icons/io5";
import { MdOutlineWorkHistory } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import {
  FcHighPriority,
  FcMediumPriority,
  FcLowPriority,
} from "react-icons/fc";

import "../style/App.css";

const TaskForm = ({ isOpen, onClose }) => {
  const { dispatch } = useTasksContext();
  const { user } = useAuthContext();
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("");
  const [type, setType] = useState("");
  const [priority, setPriority] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

    // Auto-clear error message after 3 seconds
    useEffect(() => {
      if (error) {
        const timer = setTimeout(() => setError(null), 3000); // Clears error after 5 seconds
        return () => clearTimeout(timer); // Cleanup function to clear the timer
      }
    }, [error]); // This effect depends on changes to the error state
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const deadline =
      deadlineDate && deadlineTime
        ? `${deadlineDate} ${deadlineTime}`
        : deadlineDate
        ? `${deadlineDate} 00:00`
        : deadlineTime
        ? `${new Date().toISOString().split("T")[0]} ${deadlineTime}`
        : "";

    const task = {
      title,
      note,
      deadline,
      type,
      priority,
    };

    const response = await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }

    if (response.ok) {
      setTitle("");
      setNote("");
      setDeadlineDate("");
      setDeadlineTime("");
      setType("");
      setPriority("");
      setError(null);
      setEmptyFields([]);
      console.log("new task added", json);
      dispatch({ type: "CREATE_TASK", payload: json });
      onClose();
    }
  };

  const formatType = (type) => {
    switch (type) {
      case "personal":
        return <FaPerson title="Personal" className="text-lg" />;
      case "educational":
        return <IoSchool title="Educational" className="text-lg" />;
      case "work":
        return <MdOutlineWorkHistory title="Work" className="text-lg" />;
      case "home":
        return <FaHome title="Home" className="text-lg" />;
      default:
        return null;
    }
  };

  const formatPriority = (level) => {
    switch (level) {
      case "low":
        return <FcLowPriority title="Low" className="text-lg" />;
      case "medium":
        return <FcMediumPriority title="Medium" className="text-lg" />;
      case "high":
        return <FcHighPriority title="High" className="text-lg" />;
      default:
        return null;
    }
  };

  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    // background of popup window
    <div
      className="fixed inset-0 bg-slate-100 dark:bg-slate-900 dark:bg-opacity-50 bg-opacity-50 overflow-y-auto h-full w-full"
      onClick={onClose}
    >
      <div
        className="relative top-20 mx-auto py-4 px-3 bg-violet-800 rounded-lg shadow-lg p-2 dark:bg-violet-500 max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className=" bg-violet-100 shadow-lg rounded-lg p-4 h-full">
          <div className="flex justify-between">

          <p className="text-xl drop-shadow-md font-semibold text-violet-900 dark:text-white text-center">
              Add New Task
            </p>
          <button
            onClick={onClose}
            className="absolute top-5 right-5  text-gray-400 hover:text-gray-600"
          >
            <IoClose className="text-2xl " />
          </button>
          </div>

          {/* Stop propagation to prevent the click on the modal content from closing the modal */}
          <form onSubmit={handleSubmit} className="create mt-5">
            <Input
              label="Task Title*"
              size="lg"
              type="text"
              value={title}
              color="purple"
              className="p-2 rounded border shadow-md mb-1 bg-white"
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="h-3"></div>

            <Textarea
              label="Description"
              rows="3"
              value={note}
              color="purple"
              className={
                emptyFields.includes("note")
                  ? "error"
                  : "p-2 rounded border shadow-md mb-1 bg-white"
              }
              onChange={(e) => setNote(e.target.value)}
            ></Textarea>

            <div className="h-3"></div>

            <div className="grid grid-cols-2 bg-white rounded-md shadow-md p-2 mb-4 gap-x-3">
              <Input
                label="Date"
                size="lg"
                type="date"
                color="purple"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
              />
              <Input
                label="Time"
                size="lg"
                type="time"
                color="purple"
                value={deadlineTime}
                onChange={(e) => setDeadlineTime(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 place-items-start gap-x-4 text-purple-900 font-semibold">
                <p className="bg-white rounded-lg shadow-md p-1 mb-1">Set Category</p>
                <p className="bg-white rounded-lg shadow-md p-1 mb-1">Set Priority</p>
              </div>
              
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <div className="grid grid-cols-2 bg-white rounded-lg shadow-md mb-4 pl-3 p-1 place-items-start">
                <Radio
                  name="type"
                  label={formatType("personal")}
                  value="personal"
                  onChange={(e) => setType(e.target.value)}
                  checked={type === "personal"}
                  className={emptyFields.includes("type") ? "error" : ""}
                />
                <Radio
                  name="type"
                  label={formatType("work")}
                  value="work"
                  onChange={(e) => setType(e.target.value)}
                  checked={type === "work"}
                  className={emptyFields.includes("type") ? "error" : ""}
                />
                <Radio
                  name="type"
                  label={formatType("home")}
                  value="home"
                  onChange={(e) => setType(e.target.value)}
                  checked={type === "home"}
                  className={emptyFields.includes("type") ? "error" : ""}
                />
                <Radio
                  name="type"
                  label={formatType("educational")}
                  value="educational"
                  onChange={(e) => setType(e.target.value)}
                  checked={type === "educational"}
                  className={emptyFields.includes("type") ? "error" : ""}
                />
              </div>

              <div className="grid grid-cols-2 bg-white rounded-lg shadow-md mb-4 pl-3 p-1 place-items-start">
                <Radio
                  name="priority"
                  label="None"
                  value="none"
                  onChange={(e) => setPriority(e.target.value)}
                  checked={priority === "none"}
                  className={emptyFields.includes("priority") ? "error" : ""}
                />

                <Radio
                  name="priority"
                  label={formatPriority("low")}
                  value="low"
                  onChange={(e) => setPriority(e.target.value)}
                  checked={priority === "low"}
                  className={emptyFields.includes("priority") ? "error" : ""}
                />

                <Radio
                  name="priority"
                  label={formatPriority("medium")}
                  value="medium"
                  onChange={(e) => setPriority(e.target.value)}
                  checked={priority === "medium"}
                  className={emptyFields.includes("priority") ? "error" : ""}
                />

                <Radio
                  name="priority"
                  label={formatPriority("high")}
                  value="high"
                  onChange={(e) => setPriority(e.target.value)}
                  checked={priority === "high"}
                  className={emptyFields.includes("priority") ? "error" : ""}
                />
              </div>
            </div>
            <div className="flex justify-center mt-5">
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-purple-700 py-2 px-4 text-sm font-medium text-white hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                Add Task
              </button>
            </div>
            <div className="flex justify-center mb-3 mt-3">
              {error && <div className="text-red-500">{error}</div>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
