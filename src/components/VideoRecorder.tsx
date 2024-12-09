import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const VideoRecorder: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [title, setTitle] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };
      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Failed to start recording. Please check your camera and microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
      createPreview();
    }
  };

  const togglePause = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
      } else {
        mediaRecorderRef.current.pause();
      }
      setIsPaused(!isPaused);
    }
  };

  const createPreview = () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
  };

  const handleSave = async () => {
    if (recordedChunks.length === 0 || !title) {
      setError('Please record a video and provide a title before saving.');
      return;
    }

    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const formData = new FormData();
    formData.append('video', blob, 'recorded-video.webm');
    formData.append('title', title);
    formData.append('duration', String(blob.size / 1000000)); // Approximate duration in seconds

    try {
      const response = await axios.post('http://localhost:5000/api/record', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Video saved successfully:', response.data);
      navigate('/');
    } catch (error) {
      console.error('Error saving video:', error);
      setError('Failed to save the video. Please try again.');
    }
  };

  const handleDiscard = () => {
    setRecordedChunks([]);
    setPreviewUrl(null);
    setTitle('');
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Video Recorder</h2>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </motion.div>
      )}
      <div className="mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden"
        >
          {previewUrl ? (
            <video ref={previewRef} controls src={previewUrl} className="w-full h-full object-cover" />
          ) : (
            <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
          )}
        </motion.div>
      </div>
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {!previewUrl && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isRecording ? stopRecording : startRecording}
              className={`px-6 py-3 rounded-full text-white font-semibold ${
                isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              } transition-colors`}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </motion.button>
            {isRecording && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePause}
                className="px-6 py-3 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold transition-colors"
              >
                {isPaused ? 'Resume' : 'Pause'}
              </motion.button>
            )}
          </>
        )}
        {previewUrl && (
          <>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 w-full md:w-auto"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors"
            >
              Save Video
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDiscard}
              className="px-6 py-3 rounded-full bg-gray-600 hover:bg-gray-700 text-white font-semibold transition-colors"
            >
              Discard
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoRecorder;

