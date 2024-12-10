import express from 'express';
import { recordVideo, getVideos, streamVideo } from '../controllers/video.controller.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/record', upload.single('video'), recordVideo);
router.get('/videos', getVideos);
router.get('/video/:id', streamVideo);

export default router;

