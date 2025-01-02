'use client'

const TaskContainer = ({
  task_info,
  task_time,
  deleteTask,
  finishedTask,
  taskInProcess,
  index,
  status, 
  type
}) => {

  const handleDelete = () => {
    deleteTask(index,type);
  };

  const handleDone = () => {
    finishedTask(index);
  };

  const handleStart = () => {
    taskInProcess(index);
  };

  const timeComparing = (taskTime) => {
    const today = new Date();
    const todayInSeconds = Math.floor(today.getTime() / 1000);
    const taskDate = new Date(taskTime);

    if (isNaN(taskDate)) {
      console.log("Invalid task date.");
      return "border-gray-500"; 
    }

    const taskTimeInSeconds = Math.floor(taskDate.getTime() / 1000);
    const timeDifferenceInSeconds = taskTimeInSeconds - todayInSeconds;

    if (timeDifferenceInSeconds > 259200) {
      return "border-green-500"; 
    } else if (timeDifferenceInSeconds > 86400) {
      return "border-yellow-500";
    } else if (timeDifferenceInSeconds > 0) {
      return "border-orange-700"; 
    } else {
      return "border-red-500";
    }
  };

  const borderColor = timeComparing(task_time);

  return (
    <div className={`border-2 ${borderColor} flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow-md mb-3`}>
      <div>
        <h1 className="text-lg font-medium text-gray-800">{task_info}</h1>
        <p className="text-sm text-gray-600">Due day is on: {task_time}</p>
      </div>
      <div className="flex gap-3">
        {/* Conditionally render buttons based on task status */}
        {status === "pending" && (
          <>
            <button
              className="px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-red-300"
              onClick={handleStart}
            >
              Start
            </button>
            <button
              className="px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
              onClick={handleDelete}
            >
              Delete
            </button>
          </>
        )}
        {status === "in-process" && (
          <>
            <button
              className="px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
              onClick={handleDelete}
            >
              Delete
            </button>
            <button
            className="px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
            onClick={handleDone}
          >
            Done
          </button>
          </>
         
        )}
      </div>
    </div>
  );
};

export default TaskContainer;
