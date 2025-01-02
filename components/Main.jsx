"use client";

import { useEffect, useState } from "react";
import Tasks from "./Tasks";
import TasksInProcess from "./TasksInProcess";
import FinishedTasks from "./FinishedTasks";

const Main = () => {
  const [task_info, setTaskInfo] = useState("");
  const [task_time, setTaskTime] = useState("");

  const [taskInfoError, setTaskInfoError] = useState("");
  const [taskTimeError, setTaskTimeError] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [finishedTaskList, setFinishedTaskList] = useState([]);
  const [taskInProcessList, setTaskInProcessList] = useState([]);

  const handleTaskInput = (e) => setTaskInfo(e.target.value);
  const handleTimeInput = (e) => setTaskTime(e.target.value);

  const fetchTasks = async () => {
    try {
      const response = await fetch("api/tasks", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data from MongoDB");
      }
      const data = await response.json();
      console.log("data:", data);
      setTaskList(
        data
          .filter((task) => task.status === "pending")
          .sort((a, b) => new Date(a.task_time) - new Date(b.task_time))
      );
      setTaskInProcessList(
        data
          .filter((task) => task.status === "in-process")
          .sort((a, b) => new Date(a.task_time) - new Date(b.task_time))
      );
      setFinishedTaskList(
        data
          .filter((task) => task.status === "finished")
          .sort(
            (a, b) =>
              new Date(b.task_finished_time) - new Date(a.task_finished_time)
          )
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleForm = async (e) => {
    e.preventDefault();
  
    if (!task_info || !task_time) {
      setTaskInfoError("Please enter task details.");
      setTaskTimeError("Please select a due date.");
      return;
    }

    const currentDate = new Date();
    const taskDate = new Date(task_time);
  
    if (taskDate <= currentDate) {
      setTaskTimeError("Please select a due date in the future.");
      return;
    }
    
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_info, task_time }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        if (res.status === 409) {
          setTaskInfoError(data.error); 
        } else {
          throw new Error(data.error || "Failed to create task.");
        }
        return;
      }
  
      setTaskList((prev) =>
        [...prev, data].sort((a, b) => new Date(a.task_time) - new Date(b.task_time))
      );
      setTaskInfo("");
      setTaskTime("");
      setTaskInfoError(null);
      setTaskTimeError(null);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };
  

  const deleteTask = async (index, listType) => {
    try {
      let taskToDelete;
  
      if (listType === "taskList") {
        taskToDelete = taskList[index];
        if (!taskToDelete) {
          console.error("Task not found in taskList.");
          return;
        }
        setTaskList(taskList.filter((_, i) => i !== index));
      } else if (listType === "taskInProcessList") {
        taskToDelete = taskInProcessList[index];
        if (!taskToDelete) {
          console.error("Task not found in taskInProcessList.");
          return;
        }
        setTaskInProcessList(taskInProcessList.filter((_, i) => i !== index));
      }
  
      if (!taskToDelete?._id) {
        console.error("Task ID is missing.");
        return;
      }
  
      const res = await fetch(`/api/tasks/${taskToDelete._id}`, {
        method: "DELETE",
      });
  
      if (!res.ok) {
        throw new Error("Failed to delete task");
      }
  
      console.log(`Task ${taskToDelete._id} deleted successfully.`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  

  const finishedTask = async (index) => {
    const taskToFinish = taskInProcessList[index];
    const newTaskInProcessList = taskInProcessList.filter(
      (_, i) => i !== index
    );
    setTaskInProcessList(newTaskInProcessList);
    setFinishedTaskList([...finishedTaskList, taskToFinish]);

    const taskFinishedTime = new Date();
    try {
      const res = await fetch(`/api/tasks/${taskToFinish._id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          task_info: taskToFinish.task_info,
          task_time: taskToFinish.task_time,
          status: "finished",
          task_finished_time: taskFinishedTime,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update task status");
      }
      fetchTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const taskInProcess = async (index) => {
    const taskToProcess = taskList[index];
    const newTaskList = taskList.filter((_, i) => i !== index);
    setTaskList(newTaskList);
    setTaskInProcessList([...taskInProcessList, taskToProcess]);

    try {
      const res = await fetch(`/api/tasks/${taskToProcess._id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          task_info: taskToProcess.task_info,
          task_time: taskToProcess.task_time,
          status: "in-process",
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to update task status");
      }
      fetchTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleDelFinishedTaskes = async () => {
    try {
      const res = await fetch("/api/tasks", {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete finished tasks");
      }

      fetchTasks();
      setFinishedTaskList([]);
    } catch (error) {
      console.error("Error deleting finished tasks:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-gray-100 to-blue-50 py-8 px-4">
      <form
        onSubmit={handleForm}
        className="flex flex-col md:flex-row items-center justify-between gap-6 w-full max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl border border-gray-300"
      >
        {/* Task Input */}
        <div className="flex flex-col w-full md:w-1/2 gap-2">
          <label
            htmlFor="task_info"
            className="text-gray-700 font-semibold text-sm"
          >
            Task Description
          </label>
          <input
            id="task_info"
            type="text"
            value={task_info}
            placeholder="Enter your task"
            className="w-full px-4 py-3 text-black bg-gray-100 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleTaskInput}
          />
          {taskInfoError && (
            <p className="text-red-500 text-sm">{taskInfoError}</p>
          )}
        </div>

        {/* Task Time Input */}
        <div className="flex flex-col w-full md:w-1/2 gap-2">
          <label
            htmlFor="task_time"
            className="text-gray-700 font-semibold text-sm"
          >
            Due Date and Time
          </label>
          <input
            id="task_time"
            type="datetime-local"
            value={task_time}
            className="w-full px-4 py-3 text-black bg-gray-100 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleTimeInput}
          />
          {taskTimeError && (
            <p className="text-red-500 text-sm">{taskTimeError}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full md:w-auto mt-4 md:mt-0 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Add Task
        </button>
      </form>

      <div className="w-full max-w-3xl mx-auto mt-8 space-y-6">
        {/* Pending Tasks */}
        <Tasks
          taskList={taskList}
          deleteTask={deleteTask}
          finishedTask={finishedTask}
          taskInProcess={taskInProcess}
        />

        <TasksInProcess
          taskInProcessList={taskInProcessList}
          deleteTask={deleteTask}
          finishedTask={finishedTask}
        />
        <FinishedTasks
          finishedTaskList={finishedTaskList}
          handleDelFinishedTaskes={handleDelFinishedTaskes}
        />
      </div>
    </div>
  );
};

export default Main;
