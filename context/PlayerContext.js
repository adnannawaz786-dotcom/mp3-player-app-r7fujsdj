'use client';

import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';

const PlayerContext = createContext();

const initialState = {
  currentTrack: null,
  tracks: [],
  isPlaying: false,
  isLoading: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  isShuffled: false,
  repeatMode: 'none',
  playbackRate: 1,
  isFullscreen: false,
  isMiniPlayer: false,
  queue: [],
  currentIndex: -1,
  visualizerData: new Array(64).fill(0),
  error: null,
  audioContext: null,
  analyser: null,
  dataArray: null,
  source: null
};

const playerReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TRACKS':
      return {
        ...state,
        tracks: action.payload,
        queue: action.payload
      };
    
    case 'SET_CURRENT_TRACK':
      return {
        ...state,
        currentTrack: action.payload.track,
        currentIndex: action.payload.index,
        currentTime: 0,
        duration: 0,
        error: null
      };
    
    case 'PLAY':
      return {
        ...state,
        isPlaying: true,
        error: null
      };
    
    case 'PAUSE':
      return {
        ...state,
        isPlaying: false
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    case 'SET_TIME':
      return {
        ...state,
        currentTime: action.payload
      };
    
    case 'SET_DURATION':
      return {
        ...state,
        duration: action.payload
      };
    
    case 'SET_VOLUME':
      return {
        ...state,
        volume: action.payload,
        isMuted: action.payload === 0
      };
    
    case 'TOGGLE_MUTE':
      return {
        ...state,
        isMuted: !state.isMuted
      };
    
    case 'SET_SHUFFLE':
      return {
        ...state,
        isShuffled: action.payload,
        queue: action.payload ? shuffleArray([...state.tracks]) : state.tracks
      };
    
    case 'SET_REPEAT':
      return {
        ...state,
        repeatMode: action.payload
      };
    
    case 'SET_PLAYBACK_RATE':
      return {
        ...state,
        playbackRate: action.payload
      };
    
    case 'TOGGLE_FULLSCREEN':
      return {
        ...state,
        isFullscreen: !state.isFullscreen,
        isMiniPlayer: false
      };
    
    case 'TOGGLE_MINI_PLAYER':
      return {
        ...state,
        isMiniPlayer: !state.isMiniPlayer,
        isFullscreen: false
      };
    
    case 'SET_VISUALIZER_DATA':
      return {
        ...state,
        visualizerData: action.payload
      };
    
    case 'SET_AUDIO_CONTEXT':
      return {
        ...state,
        audioContext: action.payload.context,
        analyser: action.payload.analyser,
        dataArray: action.payload.dataArray,
        source: action.payload.source
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        isPlaying: false
      };
    
    case 'NEXT_TRACK':
      const nextIndex = getNextTrackIndex(state.currentIndex, state.queue.length, state.repeatMode);
      return {
        ...state,
        currentIndex: nextIndex,
        currentTrack: nextIndex !== -1 ? state.queue[nextIndex] : null,
        currentTime: 0,
        error: null
      };
    
    case 'PREVIOUS_TRACK':
      const prevIndex = getPreviousTrackIndex(state.currentIndex, state.queue.length, state.repeatMode);
      return {
        ...state,
        currentIndex: prevIndex,
        currentTrack: prevIndex !== -1 ? state.queue[prevIndex] : null,
        currentTime: 0,
        error: null
      };
    
    case 'RESET_PLAYER':
      return {
        ...initialState,
        tracks: state.tracks,
        queue: state.queue
      };
    
    default:
      return state;
  }
};

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const getNextTrackIndex = (currentIndex, queueLength, repeatMode) => {
  if (queueLength === 0) return -1;
  
  if (repeatMode === 'one') {
    return currentIndex;
  }
  
  const nextIndex = currentIndex + 1;
  
  if (nextIndex >= queueLength) {
    return repeatMode === 'all' ? 0 : -1;
  }
  
  return nextIndex;
};

const getPreviousTrackIndex = (currentIndex, queueLength, repeatMode) => {
  if (queueLength === 0) return -1;
  
  if (repeatMode === 'one') {
    return currentIndex;
  }
  
  const prevIndex = currentIndex - 1;
  
  if (prevIndex < 0) {
    return repeatMode === 'all' ? queueLength - 1 : -1;
  }
  
  return prevIndex;
};

export const PlayerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const audioRef = useRef(null);
  const animationFrameRef = useRef(null);

  const setTracks = (tracks) => {
    dispatch({ type: 'SET_TRACKS', payload: tracks });
  };

  const playTrack = (track, index) => {
    dispatch({ type: 'SET_CURRENT_TRACK', payload: { track, index } });
    dispatch({ type: 'SET_LOADING', payload: true });
  };

  const play = () => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          dispatch({ type: 'PLAY' });
          dispatch({ type: 'SET_LOADING', payload: false });
        })
        .catch((error) => {
          dispatch({ type: 'SET_ERROR', payload: error.message });
        });
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      dispatch({ type: 'PAUSE' });
    }
  };

  const togglePlay = () => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const seekTo = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      dispatch({ type: 'SET_TIME', payload: time });
    }
  };

  const setVolume = (volume) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
    dispatch({ type: 'SET_VOLUME', payload: clampedVolume });
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !state.isMuted;
      audioRef.current.muted = newMutedState;
      dispatch({ type: 'TOGGLE_MUTE' });
    }
  };

  const toggleShuffle = () => {
    dispatch({ type: 'SET_SHUFFLE', payload: !state.isShuffled });
  };

  const setRepeatMode = () => {
    const modes = ['none', 'all', 'one'];
    const currentIndex = modes.indexOf(state.repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    dispatch({ type: 'SET_REPEAT', payload: nextMode });
  };

  const nextTrack = () => {
    dispatch({ type: 'NEXT_TRACK' });
  };

  const previousTrack = () => {
    dispatch({ type: 'PREVIOUS_TRACK' });
  };

  const setPlaybackRate = (rate) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
    dispatch({ type: 'SET_PLAYBACK_RATE', payload: rate });
  };

  const toggleFullscreen = () => {
    dispatch({ type: 'TOGGLE_FULLSCREEN' });
  };

  const toggleMiniPlayer = () => {
    dispatch({ type: 'TOGGLE_MINI_PLAYER' });
  };

  const initializeAudioContext = () => {
    if (!state.audioContext && audioRef.current) {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaElementSource(audioRef.current);
        
        analyser.fftSize = 128;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        
        dispatch({
          type: 'SET_AUDIO_CONTEXT',
          payload: { context: audioContext, analyser, dataArray, source }
        });
      } catch (error) {
        console.error('Failed to initialize audio context:', error);
      }
    }
  };

  const updateVisualizerData = () => {
    if (state.analyser && state.dataArray) {
      state.analyser.getByteFrequencyData(state.dataArray);
      dispatch({ type: 'SET_VISUALIZER_DATA', payload: Array.from(state.dataArray) });
    }
    
    if (state.isPlaying) {
      animationFrameRef.current = requestAnimationFrame(updateVisualizerData);
    }
  };

  useEffect(() => {
    if (state.isPlaying && state.analyser) {
      updateVisualizerData();
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.isPlaying, state.analyser]);

  const value = {
    ...state,
    audioRef,
    setTracks,
    playTrack,
    play,
    pause,
    togglePlay,
    seekTo,
    setVolume,
    toggleMute,
    toggleShuffle,
    setRepeatMode,
    nextTrack,
    previousTrack,
    setPlaybackRate,
    toggleFullscreen,
    toggleMiniPlayer,
    initializeAudioContext
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export default PlayerContext;