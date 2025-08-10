import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Repeat, 
  Shuffle, 
  Heart,
  MoreHorizontal,
  ChevronDown,
  Share,
  Download
} from 'lucide-react';

export default function PlayerPage() {
  const router = useRouter();
  const { trackId } = router.query;
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off');
  const [isLiked, setIsLiked] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);

  const sampleTracks = [
    {
      id: 1,
      title: "Midnight Dreams",
      artist: "Luna Eclipse",
      album: "Nocturnal Vibes",
      duration: "3:45",
      url: "/audio/sample1.mp3",
      cover: "/images/cover1.jpg"
    },
    {
      id: 2,
      title: "Electric Pulse",
      artist: "Neon Waves",
      album: "Digital Horizon",
      duration: "4:12",
      url: "/audio/sample2.mp3",
      cover: "/images/cover2.jpg"
    },
    {
      id: 3,
      title: "Ocean Breeze",
      artist: "Coastal Sounds",
      album: "Serenity",
      duration: "5:23",
      url: "/audio/sample3.mp3",
      cover: "/images/cover3.jpg"
    }
  ];

  const currentTrack = sampleTracks.find(track => track.id === parseInt(trackId)) || sampleTracks[0];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleTrackEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleTrackEnd);
    };
  }, [currentTrack]);

  useEffect(() => {
    initializeVisualizer();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const initializeVisualizer = async () => {
    if (!audioRef.current || !canvasRef.current) return;

    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContextRef.current.createMediaElementSource(audioRef.current);
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      source.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
      
      drawVisualizer();
    } catch (error) {
      console.error('Error initializing visualizer:', error);
    }
  };

  const drawVisualizer = () => {
    if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    analyserRef.current.getByteFrequencyData(dataArrayRef.current);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);

    const barWidth = (width / dataArrayRef.current.length) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < dataArrayRef.current.length; i++) {
      barHeight = (dataArrayRef.current[i] / 255) * height;

      const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
      gradient.addColorStop(0, '#8b5cf6');
      gradient.addColorStop(1, '#06b6d4');

      ctx.fillStyle = gradient;
      ctx.fillRect(x, height - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }

    animationRef.current = requestAnimationFrame(drawVisualizer);
  };

  const togglePlayPause = async () => {
    if (!audioRef.current) return;

    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTrackEnd = () => {
    if (repeatMode === 'one') {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (repeatMode === 'all') {
      skipToNext();
    } else {
      setIsPlaying(false);
    }
  };

  const skipToNext = () => {
    const currentIndex = sampleTracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % sampleTracks.length;
    router.push(`/player?trackId=${sampleTracks[nextIndex].id}`);
  };

  const skipToPrevious = () => {
    const currentIndex = sampleTracks.findIndex(track => track.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? sampleTracks.length - 1 : currentIndex - 1;
    router.push(`/player?trackId=${sampleTracks[prevIndex].id}`);
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newVolume = Math.max(0, Math.min(1, percent));
    setVolume(newVolume);
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleRepeat = () => {
    const modes = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const volumePercent = isMuted ? 0 : volume * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <audio ref={audioRef} src={currentTrack.url} />
      
      <div className="container mx-auto px-4 py-6 max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-white hover:bg-white/10"
            >
              <ChevronDown className="w-6 h-6" />
            </Button>
            <div className="text-center">
              <p className="text-sm opacity-70">Playing from</p>
              <p className="font-medium">{currentTrack.album}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <MoreHorizontal className="w-6 h-6" />
            </Button>
          </div>

          <div className="relative">
            <motion.div
              className="aspect-square rounded-2xl overflow-hidden shadow-2xl"
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={300}
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">{currentTrack.title}</h1>
            <p className="text-lg opacity-70">{currentTrack.artist}</p>
          </div>

          <div className="space-y-2">
            <div
              className="h-1 bg-white/20 rounded-full cursor-pointer"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-sm opacity-70">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsShuffled(!isShuffled)}
              className={`text-white hover:bg-white/10 ${isShuffled ? 'text-purple-300' : ''}`}
            >
              <Shuffle className="w-5 h-5" />
            </Button>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={skipToPrevious}
                className="text-white hover:bg-white/10"
              >
                <SkipBack className="w-6 h-6" />
              </Button>

              <Button
                onClick={togglePlayPause}
                className="w-16 h-16 rounded-full bg-white text-black hover:bg-gray-100"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={skipToNext}
                className="text-white hover:bg-white/10"
              >
                <SkipForward className="w-6 h-6" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleRepeat}
              className={`text-white hover:bg-white/10 ${repeatMode !== 'off' ? 'text-purple-300' : ''}`}
            >
              <Repeat className="w-5 h-5" />
              {repeatMode === 'one' && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full text-xs flex items-center justify-center">
                  1
                </span>
              )}
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="text-white hover:bg-white/10"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
            <div
              className="flex-1 h-1 bg-white/20 rounded-full cursor-pointer"
              onClick={handleVolumeChange}
            >
              <div
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${volumePercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-center space-x-8 pt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
              className={`text-white hover:bg-white/10 ${isLiked ? 'text-red-400' : ''}`}
            >
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Share className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >