import React, { useEffect, useState } from "react";
import { useTasksContext } from "../hooks/useTasksContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { Progress, Typography } from "@material-tailwind/react";


const ProgressBar = () => {
  const { tasks, dispatch } = useTasksContext();
  const { user } = useAuthContext();
  const allTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.isCompleted).length;
  const percentage = Math.round((completedTasks / allTasks) * 100);

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

  return (
    <div className="w-full mt-10">
    <div className="mb-2 flex items-center justify-between gap-4">
      <Typography color="purple" variant="h6">
        Completed
      </Typography>
      <Typography color="purple" variant="h6">
        {percentage}%
      </Typography>
    </div>
    <Progress value={percentage} color="purple" className="shadow-md"/>
  </div>

  );
};
export default ProgressBar;
