import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

interface Video {
  _id: string;
  title: string;
  duration: number;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/videos');
        setVideos(response.data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Your Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, index) => (
          <motion.div
            key={video._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{video.title}</h3>
              <p className="text-gray-600 mb-2">Duration: {video.duration.toFixed(2)} seconds</p>
              <p className="text-gray-600 mb-4">Created: {new Date(video.createdAt).toLocaleString()}</p>
              <Link
                to={`/play/${video._id}`}
                className="inline-block bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
              >
                Play Video
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

