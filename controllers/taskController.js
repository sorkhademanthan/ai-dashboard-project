import Task from '../models/Task.js';

// ✅ Get All Tasks for Logged-in User
export const getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(tasks);
};

// ✅ Create Task
export const createTask = async (req, res) => {
  const { title, description, dueDate } = req.body;

  const task = new Task({
    user: req.user._id,
    title,
    description,
    dueDate,
  });

  const created = await task.save();
  res.status(201).json(created);
};

// ✅ Update Task
export const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task || task.user.toString() !== req.user._id.toString()) {
    return res.status(404).json({ message: 'Task not found or unauthorized' });
  }

  const { title, description, dueDate, completed } = req.body;

  task.title = title ?? task.title;
  task.description = description ?? task.description;
  task.dueDate = dueDate ?? task.dueDate;
  task.completed = completed ?? task.completed;

  const updated = await task.save();
  res.json(updated);
};

// ✅ Delete Task
export const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task || task.user.toString() !== req.user._id.toString()) {
    return res.status(404).json({ message: 'Task not found or unauthorized' });
  }

  await task.deleteOne();
  res.json({ message: 'Task deleted' });
};

// ✅ Mark Task as Completed