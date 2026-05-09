import { Link, useLocation } from 'react-router-dom';
import { UserButton, SignedIn, useUser } from '@clerk/clerk-react';
import { Bell, Home, Plus, Sparkles, Menu, X, Compass, PlaySquare, MessageCircle, User, Settings, PlusCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import UploadReelModal from './UploadReelModal';
import { useSocket } from '../contexts/SocketContext';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Logo from './ui/Logo';

export default function Navbar() {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const { user } = useUser();
  const socket = useSocket();

  useEffect(() => {
    if (user) {
      axios.get(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/api/notifications/${user.id}`)
        .then(res => {
          const unread = res.data.notifications.filter(n => !n.isRead).length;
          setUnreadCount(unread);
        })
        .catch(console.error);
    }
  }, [user]);

  useEffect(() => {
    if (socket) {
      const handler = (notif) => {
        setUnreadCount(prev => prev + 1);
      };
      socket.on('receive_notification', handler);
      return () => socket.off('receive_notification', handler);
    }
  }, [socket]);

  const routes = [
    { name: t('Home'), path: '/home', icon: Home },
    { name: t('Explore'), path: '/explore', icon: Compass },
    { name: t('Reels'), path: '/reels', icon: PlaySquare },
    { name: t('Messages'), path: '/messages', icon: MessageCircle },
    { name: t('Notifications'), path: '/notifications', icon: Bell },
    { name: t('Profile'), path: `/profile/${user?.id || ''}`, icon: User },
    { name: t('Settings'), path: '/settings', icon: Settings },
  ];

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav className="fixed top-0 w-full z-[60] pt-4 px-4 pointer-events-none">
        <div className="mx-auto max-w-screen-2xl">
          <div className="flex h-[72px] items-center justify-between rounded-3xl border border-white/10 bg-black/40 backdrop-blur-3xl px-6 shadow-2xl pointer-events-auto">
            <div className="flex items-center gap-4">
              {/* Hamburger Toggle (Mobile/Tablet only) */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 transition"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <Link to="/home" className="flex items-center group transition-transform hover:scale-105 active:scale-95">
                <Logo size="md" />
              </Link>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <SignedIn>
                <Link to="/home" className="hidden sm:block">
                  <button className="p-2.5 rounded-full hover:bg-white/10 transition-colors">
                    <Home className="h-5 w-5 text-neutral-300" />
                  </button>
                </Link>
                
                <button 
                  onClick={() => setUploadModalOpen(true)}
                  className="hidden sm:flex items-center justify-center p-2.5 rounded-full bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all hover:scale-105"
                >
                  <Plus className="h-5 w-5" />
                </button>

                <Link to="/notifications" className="hidden sm:block">
                  <button className="relative p-2.5 rounded-full hover:bg-white/10 transition-colors">
                    <Bell className="h-5 w-5 text-neutral-300" />
                    {unreadCount > 0 && (
                      <span className="absolute top-2 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white outline outline-2 outline-[#1a1a1a]">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                </Link>
                
                <div className="pl-2 border-l border-neutral-800 ml-2">
                  <div className="hover:scale-105 transition-transform rounded-full ring-2 ring-transparent hover:ring-indigo-500/50 pointer-events-auto">
                    <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "w-9 h-9" } }} />
                  </div>
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden pt-24"
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-[280px] bg-black/80 backdrop-blur-3xl border-r border-white/10 p-6 pt-12 lg:hidden overflow-y-auto flex flex-col gap-8"
            >
              <div className="mb-2">
                <Logo size="lg" />
              </div>
              <nav className="flex flex-col gap-2">
                {routes.map((route) => {
                  const isActive = location.pathname.startsWith(route.path);
                  const Icon = route.icon;
                  
                  return (
                    <Link
                      key={route.path}
                      to={route.path}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-[16px] font-medium transition-all hover:bg-white/5",
                        isActive ? "bg-gradient-to-r from-indigo-500/20 to-transparent text-white font-bold border-l-4 border-indigo-500" : "text-neutral-300"
                      )}
                    >
                      <Icon className={cn("h-6 w-6", isActive ? "text-indigo-400" : "")} />
                      {route.name}
                    </Link>
                  )
                })}
              </nav>

              <div className="mt-auto pt-6 border-t border-neutral-800">
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setUploadModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 px-4 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold transition shadow-lg shadow-indigo-500/20"
                >
                  <PlusCircle className="w-5 h-5" />
                  {t('Upload Reel')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <UploadReelModal isOpen={isUploadModalOpen} onClose={() => setUploadModalOpen(false)} />
    </>
  );
}
