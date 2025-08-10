'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const AudioVisualizer = ({ 
  audioElement, 
  isPlaying, 
  className = '',
  variant = 'bars',
  barCount = 64,
  sensitivity = 1,
  color = 'rgb(59, 130, 246)',
  height = 200 
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const dataArrayRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeAudioContext = useCallback(async () => {
    if (!audioElement || isInitialized) return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      
      const source = audioContext.createMediaElementSource(audioElement);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = source;
      dataArrayRef.current = dataArray;
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing audio context:', error);
    }
  }, [audioElement, isInitialized]);

  const drawBars = useCallback((canvas, ctx, dataArray, width, height) => {
    const barWidth = width / barCount;
    const barSpacing = barWidth * 0.1;
    const actualBarWidth = barWidth - barSpacing;
    
    ctx.clearRect(0, 0, width, height);
    
    for (let i = 0; i < barCount; i++) {
      const dataIndex = Math.floor((i / barCount) * dataArray.length);
      const barHeight = (dataArray[dataIndex] / 255) * height * sensitivity;
      
      const x = i * barWidth + barSpacing / 2;
      const y = height - barHeight;
      
      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.5, color.replace('rgb', 'rgba').replace(')', ', 0.8)'));
      gradient.addColorStop(1, color.replace('rgb', 'rgba').replace(')', ', 0.4)'));
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, actualBarWidth, barHeight);
      
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.fillRect(x, y, actualBarWidth, barHeight);
      ctx.shadowBlur = 0;
    }
  }, [barCount, sensitivity, color]);

  const drawWave = useCallback((canvas, ctx, dataArray, width, height) => {
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.beginPath();
    
    const sliceWidth = width / dataArray.length;
    let x = 0;
    
    for (let i = 0; i < dataArray.length; i++) {
      const v = (dataArray[i] / 255) * sensitivity;
      const y = (v * height) / 2 + height / 2;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      x += sliceWidth;
    }
    
    ctx.stroke();
    
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }, [sensitivity, color]);

  const drawCircular = useCallback((canvas, ctx, dataArray, width, height) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.3;
    
    ctx.clearRect(0, 0, width, height);
    
    const angleStep = (Math.PI * 2) / barCount;
    
    for (let i = 0; i < barCount; i++) {
      const dataIndex = Math.floor((i / barCount) * dataArray.length);
      const barHeight = (dataArray[dataIndex] / 255) * radius * sensitivity;
      
      const angle = i * angleStep;
      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + barHeight);
      const y2 = centerY + Math.sin(angle) * (radius + barHeight);
      
      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, color.replace('rgb', 'rgba').replace(')', ', 0.4)'));
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = color.replace('rgb', 'rgba').replace(')', ', 0.3)');
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [barCount, sensitivity, color]);

  const animate = useCallback(() => {
    if (!analyserRef.current || !dataArrayRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    
    switch (variant) {
      case 'wave':
        drawWave(canvas, ctx, dataArrayRef.current, width, height);
        break;
      case 'circular':
        drawCircular(canvas, ctx, dataArrayRef.current, width, height);
        break;
      default:
        drawBars(canvas, ctx, dataArrayRef.current, width, height);
    }
    
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [variant, isPlaying, drawBars, drawWave, drawCircular]);

  const drawStaticVisualization = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    
    const staticData = new Uint8Array(128);
    for (let i = 0; i < staticData.length; i++) {
      staticData[i] = Math.random() * 50 + 10;
    }
    
    switch (variant) {
      case 'wave':
        drawWave(canvas, ctx, staticData, width, height);
        break;
      case 'circular':
        drawCircular(canvas, ctx, staticData, width, height);
        break;
      default:
        drawBars(canvas, ctx, staticData, width, height);
    }
  }, [variant, drawBars, drawWave, drawCircular]);

  useEffect(() => {
    if (audioElement && !isInitialized) {
      const handleCanPlay = () => {
        initializeAudioContext();
      };
      
      if (audioElement.readyState >= 3) {
        initializeAudioContext();
      } else {
        audioElement.addEventListener('canplay', handleCanPlay);
        return () => audioElement.removeEventListener('canplay', handleCanPlay);
      }
    }
  }, [audioElement, initializeAudioContext, isInitialized]);

  useEffect(() => {
    if (isPlaying && isInitialized) {
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      animate();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (!isPlaying) {
        drawStaticVisualization();
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, isInitialized, animate, drawStaticVisualization]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      
      const ctx = canvas.getContext('2d');
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      
      if (!isPlaying) {
        drawStaticVisualization();
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [drawStaticVisualization, isPlaying]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-slate-700/50 ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{ height }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ 
          width: '100%', 
          height: '100%',
          filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))'
        }}
      />
      
      {!isInitialized && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-slate-400 text-sm">
            Initializing visualizer...
          </div>
        </div>
      )}
      
      <div className="absolute top-2 right-2 flex gap-1">
        {['bars', 'wave', 'circular'].map((type) => (
          <button
            key={type}
            onClick={() => {}}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              variant === type
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-slate-700/50 text-slate-400 hover:text-slate-300'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default AudioVisualizer;