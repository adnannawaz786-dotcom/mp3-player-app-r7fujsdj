import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Volume2, 
  VolumeX,
  Heart,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '../lib/utils';

const PlayerControls = ({ 
  isPlaying = false,
  onPlayPause,
  onPrevious,
  onNext,
  onShuffle,
  onRepeat,
  onVolumeToggle,
  onLike,
  onMore,
  isShuffled = false,
  repeatMode = 'off',
  isMuted = false,
  isLiked = false,
  volume = 1,
  onVolumeChange,
  size = 'default',
  showSecondaryControls = true,
  className
}) => {
  const sizeClasses = {
    small: {
      primary: 'h-8 w-8',
      secondary: 'h-6 w-6',
      icon: 'h-4 w-4'
    },
    default: {
      primary: 'h-12 w-12',
      secondary: 'h-8 w-8',
      icon: 'h-5 w-5'
    },
    large: {
      primary: 'h-16 w-16',
      secondary: 'h-10 w-10',
      icon: 'h-6 w-6'
    }
  };

  const currentSize = sizeClasses[size];

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const playButtonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.9 }
  };

  const getRepeatIcon = () => {
    if (repeatMode === 'one') {
      return <Repeat className={cn(currentSize.icon, 'text-blue-500')} />;
    }
    return <Repeat className={cn(currentSize.icon, repeatMode === 'all' ? 'text-blue-500' : '')} />;
  };

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      {showSecondaryControls && (
        <>
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={onShuffle}
              className={cn(
                currentSize.secondary,
                'rounded-full',
                isShuffled && 'text-blue-500'
              )}
            >
              <Shuffle className={currentSize.icon} />
            </Button>
          </motion.div>

          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={onPrevious}
              className={cn(currentSize.secondary, 'rounded-full')}
            >
              <SkipBack className={currentSize.icon} />
            </Button>
          </motion.div>
        </>
      )}

      <motion.div
        variants={playButtonVariants}
        whileHover="hover"
        whileTap="tap"
        className="relative"
      >
        <Button
          variant="default"
          size="icon"
          onClick={onPlayPause}
          className={cn(
            currentSize.primary,
            'rounded-full bg-white text-black hover:bg-gray-100 shadow-lg'
          )}
        >
          {isPlaying ? (
            <Pause className={currentSize.icon} />
          ) : (
            <Play className={cn(currentSize.icon, 'ml-0.5')} />
          )}
        </Button>
      </motion.div>

      {showSecondaryControls && (
        <>
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={onNext}
              className={cn(currentSize.secondary, 'rounded-full')}
            >
              <SkipForward className={currentSize.icon} />
            </Button>
          </motion.div>

          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={onRepeat}
              className={cn(currentSize.secondary, 'rounded-full')}
            >
              {getRepeatIcon()}
            </Button>
          </motion.div>
        </>
      )}

      {size !== 'small' && showSecondaryControls && (
        <div className="flex items-center gap-2 ml-4">
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={onLike}
              className={cn(
                currentSize.secondary,
                'rounded-full',
                isLiked && 'text-red-500'
              )}
            >
              <Heart className={cn(currentSize.icon, isLiked && 'fill-current')} />
            </Button>
          </motion.div>

          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={onVolumeToggle}
              className={cn(currentSize.secondary, 'rounded-full')}
            >
              {isMuted ? (
                <VolumeX className={currentSize.icon} />
              ) : (
                <Volume2 className={currentSize.icon} />
              )}
            </Button>
          </motion.div>

          {onVolumeChange && (
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #ffffff 0%, #ffffff ${(isMuted ? 0 : volume) * 100}%, #4b5563 ${(isMuted ? 0 : volume) * 100}%, #4b5563 100%)`
                }}
              />
            </div>
          )}

          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={onMore}
              className={cn(currentSize.secondary, 'rounded-full')}
            >
              <MoreHorizontal className={currentSize.icon} />
            </Button>
          </motion.div>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default PlayerControls;