import dbconn from "@/lib/dbConnection";
import Task from "@/models/Task";

export async function POST(req) {
    try {
        await dbconn();
      const { task_info, task_time } = await req.json(); 
      if (!task_info || !task_time) {
        return new Response(
          JSON.stringify({ error: 'Task info and task time are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const isDuplicate = await Task.exists({
        task_info: task_info.toLowerCase(),
        
      });
  
      if (isDuplicate) {
        return new Response(
          JSON.stringify({ error: "Task already exists." }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }

      console.log('taskTimeDate:', task_time);
      
      const task = new Task({ task_info, task_time});
      const savedTask = await task.save();
      
      return new Response(
        JSON.stringify(savedTask),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Error saving task:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to save task' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  export async function GET(req) {
    try {
      await dbconn();
      const tasks = await Task.find({});
      return new Response(
        JSON.stringify(tasks),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Error getting tasks:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to get tasks' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }


  export async function DELETE(req) {
    try{
        await dbconn();
        const deletedTasks = await Task.deleteMany({});
        return new Response(
            JSON.stringify({ message: `Deleted ${deletedTasks.deletedCount} tasks.` }),
            { status: 200 }
          );
    } catch(err) {
        return new Response(
            JSON.stringify({ error: 'Failed to delete tasks', details: err.message }),
            { status: 500 }
          );
    }
  }