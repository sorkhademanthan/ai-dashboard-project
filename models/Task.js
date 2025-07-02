import mongoose from "mongoose";


// we'll need title, description , dueDate,isCompleted, user 
const taskSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    dueDate: {type: Date, required: true},
    isCompleted: {type: Boolean, default: false},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true});

// Export the Task model
export default mongoose.model('Task', taskSchema);