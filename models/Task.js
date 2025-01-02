import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    task_info: {
        type: String,
        required: true,
    },
    task_time: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'in-process', 'finished'],
        default: 'pending',
    },
    task_finished_time: {
        type: Date,
        default: null,
    },
   
})

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);