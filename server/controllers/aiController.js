import groqAPI from '../utils/groq.js';
import axios from 'axios';
// ✅ Import your Prompt model
import Prompt from '../models/Prompt.js';
// ✅ Import your Groq API utility if you have one

export const generateTasks = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ message: 'Prompt is required' });

  try {
    // Use your Hugging Face/Groq logic here:
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const aiReply = response.data.choices[0].message.content;

    // ✅ Save prompt + response to MongoDB
    await Prompt.create({
      user: req.user._id,
      prompt,
      response: aiReply,
    });

    res.json({ tasks: aiReply });

  } catch (error) {
    console.error('❌ Groq API Error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Groq API error',
      error: error.response?.data || error.message,
    });
  }
};

export const getPromptHistory = async (req, res) => {
  try {
    const history = await Prompt.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch prompt history' });
  }
};

export const deletePrompt = async (req, res) => {
  const { id } = req.params;

  try {
    const prompt = await Prompt.findById(id);

    if (!prompt || prompt.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Prompt not found or unauthorized' });
    }

    await prompt.deleteOne();
    res.json({ message: 'Prompt deleted' });

  } catch (error) {
    res.status(500).json({ message: 'Failed to delete prompt' });
  }
};

export const clearHistory = async (req, res) => {
  try {
    await Prompt.deleteMany({ user: req.user._id });
    res.json({ message: 'Prompt history cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to clear prompt history' });
  }
};

export const regenerateTasks = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ message: 'Prompt is required' });

  try {
    // Use your Hugging Face/Groq logic here:
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const aiReply = response.data.choices[0].message.content;

    res.json({ tasks: aiReply });

  } catch (error) {
    console.error('❌ Groq API Error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Groq API error',
      error: error.response?.data || error.message,
    });
  }
};

export const getTaskById = async (req, res) => {
  const { id } = req.params;

  try {
    const prompt = await Prompt.findById(id);

    if (!prompt || prompt.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Prompt not found or unauthorized' });
    }

    res.json(prompt);

  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch prompt' });
  }
};

export const updatePrompt = async (req, res) => {
  const { id } = req.params;
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ message: 'Prompt is required' });

  try {
    const existingPrompt = await Prompt.findById(id);

    if (!existingPrompt || existingPrompt.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Prompt not found or unauthorized' });
    }     
    
    existingPrompt.prompt = prompt;
    await existingPrompt.save();

    res.json({ message: 'Prompt updated successfully', prompt: existingPrompt });

  } catch (error) {
    console.error('❌ Update Prompt Error:', error.message);
    res.status(500).json({ message: 'Failed to update prompt', error: error.message });
  }
};


