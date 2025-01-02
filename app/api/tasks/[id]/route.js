import dbconn from "@/lib/dbConnection";
import Task from "@/models/Task";
import { ObjectId } from "mongodb";

export async function PUT(req, { params }) {
  try {
    const { id } = params;  
    const objectId = new ObjectId(id);
    await dbconn();  
    
    const { task_info, task_time, status, task_finished_time } = await req.json();  

    const task = await Task.findById(objectId);  
    if (!task) {
      return new Response(
        JSON.stringify({ error: 'Task not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update the task
    task.task_info = task_info;
    task.task_time = task_time;
    task.status = status;

    if (status === 'finished') {
      task.task_finished_time = task_finished_time || new Date();  // Set finished time if applicable
    }

    const updatedTask = await task.save();  

    return new Response(
      JSON.stringify(updatedTask),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error(err);  // Log any errors
    return new Response(
      JSON.stringify({ message: 'Failed to update task status', error: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}


export async function DELETE(req, { params }) {
    try {
      const { id } = params;
    
      const objectId = new ObjectId(id);
      await dbconn();
      const deletedTask = await Task.findByIdAndDelete(objectId);
  
      if (!deletedTask) {
        return new Response(
          JSON.stringify({ message: "Task not found." }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
  
      return new Response(
        JSON.stringify(deletedTask),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ message: "Failed to delete task", error: err.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
  