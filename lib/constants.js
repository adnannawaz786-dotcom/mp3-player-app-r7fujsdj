// App constants and configuration
export const APP_NAME = 'MP3 Player';
export const APP_VERSION = '1.0.0';

// Player states
export const PLAYER_STATES = {
  PLAYING: 'playing',
  PAUSED: 'paused',
  STOPPED: 'stopped',
  LOADING: 'loading',
  ERROR: 'error'
};

// Repeat modes
export const REPEAT_MODES = {
  OFF: 'off',
  ONE: 'one',
  ALL: 'all'
};

// Visualizer types
export const VISUALIZER_TYPES = {
  BARS: 'bars',
  WAVE: 'wave',
  CIRCLE: 'circle',
  SPECTRUM: 'spectrum'
};

// Audio settings
export const AUDIO_SETTINGS = {
  DEFAULT_VOLUME: 0.7,
  FADE_DURATION: 300,
  CROSSFADE_DURATION: 500,
  BUFFER_SIZE: 2048,
  FFT_SIZE: 256,
  SAMPLE_RATE: 44100
};

// UI constants
export const UI_CONSTANTS = {
  MINI_PLAYER_HEIGHT: 80,
  FULL_PLAYER_HEIGHT: '100vh',
  SIDEBAR_WIDTH: 300,
  MOBILE_BREAKPOINT: 768,
  ANIMATION_DURATION: 200,
  DEBOUNCE_DELAY: 300
};

// Color themes
export const THEMES = {
  DARK: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#0f0f23',
    surface: '#1a1a2e',
    text: '#ffffff',
    textSecondary: '#a1a1aa',
    accent: '#f59e0b'
  },
  LIGHT: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1f2937',
    textSecondary: '#6b7280',
    accent: '#f59e0b'
  }
};

// Sample track data
export const SAMPLE_TRACKS = [
  {
    id: '1',
    title: 'Midnight Dreams',
    artist: 'Luna Eclipse',
    album: 'Nocturnal Vibes',
    duration: 245,
    url: '/audio/midnight-dreams.mp3',
    cover: '/images/covers/midnight-dreams.jpg',
    genre: 'Electronic',
    year: 2023,
    favorite: true,
    playCount: 127,
    waveform: [0.2, 0.4, 0.6, 0.8, 0.5, 0.3, 0.7, 0.9, 0.4, 0.6]
  },
  {
    id: '2',
    title: 'Ocean Waves',
    artist: 'Coastal Sounds',
    album: 'Nature\'s Symphony',
    duration: 198,
    url: '/audio/ocean-waves.mp3',
    cover: '/images/covers/ocean-waves.jpg',
    genre: 'Ambient',
    year: 2022,
    favorite: false,
    playCount: 89,
    waveform: [0.1, 0.3, 0.5, 0.4, 0.6, 0.2, 0.8, 0.3, 0.5, 0.7]
  },
  {
    id: '3',
    title: 'City Lights',
    artist: 'Urban Pulse',
    album: 'Metropolitan',
    duration: 267,
    url: '/audio/city-lights.mp3',
    cover: '/images/covers/city-lights.jpg',
    genre: 'Synthwave',
    year: 2023,
    favorite: true,
    playCount: 203,
    waveform: [0.3, 0.7, 0.4, 0.9, 0.2, 0.6, 0.5, 0.8, 0.3, 0.4]
  },
  {
    id: '4',
    title: 'Forest Whispers',
    artist: 'Nature\'s Voice',
    album: 'Woodland Tales',
    duration: 312,
    url: '/audio/forest-whispers.mp3',
    cover: '/images/covers/forest-whispers.jpg',
    genre: 'Ambient',
    year: 2021,
    favorite: false,
    playCount: 156,
    waveform: [0.2, 0.4, 0.3, 0.6, 0.5, 0.7, 0.4, 0.2, 0.8, 0.3]
  },
  {
    id: '5',
    title: 'Neon Nights',
    artist: 'Cyber Dreams',
    album: 'Digital Horizon',
    duration: 289,
    url: '/audio/neon-nights.mp3',
    cover: '/images/covers/neon-nights.jpg',
    genre: 'Synthwave',
    year: 2023,
    favorite: true,
    playCount: 178,
    waveform: [0.5, 0.8, 0.3, 0.7, 0.4, 0.9, 0.2, 0.6, 0.5, 0.8]
  },
  {
    id: '6',
    title: 'Mountain Echo',
    artist: 'Alpine Sounds',
    album: 'Peak Experience',
    duration: 234,
    url: '/audio/mountain-echo.mp3',
    cover: '/images/covers/mountain-echo.jpg',
    genre: 'Ambient',
    year: 2022,
    favorite: false,
    playCount: 92,
    waveform: [0.4, 0.2, 0.7, 0.5, 0.8, 0.3, 0.6, 0.4, 0.9, 0.2]
  },
  {
    id: '7',
    title: 'Electric Storm',
    artist: 'Thunder Bay',
    album: 'Weather Patterns',
    duration: 356,
    url: '/audio/electric-storm.mp3',
    cover: '/images/covers/electric-storm.jpg',
    genre: 'Electronic',
    year: 2023,
    favorite: true,
    playCount: 245,
    waveform: [0.8, 0.9, 0.7, 0.6, 0.8, 0.5, 0.9, 0.7, 0.8, 0.6]
  },
  {
    id: '8',
    title: 'Desert Wind',
    artist: 'Sahara Collective',
    album: 'Endless Dunes',
    duration: 278,
    url: '/audio/desert-wind.mp3',
    cover: '/images/covers/desert-wind.jpg',
    genre: 'World',
    year: 2021,
    favorite: false,
    playCount: 134,
    waveform: [0.3, 0.5, 0.4, 0.7, 0.2, 0.8, 0.4, 0.6, 0.3, 0.5]
  }
];

// Playlist data
export const SAMPLE_PLAYLISTS = [
  {
    id: 'favorites',
    name: 'Favorites',
    description: 'Your liked tracks',
    tracks: SAMPLE_TRACKS.filter(track => track.favorite),
    cover: '/images/playlists/favorites.jpg',
    isSystem: true
  },
  {
    id: 'recently-played',
    name: 'Recently Played',
    description: 'Your recent listening history',
    tracks: SAMPLE_TRACKS.slice(0, 5),
    cover: '/images/playlists/recent.jpg',
    isSystem: true
  },
  {
    id: 'chill-vibes',
    name: 'Chill Vibes',
    description: 'Relaxing ambient sounds',
    tracks: SAMPLE_TRACKS.filter(track => track.genre === 'Ambient'),
    cover: '/images/playlists/chill.jpg',
    isSystem: false
  },
  {
    id: 'synthwave-collection',
    name: 'Synthwave Collection',
    description: 'Retro futuristic beats',
    tracks: SAMPLE_TRACKS.filter(track => track.genre === 'Synthwave'),
    cover: '/images/playlists/synthwave.jpg',
    isSystem: false
  }
];

// Genre colors for UI
export const GENRE_COLORS = {
  Electronic: '#6366f1',
  Ambient: '#10b981',
  Synthwave: '#f59e0b',
  World: '#ef4444',
  Rock: '#8b5cf6',
  Pop: '#ec4899',
  Jazz: '#f97316',
  Classical: '#3b82f6'
};

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  PLAY_PAUSE: 'Space',
  NEXT_TRACK: 'ArrowRight',
  PREVIOUS_TRACK: 'ArrowLeft',
  VOLUME_UP: 'ArrowUp',
  VOLUME_DOWN: 'ArrowDown',
  MUTE: 'KeyM',
  SHUFFLE: 'KeyS',
  REPEAT: 'KeyR',
  FULLSCREEN: 'KeyF',
  SEARCH: 'KeyK'
};

// Local storage keys
export const STORAGE_KEYS = {
  VOLUME: 'mp3-player-volume',
  REPEAT_MODE: 'mp3-player-repeat',
  SHUFFLE: 'mp3-player-shuffle',
  CURRENT_TRACK: 'mp3-player-current-track',
  PLAYLIST: 'mp3-player-playlist',
  THEME: 'mp3-player-theme',
  VISUALIZER_TYPE: 'mp3-player-visualizer',
  FAVORITES: 'mp3-player-favorites',
  PLAY_COUNT: 'mp3-player-play-count'
};

// Error messages
export const ERROR_MESSAGES = {
  TRACK_NOT_FOUND: 'Track not found',
  AUDIO_LOAD_ERROR: 'Failed to load audio file',
  NETWORK_ERROR: 'Network connection error',
  UNSUPPORTED_FORMAT: 'Unsupported audio format',
  PERMISSION_DENIED: 'Audio permission denied',
  GENERIC_ERROR: 'An unexpected error occurred'
};

// Success messages
export const SUCCESS_MESSAGES = {
  TRACK_ADDED: 'Track added to playlist',
  PLAYLIST_CREATED: 'Playlist created successfully',
  TRACK_LIKED: 'Track added to favorites',
  TRACK_UNLIKED: 'Track removed from favorites',
  SETTINGS_SAVED: 'Settings saved successfully'
};

// API endpoints (for future backend integration)
export const API_ENDPOINTS = {
  TRACKS: '/api/tracks',
  PLAYLISTS: '/api/playlists',
  SEARCH: '/api/search',
  UPLOAD: '/api/upload',
  USER: '/api/user',
  FAVORITES: '/api/favorites'
};

// File upload settings
export const UPLOAD_SETTINGS = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ACCEPTED_FORMATS: ['.mp3', '.wav', '.ogg', '.m4a', '.flac'],
  MAX_FILES: 10
};

// Visualizer settings
export const VISUALIZER_SETTINGS = {
  BARS: {
    count: 64,
    minHeight: 2,
    maxHeight: 100,
    gap: 2,
    smoothing: 0.8
  },
  WAVE: {
    points: 128,
    amplitude: 50,
    frequency: 0.02,
    smoothing: 0.85
  },
  CIRCLE: {
    radius: 80,
    bars: 32,
    rotation: 0.01,
    smoothing: 0.9
  },
  SPECTRUM: {
    resolution: 256,
    smoothing: 0.75,
    sensitivity: 1.5
  }
};