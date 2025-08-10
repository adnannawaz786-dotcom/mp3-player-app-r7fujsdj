import { useState, useRef, useEffect, useCallback } from 'react';

export const useAudioPlayer = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none');
  const [playbackRate, setPlaybackRate] = useState(1);

  const initializeAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'metadata';
    }

    const audio = audioRef.current;

    const handleLoadStart = () => setIsLoading(true);
    const handleLoadedData = () => {
      setIsLoading(false);
      setDuration(audio.duration || 0);
      setError(null);
    };
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
    const handleEnded = () => handleTrackEnd();
    const handleError = (e) => {
      setIsLoading(false);
      setError('Failed to load audio');
      setIsPlaying(false);
    };
    const handleCanPlay = () => setIsLoading(false);

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  useEffect(() => {
    const cleanup = initializeAudio();
    return cleanup;
  }, [initializeAudio]);

  const loadTrack = useCallback((track) => {
    if (!audioRef.current || !track) return;

    const audio = audioRef.current;
    setCurrentTrack(track);
    setError(null);
    setIsLoading(true);

    audio.src = track.src;
    audio.volume = isMuted ? 0 : volume;
    audio.playbackRate = playbackRate;
    audio.load();
  }, [volume, isMuted, playbackRate]);

  const play = useCallback(async () => {
    if (!audioRef.current || !currentTrack) return;

    try {
      setError(null);
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      setError('Failed to play audio');
      setIsPlaying(false);
    }
  }, [currentTrack]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seek = useCallback((time) => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = Math.max(0, Math.min(time, duration));
    setCurrentTime(audioRef.current.currentTime);
  }, [duration]);

  const setVolumeLevel = useCallback((newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : clampedVolume;
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
    
    if (audioRef.current) {
      audioRef.current.volume = !isMuted ? 0 : volume;
    }
  }, [isMuted, volume]);

  const setPlaybackSpeed = useCallback((rate) => {
    const clampedRate = Math.max(0.25, Math.min(2, rate));
    setPlaybackRate(clampedRate);
    
    if (audioRef.current) {
      audioRef.current.playbackRate = clampedRate;
    }
  }, []);

  const playTrack = useCallback((track, trackIndex = null) => {
    if (trackIndex !== null) {
      setCurrentTrackIndex(trackIndex);
    }
    loadTrack(track);
  }, [loadTrack]);

  const playTrackAtIndex = useCallback((index) => {
    if (playlist.length === 0 || index < 0 || index >= playlist.length) return;

    const track = playlist[index];
    setCurrentTrackIndex(index);
    loadTrack(track);
  }, [playlist, loadTrack]);

  const nextTrack = useCallback(() => {
    if (playlist.length === 0) return;

    let nextIndex;
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = (currentTrackIndex + 1) % playlist.length;
    }

    playTrackAtIndex(nextIndex);
  }, [playlist, currentTrackIndex, isShuffled, playTrackAtIndex]);

  const previousTrack = useCallback(() => {
    if (playlist.length === 0) return;

    let prevIndex;
    if (isShuffled) {
      prevIndex = Math.floor(Math.random() * playlist.length);
    } else {
      prevIndex = currentTrackIndex === 0 ? playlist.length - 1 : currentTrackIndex - 1;
    }

    playTrackAtIndex(prevIndex);
  }, [playlist, currentTrackIndex, isShuffled, playTrackAtIndex]);

  const handleTrackEnd = useCallback(() => {
    setIsPlaying(false);

    if (repeatMode === 'one') {
      seek(0);
      play();
    } else if (repeatMode === 'all' || repeatMode === 'none') {
      if (currentTrackIndex < playlist.length - 1 || repeatMode === 'all') {
        nextTrack();
      }
    }
  }, [repeatMode, currentTrackIndex, playlist.length, nextTrack, seek, play]);

  const toggleShuffle = useCallback(() => {
    setIsShuffled(!isShuffled);
  }, [isShuffled]);

  const toggleRepeat = useCallback(() => {
    const modes = ['none', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  }, [repeatMode]);

  const updatePlaylist = useCallback((tracks) => {
    setPlaylist(tracks);
    if (tracks.length > 0 && !currentTrack) {
      setCurrentTrackIndex(0);
      loadTrack(tracks[0]);
    }
  }, [currentTrack, loadTrack]);

  const getProgress = useCallback(() => {
    return duration > 0 ? (currentTime / duration) * 100 : 0;
  }, [currentTime, duration]);

  const formatTime = useCallback((time) => {
    if (!time || isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoading,
    error,
    currentTrack,
    playlist,
    currentTrackIndex,
    isShuffled,
    repeatMode,
    playbackRate,
    play,
    pause,
    togglePlayPause,
    seek,
    setVolumeLevel,
    toggleMute,
    setPlaybackSpeed,
    playTrack,
    playTrackAtIndex,
    nextTrack,
    previousTrack,
    toggleShuffle,
    toggleRepeat,
    updatePlaylist,
    loadTrack,
    getProgress,
    formatTime,
    cleanup
  };
};

export default useAudioPlayer;