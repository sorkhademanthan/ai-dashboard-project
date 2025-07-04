import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';


const router = express.Router();

router.post('/register', registerUser); // <-- important
router.post('/login', loginUser);       // <-- important

export default router;
