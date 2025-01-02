import React from 'react'
import  formatDate  from '@/utils/formdate';

const FinishedTasks = ({finishedTaskList, handleDelFinishedTaskes }) => {
  return (
    <div className="bg-green-50 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-semibold text-green-700 mb-4">Finished Tasks</h1>
          {finishedTaskList.length > 0 ? (
            <>
              {finishedTaskList.map((task, index) => (
                <div
                  key={index}
                  className="flex justify-between px-4 py-2 bg-white rounded-lg shadow-sm mb-2"
                >
                  <p className="text-gray-800">{task.task_info}</p>
                  <p className="text-gray-600">Finished: {formatDate(task.task_finished_time)}</p>
                </div>
              ))}
              <button
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 mt-4 mx-auto"
                onClick={handleDelFinishedTaskes}
              >
                Delete All Finished Tasks
              </button>
            </>
          ) : (
            <p className="text-gray-600">No finished tasks</p>
          )}
        </div>
  )
}

export default FinishedTasks