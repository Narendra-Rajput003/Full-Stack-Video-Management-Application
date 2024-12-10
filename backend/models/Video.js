import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: String,
  filename: String,
  duration: Number,
  createdAt: { type: Date, default: Date.now },
});

export const Video = mongoose.model('Video', videoSchema);

