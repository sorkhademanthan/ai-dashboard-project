import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  prompt: String,
  response: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('History', historySchema);
