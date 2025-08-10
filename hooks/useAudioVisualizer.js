import { useState, useEffect, useRef, useCallback } from 'react';

export const useAudioVisualizer = (audioElement, isPlaying) => {
  const [audioData, setAudioData] = useState(new Uint8Array(128));
  const [isVisualizerActive, setIsVisualizerActive] = useState(false);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationFrameRef = useRef(null);
  const dataArrayRef = useRef(null);

  const initializeAudioContext = useCallback(async () => {
    if (!audioElement || audioContextRef.current) return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContext();
      
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyser.minDecibels = -90;
      analyser.maxDecibels = -10;

      const source = audioContext.createMediaElementSource(audioElement);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = source;
      dataArrayRef.current = dataArray;

      setIsVisualizerActive(true);
    } catch (error) {
      console.error('Error initializing audio context:', error);
      setIsVisualizerActive(false);
    }
  }, [audioElement]);

  const updateVisualizerData = useCallback(() => {
    if (!analyserRef.current || !dataArrayRef.current) return;

    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    setAudioData(new Uint8Array(dataArrayRef.current));

    if (isPlaying && isVisualizerActive) {
      animationFrameRef.current = requestAnimationFrame(updateVisualizerData);
    }
  }, [isPlaying, isVisualizerActive]);

  const startVisualizer = useCallback(async () => {
    if (!audioElement) return;

    if (!audioContextRef.current) {
      await initializeAudioContext();
    }

    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    if (isVisualizerActive) {
      updateVisualizerData();
    }
  }, [audioElement, initializeAudioContext, isVisualizerActive, updateVisualizerData]);

  const stopVisualizer = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setAudioData(new Uint8Array(128));
  }, []);

  const getFrequencyData = useCallback(() => {
    return Array.from(audioData);
  }, [audioData]);

  const getAverageFrequency = useCallback(() => {
    const sum = audioData.reduce((acc, value) => acc + value, 0);
    return sum / audioData.length;
  }, [audioData]);

  const getBassFrequency = useCallback(() => {
    const bassRange = audioData.slice(0, 8);
    const sum = bassRange.reduce((acc, value) => acc + value, 0);
    return sum / bassRange.length;
  }, [audioData]);

  const getMidFrequency = useCallback(() => {
    const midRange = audioData.slice(8, 32);
    const sum = midRange.reduce((acc, value) => acc + value, 0);
    return sum / midRange.length;
  }, [audioData]);

  const getTrebleFrequency = useCallback(() => {
    const trebleRange = audioData.slice(32, 64);
    const sum = trebleRange.reduce((acc, value) => acc + value, 0);
    return sum / trebleRange.length;
  }, [audioData]);

  const getVisualizerBars = useCallback((barCount = 32) => {
    const step = Math.floor(audioData.length / barCount);
    const bars = [];
    
    for (let i = 0; i < barCount; i++) {
      const start = i * step;
      const end = start + step;
      const slice = audioData.slice(start, end);
      const average = slice.reduce((acc, value) => acc + value, 0) / slice.length;
      bars.push(Math.max(average / 255, 0.01));
    }
    
    return bars;
  }, [audioData]);

  const getCircularVisualizerData = useCallback((points = 64) => {
    const step = Math.floor(audioData.length / points);
    const circularData = [];
    
    for (let i = 0; i < points; i++) {
      const start = i * step;
      const end = start + step;
      const slice = audioData.slice(start, end);
      const average = slice.reduce((acc, value) => acc + value, 0) / slice.length;
      const normalizedValue = average / 255;
      
      const angle = (i / points) * 2 * Math.PI;
      const radius = 50 + (normalizedValue * 100);
      
      circularData.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        value: normalizedValue,
        angle: angle
      });
    }
    
    return circularData;
  }, [audioData]);

  const getWaveformData = useCallback(() => {
    if (!analyserRef.current) return [];
    
    const bufferLength = analyserRef.current.fftSize;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteTimeDomainData(dataArray);
    
    return Array.from(dataArray).map(value => (value - 128) / 128);
  }, []);

  const cleanup = useCallback(() => {
    stopVisualizer();
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    
    audioContextRef.current = null;
    analyserRef.current = null;
    sourceRef.current = null;
    dataArrayRef.current = null;
    setIsVisualizerActive(false);
  }, [stopVisualizer]);

  useEffect(() => {
    if (isPlaying && audioElement) {
      startVisualizer();
    } else {
      stopVisualizer();
    }
  }, [isPlaying, audioElement, startVisualizer, stopVisualizer]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  useEffect(() => {
    const handleUserInteraction = () => {
      if (audioElement && !audioContextRef.current) {
        initializeAudioContext();
      }
    };

    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [audioElement, initializeAudioContext]);

  return {
    audioData,
    isVisualizerActive,
    getFrequencyData,
    getAverageFrequency,
    getBassFrequency,
    getMidFrequency,
    getTrebleFrequency,
    getVisualizerBars,
    getCircularVisualizerData,
    getWaveformData,
    startVisualizer,
    stopVisualizer,
    cleanup
  };
};