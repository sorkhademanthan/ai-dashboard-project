// routes/taskRoutes.js
import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js';

const router = express.Router();

router.route('/')
.get(protect, getTasks) // ✅ Get All Tasks for Logged-in User
.post(protect, createTask); // ✅ Create Task

router.route('/:id')
.put(protect, updateTask) // ✅ Update Task
.delete(protect, deleteTask); // ✅ Delete Task
   
export default router;
