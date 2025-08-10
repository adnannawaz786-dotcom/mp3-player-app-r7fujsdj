import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Volume2, Shuffle, Repeat, Music, Search, Heart, MoreHorizontal } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const sampleTracks = [
  {
    id: 1,
    title: "Midnight Dreams",
    artist: "Luna Echo",
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
    album: "Natural Elements",
    duration: "3:28",
    url: "/audio/sample3.mp3",
    cover: "/images/cover3.jpg"
  },
  {
    id: 4,
    title: "Urban Rhythm",
    artist: "City Beats",
    album: "Street Symphony",
    duration: "3:56",
    url: "/audio/sample4.mp3",
    cover: "/images/cover4.jpg"
  },
  {
    id: 5,
    title: "Starlight Serenade",
    artist: "Cosmic Harmony",
    album: "Celestial Sounds",
    duration: "4:33",
    url: "/audio/sample5.mp3",
    cover: "/images/cover5.jpg"
  }
];

export default function Home() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedTracks, setLikedTracks] = useState(new Set());
  const [audioElement, setAudioElement] = useState(null);
  const [visualizerData, setVisualizerData] = useState([]);
  const [showFullPlayer, setShowFullPlayer] = useState(false);

  useEffect(() => {
    const audio = new Audio();
    setAudioElement(audio);

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    audio.addEventListener('ended', handleTrackEnd);

    return () => {
      audio.removeEventListener('timeupdate', () => {});
      audio.removeEventListener('loadedmetadata', () => {});
      audio.removeEventListener('ended', handleTrackEnd);
    };
  }, []);

  useEffect(() => {
    if (audioElement && currentTrack) {
      audioElement.src = currentTrack.url;
      audioElement.volume = volume;
    }
  }, [currentTrack, audioElement, volume]);

  useEffect(() => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.play();
        generateVisualizerData();
      } else {
        audioElement.pause();
      }
    }
  }, [isPlaying, audioElement]);

  const generateVisualizerData = () => {
    const interval = setInterval(() => {
      if (isPlaying) {
        const data = Array.from({ length: 32 }, () => Math.random() * 100);
        setVisualizerData(data);
      }
    }, 100);

    return () => clearInterval(interval);
  };

  const handleTrackEnd = () => {
    if (repeatMode === 'one') {
      audioElement.currentTime = 0;
      audioElement.play();
    } else if (repeatMode === 'all' || repeatMode === 'off') {
      playNext();
    }
  };

  const playTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (!currentTrack) return;
    const currentIndex = sampleTracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = isShuffled 
      ? Math.floor(Math.random() * sampleTracks.length)
      : (currentIndex + 1) % sampleTracks.length;
    setCurrentTrack(sampleTracks[nextIndex]);
  };

  const playPrevious = () => {
    if (!currentTrack) return;
    const currentIndex = sampleTracks.findIndex(track => track.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? sampleTracks.length - 1 : currentIndex - 1;
    setCurrentTrack(sampleTracks[prevIndex]);
  };

  const toggleLike = (trackId) => {
    const newLikedTracks = new Set(likedTracks);
    if (newLikedTracks.has(trackId)) {
      newLikedTracks.delete(trackId);
    } else {
      newLikedTracks.add(trackId);
    }
    setLikedTracks(newLikedTracks);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const filteredTracks = sampleTracks.filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.album.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8 pb-32">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Music Player
          </h1>
          <p className="text-gray-300">Discover and enjoy your favorite tracks</p>
        </motion.div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tracks, artists, or albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
            />
          </div>
        </div>

        <div className="grid gap-4 mb-8">
          <AnimatePresence>
            {filteredTracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Music className="w-6 h-6 text-white" />
                          </div>
                          {currentTrack?.id === track.id && isPlaying && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{track.title}</h3>
                          <p className="text-gray-300 text-sm">{track.artist}</p>
                          <p className="text-gray-400 text-xs">{track.album}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-white/20 text-white">
                          {track.duration}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleLike(track.id)}
                          className="text-gray-400 hover:text-pink-400"
                        >
                          <Heart className={`w-4 h-4 ${likedTracks.has(track.id) ? 'fill-pink-400 text-pink-400' : ''}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => playTrack(track)}
                          className="text-white hover:text-purple-400"
                        >
                          {currentTrack?.id === track.id && isPlaying ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {currentTrack && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-center">Audio Visualizer</h2>
                <div className="flex items-end justify-center space-x-1 h-32 mb-4">
                  {visualizerData.map((height, index) => (
                    <motion.div
                      key={index}
                      className="bg-gradient-to-t from-purple-500 to-pink-500 w-2 rounded-t"
                      style={{ height: `${height}%` }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {currentTrack && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/20 p-4"
        >
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">{currentTrack.title}</h4>
                  <p className="text-gray-300 text-xs">{currentTrack.artist}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsShuffled(!isShuffled)}
                  className={`${isShuffled ? 'text-purple-400' : 'text-gray-400'} hover:text-white`}
                >
                  <Shuffle className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={playPrevious} className="text-white">
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlayPause}
                  className="bg-purple-600 hover:bg-purple-700 text-white w-10 h-10 rounded-full"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={playNext} className="text-white">
                  <SkipForward className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRepeatMode(repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off')}
                  className={`${repeatMode !== 'off' ? 'text-purple-400' : 'text-gray-400'} hover:text-white`}
                >
                  <Repeat className="w-4 h-4" />
                </Button>
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-gray-400" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}