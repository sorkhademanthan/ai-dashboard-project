// File: server/routes/authRoutes.js
// This file defines the authentication routes for user registration and login.
// It uses Express.js to create a router and connects the routes to their respective controllers.
// The routes are then exported for use in the main server file.
import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
