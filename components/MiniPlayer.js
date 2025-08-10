import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, Heart, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

const MiniPlayer = ({ onExpand, className = '' }) => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isLoading,
    play,
    pause,
    nextTrack,
    previousTrack,
    seek,
    setVolume,
    toggleLike
  } = useAudioPlayer();

  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    seek(newTime);
  };

  const handleVolumeChange = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    setVolume(percentage);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed bottom-0 left-0 right-0 z-50 ${className}`}
      >
        <Card className="rounded-none border-t border-l-0 border-r-0 border-b-0 bg-background/95 backdrop-blur-lg shadow-2xl">
          <div className="px-4 py-3">
            <div 
              className="absolute top-0 left-0 right-0 h-1 bg-muted cursor-pointer group"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-primary transition-all duration-300 group-hover:bg-primary/80"
                style={{ width: `${progress}%` }}
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ left: `${progress}%`, transform: 'translateX(-50%) translateY(-50%)' }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative cursor-pointer"
                  onClick={onExpand}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    {currentTrack.artwork ? (
                      <img 
                        src={currentTrack.artwork} 
                        alt={currentTrack.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-primary/40 rounded" />
                    )}
                  </div>
                  <motion.div
                    className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200"
                  >
                    <Maximize2 className="w-4 h-4 text-white" />
                  </motion.div>
                </motion.div>

                <div className="flex-1 min-w-0" onClick={onExpand}>
                  <h3 className="font-semibold text-sm truncate cursor-pointer hover:text-primary transition-colors">
                    {currentTrack.title}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate cursor-pointer hover:text-foreground transition-colors">
                    {currentTrack.artist}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {formatTime(currentTime)}
                    </span>
                    <span className="text-xs text-muted-foreground">/</span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(duration)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={previousTrack}
                  className="h-8 w-8 p-0 hover:bg-primary/10"
                >
                  <SkipBack className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={isPlaying ? pause : play}
                  disabled={isLoading}
                  className="h-10 w-10 p-0 hover:bg-primary/10 hover:scale-105 transition-all duration-200"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
                    />
                  ) : isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextTrack}
                  className="h-8 w-8 p-0 hover:bg-primary/10"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>

              <div className="hidden md:flex items-center space-x-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleLike(currentTrack.id)}
                  className={`h-8 w-8 p-0 ${currentTrack.liked ? 'text-red-500 hover:text-red-600' : 'hover:text-red-500'}`}
                >
                  <Heart className={`w-4 h-4 ${currentTrack.liked ? 'fill-current' : ''}`} />
                </Button>

                <div className="flex items-center space-x-2 group">
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <div 
                    className="w-20 h-1 bg-muted rounded-full cursor-pointer relative"
                    onClick={handleVolumeChange}
                  >
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-200"
                      style={{ width: `${volume * 100}%` }}
                    />
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ left: `${volume * 100}%`, transform: 'translateX(-50%) translateY(-50%)' }}
                    />
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-primary/10"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default MiniPlayer;