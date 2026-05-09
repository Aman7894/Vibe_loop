import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, User, Settings, Bell, PlaySquare, MessageCircle, PlusCircle, Bookmark } from 'lucide-react';
import { cn } from '../lib/utils';
import { useUser } from '@clerk/clerk-react';
import { useState } from 'react';
import UploadReelModal from './UploadReelModal';
import { useTranslation } from 'react-i18next';

export default function Sidebar() {
  const location = useLocation();
  const { user } = useUser();
  const { t } = useTranslation();
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);

  const routes = [
    { name: t('Home'), path: '/home', icon: Home },
    { name: t('Explore'), path: '/explore', icon: Compass },
    { name: t('Reels'), path: '/reels', icon: PlaySquare },
    { name: t('Messages'), path: '/messages', icon: MessageCircle },
    { name: t('Notifications'), path: '/notifications', icon: Bell },
    { name: t('Saved'), path: '/saved', icon: Bookmark },
    { name: t('Profile'), path: `/profile/${user?.id || ''}`, icon: User },
    { name: t('Settings'), path: '/settings', icon: Settings },
  ];

  return (
    <>
      <aside className="hidden md:flex w-full flex-col gap-2">
        <div className="rounded-2xl border border-white/10 bg-white/50 dark:bg-black/30 backdrop-blur-xl p-4 shadow-xl z-10 relative">
          <nav className="flex flex-col gap-2">
            {routes.map((route) => {
              const isActive = location.pathname.startsWith(route.path);
              const Icon = route.icon;
              
              return (
                <Link
                  key={route.path}
                  to={route.path}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium transition-all hover:bg-black/5 dark:hover:bg-white/5",
                    isActive ? "bg-gradient-to-r from-indigo-500/10 to-transparent dark:from-indigo-500/20 dark:text-white font-bold border-l-4 border-indigo-500" : "text-neutral-600 dark:text-neutral-400"
                  )}
                >
                  <Icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive ? "text-indigo-500 dark:text-indigo-400" : "")} />
                  {route.name}
                </Link>
              )
            })}
          </nav>

          <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <button 
              onClick={() => setUploadModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 px-4 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold transition shadow-lg shadow-indigo-500/20"
            >
              <PlusCircle className="w-5 h-5" />
              {t('Upload Reel')}
            </button>
          </div>
        </div>
      </aside>

      <UploadReelModal isOpen={isUploadModalOpen} onClose={() => setUploadModalOpen(false)} />
    </>
  );
}
