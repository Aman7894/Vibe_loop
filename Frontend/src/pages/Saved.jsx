import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Bookmark, PlaySquare, Image as ImageIcon, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../components/PostCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Saved() {
  const { user } = useUser();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('posts');
  const [savedPosts, setSavedPosts] = useState([]);
  const [savedReels, setSavedReels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchSaved = async () => {
      setLoading(true);
      try {
        const [postsRes, reelsRes] = await Promise.all([
          axios.get(`${API_URL}/api/saved/posts/${user.id}`),
          axios.get(`${API_URL}/api/saved/reels/${user.id}`)
        ]);
        setSavedPosts(postsRes.data.posts || []);
        setSavedReels(reelsRes.data.reels || []);
      } catch (err) {
        console.error("Error fetching saved items", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, [user]);

  const tabs = [
    { id: 'posts', label: t('Posts'), icon: ImageIcon, count: savedPosts.length },
    { id: 'reels', label: t('Reels'), icon: PlaySquare, count: savedReels.length },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-card rounded-xl border p-6 mb-6 text-card-foreground">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-amber-500/10">
            <Bookmark className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{t('Saved')}</h2>
            <p className="text-sm text-muted-foreground">{t('Your bookmarked posts and reels')}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white/5 rounded-xl p-1 border border-white/[0.06]">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-indigo-500/15 text-indigo-400 shadow-sm' 
                  : 'text-neutral-400 hover:text-neutral-300 hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/10 text-neutral-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full mb-4"></div>
          <p className="text-muted-foreground">{t('Loading...')}</p>
        </div>
      ) : activeTab === 'posts' ? (
        savedPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bookmark className="w-12 h-12 text-neutral-700 mb-4" />
            <p className="text-neutral-400 font-medium">{t('No saved posts yet.')}</p>
            <p className="text-sm text-neutral-500 mt-1">{t('Tap the bookmark icon on any post to save it here.')}</p>
          </div>
        ) : (
          <div className="rounded-xl border border-white/[0.06] overflow-hidden">
            {savedPosts.map(post => (
              <PostCard key={post._id} post={post} initialSaved={true} />
            ))}
          </div>
        )
      ) : (
        savedReels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <PlaySquare className="w-12 h-12 text-neutral-700 mb-4" />
            <p className="text-neutral-400 font-medium">{t('No saved reels yet.')}</p>
            <p className="text-sm text-neutral-500 mt-1">{t('Tap the bookmark icon on any reel to save it here.')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {savedReels.map(reel => (
              <Link 
                key={reel._id} 
                to={`/reels/${reel._id}`}
                className="relative aspect-[9/16] rounded-2xl overflow-hidden group border border-white/[0.06] bg-neutral-900"
              >
                <video 
                  src={reel.videoUrl} 
                  className="w-full h-full object-cover"
                  muted 
                  preload="metadata"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  <p className="text-white text-sm font-semibold truncate">{reel.caption || ''}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-white/80 text-xs">
                      <Heart className="w-3.5 h-3.5" /> {reel.likes?.length || 0}
                    </span>
                    <span className="text-white/60 text-xs">@{reel.creator?.username}</span>
                  </div>
                </div>
                {/* Bookmark badge */}
                <div className="absolute top-2 right-2">
                  <Bookmark className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  );
}
