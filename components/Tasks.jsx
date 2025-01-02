import React from 'react'
import TaskContainer from './TaskContainer'
import formatDate from '@/utils/formdate';

const Tasks = ( { taskList,deleteTask,taskInProcess} ) => {

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-semibold text-blue-700 mb-4">My Tasks</h1>
          {taskList.length > 0 ? (
            taskList.map((task, index) => (
              <TaskContainer
                key={`${task.task_info}-${index}`}
                index={index}
                task_info={task.task_info}
                task_time={formatDate(task.task_time)}
                deleteTask={deleteTask}
                status={task.status}
                taskInProcess={taskInProcess}
                type="taskList"
              />
            ))
          ) : (
            <p className="text-gray-600">No pending tasks</p>
          )}
        </div>
  )
}

export default Tasks