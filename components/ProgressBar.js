'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({
  currentTime = 0,
  duration = 0,
  onSeek,
  className = '',
  showTime = true,
  size = 'default',
  variant = 'default',
  disabled = false,
  buffered = 0,
  ...props
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const progressRef = useRef(null);
  const animationRef = useRef(null);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedProgress = duration > 0 ? (buffered / duration) * 100 : 0;
  const displayProgress = isDragging ? dragPosition : progress;

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getPositionFromEvent = (event) => {
    if (!progressRef.current) return 0;
    const rect = progressRef.current.getBoundingClientRect();
    const clientX = event.type.includes('touch') ? event.touches[0].clientX : event.clientX;
    const position = ((clientX - rect.left) / rect.width) * 100;
    return Math.max(0, Math.min(100, position));
  };

  const handleMouseDown = (event) => {
    if (disabled || duration === 0) return;
    event.preventDefault();
    setIsDragging(true);
    const position = getPositionFromEvent(event);
    setDragPosition(position);
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return;
    event.preventDefault();
    const position = getPositionFromEvent(event);
    setDragPosition(position);
  };

  const handleMouseUp = (event) => {
    if (!isDragging) return;
    event.preventDefault();
    setIsDragging(false);
    const position = getPositionFromEvent(event);
    const newTime = (position / 100) * duration;
    onSeek?.(newTime);
  };

  const handleClick = (event) => {
    if (disabled || duration === 0 || isDragging) return;
    const position = getPositionFromEvent(event);
    const newTime = (position / 100) * duration;
    onSeek?.(newTime);
  };

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (event) => handleMouseMove(event);
      const handleGlobalMouseUp = (event) => handleMouseUp(event);
      const handleTouchMove = (event) => handleMouseMove(event);
      const handleTouchEnd = (event) => handleMouseUp(event);

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging]);

  const sizeClasses = {
    sm: 'h-1',
    default: 'h-2',
    lg: 'h-3'
  };

  const variantClasses = {
    default: 'bg-white/20',
    primary: 'bg-blue-500/20',
    accent: 'bg-purple-500/20'
  };

  const progressVariantClasses = {
    default: 'bg-white',
    primary: 'bg-blue-500',
    accent: 'bg-purple-500'
  };

  const thumbVariantClasses = {
    default: 'bg-white border-white',
    primary: 'bg-blue-500 border-blue-500',
    accent: 'bg-purple-500 border-purple-500'
  };

  return (
    <div className={`w-full ${className}`} {...props}>
      {showTime && (
        <div className="flex justify-between items-center mb-2 text-sm text-white/70">
          <span>{formatTime(isDragging ? (dragPosition / 100) * duration : currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      )}
      
      <div
        ref={progressRef}
        className={`
          relative w-full rounded-full cursor-pointer transition-all duration-200
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${isHovered ? 'scale-y-125' : ''}
        `}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {bufferedProgress > 0 && (
          <div
            className="absolute top-0 left-0 h-full bg-white/10 rounded-full transition-all duration-300"
            style={{ width: `${bufferedProgress}%` }}
          />
        )}
        
        <motion.div
          className={`
            absolute top-0 left-0 h-full rounded-full transition-colors duration-200
            ${progressVariantClasses[variant]}
          `}
          initial={{ width: 0 }}
          animate={{ width: `${displayProgress}%` }}
          transition={{ 
            duration: isDragging ? 0 : 0.1,
            ease: 'easeOut'
          }}
        />
        
        {(isHovered || isDragging) && !disabled && duration > 0 && (
          <motion.div
            className={`
              absolute top-1/2 w-4 h-4 rounded-full border-2 shadow-lg cursor-grab
              ${thumbVariantClasses[variant]}
              ${isDragging ? 'cursor-grabbing scale-110' : ''}
            `}
            style={{
              left: `${displayProgress}%`,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: isDragging ? 1.1 : 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
        
        {isDragging && (
          <div
            className="absolute -top-8 bg-black/80 text-white text-xs px-2 py-1 rounded pointer-events-none"
            style={{
              left: `${dragPosition}%`,
              transform: 'translateX(-50%)'
            }}
          >
            {formatTime((dragPosition / 100) * duration)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;