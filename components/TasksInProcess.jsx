import React from "react";
import formatDate from "@/utils/formdate";
import TaskContainer from "./TaskContainer";

const TasksInProcess = ({ taskInProcessList, deleteTask, finishedTask }) => {
  return (
    <div className="bg-yellow-50 rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-semibold text-yellow-700 mb-4">
        Tasks In Process
      </h1>
      {taskInProcessList.length > 0 ? (
        taskInProcessList.map((task, index) => (
          <TaskContainer
            key={`${task.task_info}-${index}`}
            index={index}
            task_info={task.task_info}
            task_time={formatDate(task.task_time)}
            deleteTask={deleteTask}
            finishedTask={finishedTask}
            status={task.status}
            type="taskInProcessList"
          />
        ))
      ) : (
        <p className="text-gray-600">No tasks in process</p>
      )}
    </div>
  );
};

export default TasksInProcess;
