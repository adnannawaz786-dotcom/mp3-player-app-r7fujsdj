import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, Heart, MoreHorizontal, ChevronDown, Share, Download } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

const FullPlayer = ({ 
  isOpen, 
  onClose, 
  currentTrack, 
  isPlaying, 
  onPlayPause, 
  onNext, 
  onPrevious,
  currentTime = 0,
  duration = 0,
  volume = 1,
  onVolumeChange,
  onSeek,
  isShuffled = false,
  onShuffle,
  repeatMode = 'none',
  onRepeat,
  visualizerData = []
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [tempTime, setTempTime] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const progressRef = useRef(null);
  const volumeRef = useRef(null);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e) => {
    if (!progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    onSeek(newTime);
  };

  const handleProgressDrag = (e) => {
    if (!isDragging || !progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = percent * duration;
    setTempTime(newTime);
  };

  const handleProgressMouseDown = (e) => {
    setIsDragging(true);
    handleProgressClick(e);
  };

  const handleProgressMouseUp = () => {
    if (isDragging) {
      onSeek(tempTime);
      setIsDragging(false);
    }
  };

  const handleVolumeChange = (e) => {
    if (!volumeRef.current) return;
    const rect = volumeRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onVolumeChange(percent);
  };

  useEffect(() => {
    const handleMouseMove = (e) => handleProgressDrag(e);
    const handleMouseUp = () => handleProgressMouseUp();

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, tempTime]);

  const currentProgress = isDragging ? tempTime : currentTime;
  const progressPercent = duration > 0 ? (currentProgress / duration) * 100 : 0;

  const Visualizer = () => (
    <div className="flex items-end justify-center space-x-1 h-32 mb-8">
      {Array.from({ length: 64 }).map((_, i) => {
        const height = visualizerData[i] || Math.random() * 0.5 + 0.1;
        return (
          <motion.div
            key={i}
            className="bg-gradient-to-t from-purple-500 to-pink-500 rounded-full opacity-70"
            style={{
              width: '3px',
              minHeight: '4px',
            }}
            animate={{
              height: `${height * 100}%`,
            }}
            transition={{
              duration: 0.1,
              ease: 'easeOut',
            }}
          />
        );
      })}
    </div>
  );

  if (!isOpen || !currentTrack) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
      >
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="relative h-full flex flex-col text-white">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <ChevronDown className="h-6 w-6" />
            </Button>
            
            <div className="text-center">
              <p className="text-sm opacity-70">Playing from</p>
              <p className="font-medium">My Library</p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <MoreHorizontal className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-8">
            <motion.div
              className="relative mb-8"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="w-80 h-80 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-600 shadow-2xl overflow-hidden">
                {currentTrack.artwork ? (
                  <img
                    src={currentTrack.artwork}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-6xl font-bold opacity-50">♪</div>
                  </div>
                )}
              </div>
              
              <motion.div
                className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl"
                animate={{
                  scale: isPlaying ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: isPlaying ? Infinity : 0,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>

            <Visualizer />

            <div className="w-full max-w-md text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">{currentTrack.title}</h1>
              <p className="text-lg opacity-70 mb-4">{currentTrack.artist}</p>
              
              <div className="flex items-center justify-center space-x-4 mb-6">
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                  {currentTrack.genre || 'Music'}
                </Badge>
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                  {formatTime(duration)}
                </Badge>
              </div>

              <div className="flex items-center justify-center space-x-6">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                >
                  <Share className="h-5 w-5" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsLiked(!isLiked)}
                  className={`hover:bg-white/10 ${isLiked ? 'text-red-500' : 'text-white'}`}
                >
                  <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                >
                  <Download className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="w-full max-w-md mb-8">
              <div
                ref={progressRef}
                className="relative h-2 bg-white/20 rounded-full cursor-pointer mb-2"
                onClick={handleProgressClick}
                onMouseDown={handleProgressMouseDown}
              >
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all duration-100"
                  style={{ width: `${progressPercent}%` }}
                />
                <div
                  className="absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-lg transform -translate-y-1/2 transition-all duration-100"
                  style={{ left: `calc(${progressPercent}% - 8px)` }}
                />
              </div>
              
              <div className="flex justify-between text-sm opacity-70">
                <span>{formatTime(currentProgress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-8 mb-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={onShuffle}
                className={`hover:bg-white/10 ${isShuffled ? 'text-purple-400' : 'text-white'}`}
              >
                <Shuffle className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={onPrevious}
                className="text-white hover:bg-white/10"
              >
                <SkipBack className="h-6 w-6" />
              </Button>

              <Button
                size="icon"
                onClick={onPlayPause}
                className="w-16 h-16 bg-white text-black hover:bg-white/90 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8 ml-1" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={onNext}
                className="text-white hover:bg-white/10"
              >
                <SkipForward className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={onRepeat}
                className={`hover:bg-white/10 ${repeatMode !== 'none' ? 'text-purple-400' : 'text-white'}`}
              >
                <Repeat className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onVolumeChange(volume > 0 ? 0 : 1)}
                className="text-white hover:bg-white/10"
              >
                {volume === 0 ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
              
              <div
                ref={volumeRef}
                className="w-24 h-1 bg-white/20 rounded-full cursor-pointer"
                onClick={handleVolumeChange}
              >
                <div
                  className="h-full bg-white rounded-full transition-all duration-100"
                  style={{ width: `${volume * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FullPlayer;