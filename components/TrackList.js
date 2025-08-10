import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Music, Clock, MoreVertical } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const TrackList = ({ 
  tracks = [], 
  currentTrack = null, 
  isPlaying = false, 
  onTrackSelect, 
  onPlayPause,
  className = '' 
}) => {
  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const getTrackNumber = (index) => {
    return (index + 1).toString().padStart(2, '0');
  };

  const handleTrackClick = (track, index) => {
    if (currentTrack?.id === track.id) {
      onPlayPause();
    } else {
      onTrackSelect(track, index);
    }
  };

  const isCurrentTrack = (track) => {
    return currentTrack?.id === track.id;
  };

  if (!tracks || tracks.length === 0) {
    return (
      <Card className={`p-8 text-center ${className}`}>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <Music className="w-8 h-8 text-purple-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              No tracks available
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Add some music files to get started
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Playlist
          </h2>
          <Badge variant="secondary" className="text-xs">
            {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}
          </Badge>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        <AnimatePresence>
          {tracks.map((track, index) => (
            <motion.div
              key={track.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className={`
                group relative border-b border-gray-100 dark:border-gray-800 last:border-b-0
                ${isCurrentTrack(track) 
                  ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }
                transition-all duration-200 cursor-pointer
              `}
              onClick={() => handleTrackClick(track, index)}
            >
              <div className="flex items-center p-4 space-x-4">
                <div className="flex-shrink-0 relative">
                  <div className={`
                    w-12 h-12 rounded-lg flex items-center justify-center text-sm font-medium
                    ${isCurrentTrack(track)
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }
                  `}>
                    {isCurrentTrack(track) ? (
                      <motion.div
                        initial={false}
                        animate={{ scale: isPlaying ? 1.1 : 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5 ml-0.5" />
                        )}
                      </motion.div>
                    ) : (
                      <span className="group-hover:hidden">
                        {getTrackNumber(index)}
                      </span>
                    )}
                    {!isCurrentTrack(track) && (
                      <Play className="w-5 h-5 ml-0.5 hidden group-hover:block" />
                    )}
                  </div>
                  
                  {isCurrentTrack(track) && isPlaying && (
                    <div className="absolute -bottom-1 -right-1">
                      <div className="flex space-x-0.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"
                            animate={{
                              height: [4, 12, 4],
                            }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className={`
                        text-sm font-medium truncate
                        ${isCurrentTrack(track)
                          ? 'text-purple-600 dark:text-purple-400'
                          : 'text-gray-900 dark:text-white'
                        }
                      `}>
                        {track.title || track.name || `Track ${index + 1}`}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                        {track.artist || 'Unknown Artist'}
                        {track.album && ` • ${track.album}`}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <div className="text-right">
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDuration(track.duration)}
                        </div>
                        {track.size && (
                          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {formatFileSize(track.size)}
                          </div>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {track.genre && (
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        {track.genre}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {isCurrentTrack(track) && (
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>
            {tracks.length} {tracks.length === 1 ? 'song' : 'songs'}
          </span>
          <span>
            {formatDuration(tracks.reduce((total, track) => total + (track.duration || 0), 0))} total
          </span>
        </div>
      </div>
    </Card>
  );
};

export default TrackList;