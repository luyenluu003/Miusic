// AudioContext.js
import React, { createContext, useState, useRef, useEffect } from 'react';

// Tạo AudioContext
export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const audioPlayer = useRef(new Audio()); // Tham chiếu tới đối tượng Audio
  const [isPlaying, setIsPlaying] = useState(false); // Trạng thái phát nhạc
  const [currentBlog, setCurrentBlog] = useState(null); // Blog hiện tại
  const [currentTime, setCurrentTime] = useState(0); // Thời gian hiện tại
  const [duration, setDuration] = useState(0); // Thời gian tổng cộng
  const animationRef = useRef(); // Dùng cho thanh tiến trình

  // Hàm dùng để phát hoặc dừng nhạc
  const togglePlayPause = (blog) => {
    if (currentBlog?.music !== blog.music) {
      // Nếu chuyển sang bài khác, dừng bài hiện tại
      if (isPlaying) {
        audioPlayer.current.pause();
        cancelAnimationRef();
      }
      setCurrentBlog(blog);
      audioPlayer.current.src = blog.music; // Đặt nguồn âm thanh
      setIsPlaying(true); // Đặt trạng thái là đang phát
      audioPlayer.current.play(); // Bắt đầu phát
      startAnimation();
    } else {
      // Nếu là cùng một bài hát, chuyển đổi giữa phát và dừng
      if (isPlaying) {
        audioPlayer.current.pause();
        setIsPlaying(false);
        cancelAnimationRef();
      } else {
        audioPlayer.current.play();
        setIsPlaying(true);
        startAnimation();
      }
    }
  };

  const startAnimation = () => {
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const cancelAnimationRef = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const whilePlaying = () => {
    if (audioPlayer.current) {
      setCurrentTime(audioPlayer.current.currentTime);
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  };

  // Cập nhật thông tin khi bài hát mới được tải
  useEffect(() => {
    if (currentBlog) {
      audioPlayer.current.addEventListener('loadedmetadata', () => {
        setDuration(Math.floor(audioPlayer.current.duration));
      });
    }
  }, [currentBlog]);

  return (
    <AudioContext.Provider value={{ togglePlayPause, isPlaying, currentBlog, currentTime, duration }}>
      {children}
    </AudioContext.Provider>
  );
};
