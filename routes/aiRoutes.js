import express from 'express';
import {
  generateTasks,
  getPromptHistory,
  deletePrompt,
  clearHistory,
  regenerateTasks,
  getTaskById,
  updatePrompt
} from '../controllers/aiController.js';

import {protect} from '../middlewares/authMiddleware.js';

const router = express.Router();

// Generate and Save Prompt Response
router.post('/generate', protect, generateTasks);

// Get All Prompt History
router.get('/history', protect, getPromptHistory);

// Get Specific Prompt by ID
router.get('/:id', protect, getTaskById);

// Delete One Prompt
router.delete('/:id', protect, deletePrompt);

// Clear All Prompts
router.delete('/', protect, clearHistory);

// Regenerate AI Tasks without saving
router.post('/regenerate', protect, regenerateTasks);

// Update a Prompt (text only)
router.put('/:id', protect, updatePrompt);

export default router;
