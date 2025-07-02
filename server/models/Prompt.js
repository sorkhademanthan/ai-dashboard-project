// models/Prompt.js
import mongoose from 'mongoose';

const promptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // auto adds createdAt and updatedAt
  }
);

const Prompt = mongoose.model('Prompt', promptSchema);
export default Prompt;
