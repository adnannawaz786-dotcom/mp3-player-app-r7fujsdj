import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

const TrackItem = ({ 
  track, 
  isPlaying, 
  isCurrentTrack, 
  onPlay, 
  onPause, 
  index,
  showIndex = true,
  compact = false,
  showDuration = true,
  showArtist = true,
  showAlbum = false,
  className = ''
}) => {
  const handlePlayPause = (e) => {
    e.stopPropagation();
    if (isCurrentTrack && isPlaying) {
      onPause();
    } else {
      onPlay(track, index);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const trackVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, delay: index * 0.05 }
    },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  const playButtonVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 }
  };

  if (compact) {
    return (
      <motion.div
        variants={trackVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        className={`flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group ${
          isCurrentTrack ? 'bg-white/10' : ''
        } ${className}`}
        onClick={() => onPlay(track, index)}
      >
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md flex items-center justify-center">
            {track.artwork ? (
              <img 
                src={track.artwork} 
                alt={track.title}
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <span className="text-white text-xs font-bold">
                {track.title?.charAt(0) || '♪'}
              </span>
            )}
          </div>
          <motion.div
            variants={playButtonVariants}
            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Button
              size="sm"
              variant="ghost"
              className="w-6 h-6 p-0 text-white hover:bg-white/20"
              onClick={handlePlayPause}
            >
              {isCurrentTrack && isPlaying ? (
                <Pause className="w-3 h-3" />
              ) : (
                <Play className="w-3 h-3" />
              )}
            </Button>
          </motion.div>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className={`font-medium truncate ${
            isCurrentTrack ? 'text-purple-400' : 'text-white'
          }`}>
            {track.title || 'Unknown Track'}
          </h4>
          {showArtist && (
            <p className="text-sm text-gray-400 truncate">
              {track.artist || 'Unknown Artist'}
            </p>
          )}
        </div>

        {showDuration && (
          <span className="text-sm text-gray-400 flex-shrink-0">
            {formatDuration(track.duration)}
          </span>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={trackVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className={className}
    >
      <Card className={`p-4 bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group ${
        isCurrentTrack ? 'ring-2 ring-purple-500/50 bg-white/10' : ''
      }`}>
        <div className="flex items-center gap-4">
          {showIndex && (
            <div className="w-8 text-center flex-shrink-0">
              <span className={`text-sm ${
                isCurrentTrack ? 'text-purple-400' : 'text-gray-400'
              } group-hover:hidden`}>
                {index + 1}
              </span>
              <motion.div
                variants={playButtonVariants}
                className="hidden group-hover:block"
              >
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-8 h-8 p-0 text-white hover:bg-white/20"
                  onClick={handlePlayPause}
                >
                  {isCurrentTrack && isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
              </motion.div>
            </div>
          )}

          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              {track.artwork ? (
                <img 
                  src={track.artwork} 
                  alt={track.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-white font-bold">
                  {track.title?.charAt(0) || '♪'}
                </span>
              )}
            </div>
            {isCurrentTrack && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1"
              >
                <Badge variant="secondary" className="bg-purple-500 text-white text-xs px-1 py-0">
                  {isPlaying ? '♪' : '⏸'}
                </Badge>
              </motion.div>
            )}
          </div>

          <div className="flex-1 min-w-0" onClick={() => onPlay(track, index)}>
            <h3 className={`font-semibold truncate ${
              isCurrentTrack ? 'text-purple-400' : 'text-white'
            }`}>
              {track.title || 'Unknown Track'}
            </h3>
            {showArtist && (
              <p className="text-sm text-gray-400 truncate">
                {track.artist || 'Unknown Artist'}
              </p>
            )}
            {showAlbum && track.album && (
              <p className="text-xs text-gray-500 truncate">
                {track.album}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {showDuration && (
              <span className="text-sm text-gray-400">
                {formatDuration(track.duration)}
              </span>
            )}
            
            <Button
              size="sm"
              variant="ghost"
              className="w-8 h-8 p-0 text-gray-400 hover:text-white hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {isCurrentTrack && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="mt-3 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full origin-left"
          />
        )}
      </Card>
    </motion.div>
  );
};

export default TrackItem;