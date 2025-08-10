import React from 'react';
import { motion } from 'framer-motion';
import { Home, Music, Search, Library, Play, Pause, SkipBack, SkipForward, Volume2, Maximize2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';

const Layout = ({ children, currentTrack, isPlaying, onPlayPause, onNext, onPrevious, onToggleFullscreen }) => {
  const navigationItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Search, label: 'Search', href: '/search' },
    { icon: Library, label: 'Library', href: '/library' },
    { icon: Music, label: 'Playlists', href: '/playlists' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="flex flex-col h-screen">
        <main className="flex-1 overflow-hidden pb-32">
          {children}
        </main>

        {currentTrack && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-16 left-0 right-0 z-40"
          >
            <Card className="mx-4 mb-2 bg-black/40 backdrop-blur-lg border-white/10">
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Music className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">
                      {currentTrack.title}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {currentTrack.artist}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onPrevious}
                    className="text-white hover:bg-white/10 p-2"
                  >
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onPlayPause}
                    className="text-white hover:bg-white/10 p-2"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onNext}
                    className="text-white hover:bg-white/10 p-2"
                  >
                    <SkipForward className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggleFullscreen}
                    className="text-white hover:bg-white/10 p-2"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="px-3 pb-3">
                <div className="w-full bg-gray-700 rounded-full h-1">
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '45%' }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        <motion.nav
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50"
        >
          <Card className="rounded-none border-t border-white/10 bg-black/60 backdrop-blur-lg">
            <div className="flex items-center justify-around py-2">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1"
                >
                  <Button
                    variant="ghost"
                    className="w-full flex flex-col items-center space-y-1 py-2 px-1 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-xs font-medium">
                      {item.label}
                    </span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.nav>
      </div>
    </div>
  );
};

export default Layout;