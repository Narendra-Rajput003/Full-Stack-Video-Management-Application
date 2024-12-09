import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

interface Video {
  _id: string;
  title: string;
}

const VideoPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [video, setVideo] = useState<Video | null>(null);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/videos`);
        const videoDetails = response.data.find((v: Video) => v._id === id);
        setVideo(videoDetails);
      } catch (error) {
        console.error('Error fetching video details:', error);
      }
    };

    fetchVideoDetails();
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Video Player</h2>
      {video && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-700">{video.title}</h3>
          <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden shadow-lg">
            <video
              ref={videoRef}
              controls
              className="w-full h-full object-cover"
              src={`http://localhost:5000/api/video/${id}`}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default VideoPlayer;

