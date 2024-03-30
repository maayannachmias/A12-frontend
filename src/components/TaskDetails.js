import { useTasksContext } from "../hooks/useTasksContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { format } from "date-fns";
import { React, Fragment, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaPerson } from "react-icons/fa6";
import { IoSchool, IoClose} from "react-icons/io5";
import { MdOutlineWorkHistory } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import {
  FcHighPriority,
  FcMediumPriority,
  FcLowPriority,
} from "react-icons/fc";

import {
  faPen,
  faTrashAlt,
  faCheck,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Radio, Input} from "@material-tailwind/react";

const TaskDetails = ({ task, onClose }) => {
  const { dispatch } = useTasksContext();
  const { user } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false); // Track whether the task is being edited
  const [editedTask, setEditedTask] = useState(task); // Store the edited task details

  const [titleError, setTitleError] = useState("");

  const handleDelete = async () => {
    if (!user) {
      return;
    }
    try {
      const response = await fetch("/api/tasks/" + task._id, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "DELETE_TASK", payload: json });
      } else {
        console.error("Failed to delete task:", json.error);
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
    try {
      onClose();
    } catch (e) {
      console.error("Nothing to worry just no popup...", e);
    }
  };

  const handleUncheckClick = async () => {
    const editedTask = {
      ...task,
      isCompleted: true, // Modify the isCompleted attribute to true
    };

    try {
      const response = await fetch("/api/tasks/" + task._id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(editedTask), // Send the updated task details
      });

      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "UPDATE_TASK", payload: json });
      } else {
        console.error("Failed to update task:", json.error);
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
    setTimeout(() => {
      try {
        onClose();
      } catch (e) {
        console.error("Nothing to worry just no popup...", e);
      }
    }, 300); // Delay of 300 milliseconds to match the conffetti duration
  };

  const handleCheckClick = async () => {
    const editedTask = {
      ...task,
      isCompleted: false, // Modify the isCompleted attribute to true
    };

    try {
      const response = await fetch("/api/tasks/" + task._id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(editedTask), // Send the updated task details
      });

      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "UPDATE_TASK", payload: json });
      } else {
        console.error("Failed to update task:", json.error);
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
    try {
      onClose();
    } catch (e) {
      console.error("Nothing to worry just no popup...", e);
    }
  };

  const handleEdit = () => {
    setIsEditing(true); // Set isEditing to true to switch to edit mode
  };

  const handleSave = async () => {
    if (editedTask.title.trim() === "") {
      setTitleError(
        <span style={{ color: "red" }}>Title cannot be empty</span>
      );
      return;
    }

    const response = await fetch("/api/tasks/" + task._id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(editedTask), // Send the updated task details
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "UPDATE_TASK", payload: json });
      setIsEditing(false); // Switch back to view mode after saving
      setTitleError(""); // Reset the title error
    }
  };

  const handleCancel = () => {
    setIsEditing(false); // Cancel the edit mode and discard changes
    setEditedTask(task); // Reset the edited task details to the original task
    setTitleError(""); // Reset the title error
  };

  const handleChange = (e) => {
    setEditedTask({ ...editedTask, [e.target.name]: e.target.value }); // Update the edited task details
  };

  const formattedDeadline = task.deadline
    ? format(new Date(task.deadline), "MMMM dd, yyyy, HH:mm")
    : "";

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
  return (
    <div className="bg-violet-100 shadow-lg rounded-lg p-4 h-full">
      {isEditing ? (
        <>
          <input
            type="text"
            name="title"
            value={editedTask.title}
            onChange={handleChange}
            className={`p-2 rounded border shadow-md mb-1 ${
              titleError ? "border-red-500" : "border-purple-300"
            } w-full`}
          />
          {titleError && (
            <p className="text-red-500 text-sm mt-1">{titleError}</p>
          )}
          <textarea
            name="note"
            value={editedTask.note}
            onChange={handleChange}
            className="mt-2 p-2 rounded border border-purple-300 w-full shadow-md mb-1"
            placeholder="Note"
          ></textarea>

          <div className="grid grid-cols-4 bg-white rounded-md shadow-md mb-4">
            <Radio
              name="type"
              label={formatType("personal")}
              value="personal"
              onChange={handleChange}
              checked={editedTask.type === "personal"}
            />
            <Radio
              name="type"
              label={formatType("work")}
              value="work"
              onChange={handleChange}
              checked={editedTask.type === "work"}
            />
            <Radio
              name="type"
              label={formatType("home")}
              value="home"
              onChange={handleChange}
              checked={editedTask.type === "home"}
            />
            <Radio
              name="type"
              label={formatType("educational")}
              value="educational"
              onChange={handleChange}
              checked={editedTask.type === "educational"}
            />
          </div>

          <div className=" bg-white rounded-md shadow-md mb-4 p-1">
            <Input
              name="deadline"
              label="Date & Time"
              size="lg"
              type="datetime-local"
              value={editedTask.deadline}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-4 bg-white rounded-md shadow-md mb-8">
            <Radio
              name="priority"
              label="None"
              value="none"
              onChange={handleChange}
              checked={editedTask.priority === "none"}
            />

            <Radio
              name="priority"
              label={formatPriority("low")}
              value="low"
              onChange={handleChange}
              checked={editedTask.priority === "low"}
            />

            <Radio
              name="priority"
              label={formatPriority("medium")}
              value="medium"
              onChange={handleChange}
              checked={editedTask.priority === "medium"}
            />

            <Radio
              name="priority"
              label={formatPriority("high")}
              value="high"
              onChange={handleChange}
              checked={editedTask.priority === "high"}
            />
          </div>
          <div className="flex justify-center space-x-10">
            <button
              className="w-[35px] h-[35px] rounded-full shadow-md flex items-center justify-center text-white bg-green-500 hover:bg-green-600"
              onClick={handleSave}
            >
              <FontAwesomeIcon icon={faCheck} className="mx-auto" />
            </button>
            <button
              className="w-[35px] h-[35px] rounded-full shadow-md flex items-center justify-center text-white bg-red-500 hover:bg-red-600"
              onClick={handleCancel}
            >
              <IoClose />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-6 space-x-2">
            <div className="grid col-span-5">
              <h1
                className={`font-bold text-xl font-sans ${
                  task.isCompleted
                    ? "text-gray-500 line-through"
                    : "text-gray-800"
                }`}
              >
                {task.title}
              </h1>

              {task.note && (
                <p
                  className={`mt-2 ${
                    task.isCompleted
                      ? "text-gray-400 line-through"
                      : "text-gray-600"
                  }`}
                >
                  {task.note}
                </p>
              )}
              <div className="flex gap-2">
                {task.type && (
                  <div className="mt-1 text-sm text-gray-500">
                    {formatType(task.type)}
                  </div>
                )}
                {task.priority && (
                  <div className="mt-1 text-sm text-gray-500">
                    {formatPriority(task.priority)}
                  </div>
                )}
              </div>
              {task.deadline && (
                <p className="mt-1 text-sm text-gray-500">{`${formattedDeadline}`}</p>
              )}
            </div>

            <div className="grid col-span-1 h-40">
              <button
                className="w-[35px] h-[35px] rounded-full shadow-md flex items-center justify-center px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 transition duration-200"
                onClick={handleEdit}
              >
                <FontAwesomeIcon icon={faPen} className="mx-auto" />
              </button>
              {!task.isCompleted && (
                <button
                  className="w-[35px] h-[35px] rounded-full shadow-md flex items-center justify-center  text-white bg-green-500 hover:bg-green-600"
                  onClick={handleUncheckClick}
                >
                  <FontAwesomeIcon icon={faCheck} className="mx-auto" />
                </button>
              )}
              {task.isCompleted && (
                <button
                  className="w-[35px] h-[35px] rounded-full shadow-md flex items-center justify-center px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 transition duration-200"
                  onClick={handleCheckClick}
                >
                  <FontAwesomeIcon icon={faRotateLeft} />
                </button>
              )}
              <button
                className="w-[35px] h-[35px] rounded-full shadow-md flex items-center justify-center text-white bg-red-500 hover:bg-red-600"
                onClick={handleDelete}
              >
                <FontAwesomeIcon icon={faTrashAlt} className="mx-auto" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskDetails;
