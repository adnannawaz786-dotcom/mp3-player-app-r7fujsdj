import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  Music, 
  Play, 
  Pause, 
  Heart, 
  MoreHorizontal, 
  Search, 
  Filter,
  Grid,
  List,
  Clock,
  Calendar,
  User,
  Album,
  Shuffle,
  Repeat
} from 'lucide-react';

export default function Library() {
  const [tracks, setTracks] = useState([]);
  const [filteredTracks, setFilteredTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [favorites, setFavorites] = useState(new Set());

  const sampleTracks = [
    {
      id: 1,
      title: 'Midnight Dreams',
      artist: 'Luna Echo',
      album: 'Nocturnal Vibes',
      duration: '3:45',
      genre: 'Electronic',
      year: 2023,
      cover: '/api/placeholder/300/300',
      url: '/audio/sample1.mp3'
    },
    {
      id: 2,
      title: 'Ocean Waves',
      artist: 'Coastal Sounds',
      album: 'Nature\'s Symphony',
      duration: '4:12',
      genre: 'Ambient',
      year: 2022,
      cover: '/api/placeholder/300/300',
      url: '/audio/sample2.mp3'
    },
    {
      id: 3,
      title: 'City Lights',
      artist: 'Urban Pulse',
      album: 'Metropolitan',
      duration: '3:28',
      genre: 'Pop',
      year: 2023,
      cover: '/api/placeholder/300/300',
      url: '/audio/sample3.mp3'
    },
    {
      id: 4,
      title: 'Mountain High',
      artist: 'Peak Performers',
      album: 'Summit Sessions',
      duration: '5:03',
      genre: 'Rock',
      year: 2021,
      cover: '/api/placeholder/300/300',
      url: '/audio/sample4.mp3'
    },
    {
      id: 5,
      title: 'Jazz Cafe',
      artist: 'Smooth Operators',
      album: 'Late Night Lounge',
      duration: '4:35',
      genre: 'Jazz',
      year: 2022,
      cover: '/api/placeholder/300/300',
      url: '/audio/sample5.mp3'
    },
    {
      id: 6,
      title: 'Digital Horizon',
      artist: 'Cyber Collective',
      album: 'Future Sounds',
      duration: '3:52',
      genre: 'Electronic',
      year: 2023,
      cover: '/api/placeholder/300/300',
      url: '/audio/sample6.mp3'
    }
  ];

  const genres = ['all', 'Electronic', 'Ambient', 'Pop', 'Rock', 'Jazz'];

  useEffect(() => {
    setTracks(sampleTracks);
    setFilteredTracks(sampleTracks);
  }, []);

  useEffect(() => {
    let filtered = tracks.filter(track => {
      const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           track.album.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = selectedGenre === 'all' || track.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'artist':
          return a.artist.localeCompare(b.artist);
        case 'album':
          return a.album.localeCompare(b.album);
        case 'year':
          return b.year - a.year;
        case 'duration':
          return a.duration.localeCompare(b.duration);
        default:
          return 0;
      }
    });

    setFilteredTracks(filtered);
  }, [tracks, searchQuery, selectedGenre, sortBy]);

  const handlePlayTrack = (track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const toggleFavorite = (trackId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(trackId)) {
      newFavorites.delete(trackId);
    } else {
      newFavorites.add(trackId);
    }
    setFavorites(newFavorites);
  };

  const formatDuration = (duration) => {
    return duration;
  };

  const TrackCard = ({ track }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Card className="overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 hover:border-purple-500/50 transition-all duration-300">
        <div className="relative aspect-square">
          <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
            <Music className="w-16 h-16 text-slate-400" />
          </div>
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              size="lg"
              onClick={() => handlePlayTrack(track)}
              className="rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
            >
              {currentTrack?.id === track.id && isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </Button>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => toggleFavorite(track.id)}
            className={`absolute top-2 right-2 rounded-full ${
              favorites.has(track.id) ? 'text-red-500' : 'text-slate-400'
            } hover:text-red-500`}
          >
            <Heart className={`w-4 h-4 ${favorites.has(track.id) ? 'fill-current' : ''}`} />
          </Button>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-white truncate">{track.title}</h3>
          <p className="text-sm text-slate-400 truncate">{track.artist}</p>
          <p className="text-xs text-slate-500 truncate">{track.album}</p>
          <div className="flex items-center justify-between mt-2">
            <Badge variant="secondary" className="text-xs">
              {track.genre}
            </Badge>
            <span className="text-xs text-slate-500">{track.duration}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const TrackRow = ({ track }) => (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="group"
    >
      <Card className="bg-slate-900/30 border-slate-700/30 hover:bg-slate-800/50 transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Button
              size="sm"
              onClick={() => handlePlayTrack(track)}
              className="rounded-full bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white"
            >
              {currentTrack?.id === track.id && isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </Button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white truncate">{track.title}</h3>
                  <p className="text-sm text-slate-400 truncate">{track.artist}</p>
                </div>
                <div className="hidden md:block flex-1 min-w-0">
                  <p className="text-sm text-slate-400 truncate">{track.album}</p>
                </div>
                <div className="hidden sm:block">
                  <Badge variant="secondary" className="text-xs">
                    {track.genre}
                  </Badge>
                </div>
                <div className="text-sm text-slate-500 w-12 text-right">
                  {track.duration}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleFavorite(track.id)}
                  className={`${
                    favorites.has(track.id) ? 'text-red-500' : 'text-slate-400'
                  } hover:text-red-500`}
                >
                  <Heart className={`w-4 h-4 ${favorites.has(track.id) ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Music Library
          </h1>
          <p className="text-slate-400">Discover and play your favorite tracks</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search tracks, artists, or albums..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    {genres.map(genre => (
                      <option key={genre} value={genre}>
                        {genre === 'all' ? 'All Genres' : genre}
                      </option>
                    ))}
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="artist">Sort by Artist</option>
                    <option value="album">Sort by Album</option>
                    <option value="year">Sort by Year</option>
                    <option value="duration">Sort by Duration</option>
                  </select>
                  <div className="flex border border-slate-600 rounded-lg overflow-hidden">
                    <Button
                      size="sm"
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      onClick={() => setViewMode('grid')}
                      className="rounded-none"
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      onClick={() => setViewMode('list')}
                      className="rounded-none"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-400">
              {filteredTracks.length} track{filteredTracks.length !== 1 ? 's' : ''} found
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="