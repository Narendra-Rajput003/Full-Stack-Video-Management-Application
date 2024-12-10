import { Video } from '../models/Video.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const recordVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const { title, duration } = req.body;
    
    if (!title || !duration) {
      return res.status(400).json({ message: 'Title and duration are required' });
    }

    const video = new Video({
      title,
      filename: req.file.filename,
      duration: parseFloat(duration),
    });

    await video.save();
    res.status(201).json({ message: 'Video uploaded successfully', video });
  } catch (error) {
    console.error('Error in recordVideo:', error);
    res.status(500).json({ message: 'Error uploading video', error: error.message });
  }
};

export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    console.error('Error in getVideos:', error);
    res.status(500).json({ message: 'Error fetching videos', error: error.message });
  }
};

export const streamVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    const videoPath = path.join(__dirname, '..', 'uploads', video.filename);
    
    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ message: 'Video file not found' });
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    console.error('Error in streamVideo:', error);
    res.status(500).json({ message: 'Error streaming video', error: error.message });
  }
};

