import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import videoRoutes from './routes/video.route.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = process.env.PORT ;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Connect to MongoDB
connectDB();

// Routes
app.use('/api', videoRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

