import express from 'express';             // 🧠 Core web framework
import dotenv from 'dotenv';               // 🔐 Load env variables like DB URI, API keys
import cors from 'cors';                   // 🔁 Allow frontend to access backend APIs
import connectDB from './config/db.js';    // 🔌 MongoDB connection function

import authRoutes from './routes/authRoutes.js';  // 🔐 Login/Register APIs
import taskRoutes from './routes/taskRoutes.js';  // ✅ CRUD for tasks
import aiRoutes from './routes/aiRoutes.js';      // 🤖 AI-based task generation


dotenv.config();         // Load .env file before using any env variable
connectDB();             // Connect to MongoDB

const app = express();

app.use(cors());              // Allow requests from other origins
app.use(express.json());      // Accept JSON body in POST/PUT

// 🛣 Mount API routes
app.use('/api/auth', authRoutes);      // Login/Register routes: /api/auth/*
app.use('/api/tasks', taskRoutes);     // Task CRUD routes: /api/tasks/*
app.use('/api/ai', aiRoutes);          // AI routes like /api/ai/generate

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

