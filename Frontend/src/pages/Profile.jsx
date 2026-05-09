import { useParams, Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '../components/ui/button';
import PostCard from '../components/PostCard';
import { userService } from '../services/userService';
import { useTranslation } from 'react-i18next';
import { PlaySquare, Image as ImageIcon, Heart } from 'lucide-react';

export default function Profile() {
  const { id } = useParams();
  const { user } = useUser();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('posts');
  
  const targetId = id || user?.id;
  const isOwnProfile = user?.id === targetId;

  const { data, isLoading } = useQuery({
    queryKey: ['profile', targetId],
    queryFn: () => userService.getUserProfile(targetId),
    enabled: !!targetId
  });

  const followMutation = useMutation({
    mutationFn: () => userService.followUser(data.user._id, user.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', targetId] });
    }
  });

  if (isLoading || !data) return <div className="p-8">{t('Loading...')}</div>;

  const profileData = data.user;
  const posts = data.posts || [];
  const reels = data.reels || [];

  const tabs = [
    { id: 'posts', label: t('Posts'), icon: ImageIcon, count: posts.length },
    { id: 'reels', label: t('Reels'), icon: PlaySquare, count: reels.length },
  ];

  return (
    <div className="w-full">
      <div className="bg-card rounded-xl border p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img src={profileData.imageUrl} alt="Profile" className="w-24 h-24 rounded-full border-4 border-background shadow-md" />
          <div className="flex-1 text-center md:text-left text-card-foreground">
            <h2 className="text-2xl font-bold">{profileData.username}</h2>
            <p className="text-muted-foreground mt-2">{profileData.bio || t('Building awesome things! 🚀')}</p>
            <div className="flex gap-4 mt-4 justify-center md:justify-start">
              <span><strong>{profileData.followers?.length || 0}</strong> {t('Followers')}</span>
              <span><strong>{profileData.following?.length || 0}</strong> {t('Following')}</span>
            </div>
          </div>
          {!isOwnProfile && (
            <Button 
              variant="default"
              onClick={() => followMutation.mutate()}
              disabled={followMutation.isPending}
            >
              {t('Toggle Follow')}
            </Button>
          )}
          {isOwnProfile && (
            <Link to="/settings">
              <Button variant="outline">{t('Edit Profile')}</Button>
            </Link>
          )}
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
      {activeTab === 'posts' ? (
        <div className="flex flex-col gap-4">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ImageIcon className="w-12 h-12 text-neutral-700 mb-4" />
              <p className="text-neutral-400 font-medium">{t('No posts uploaded yet.')}</p>
            </div>
          ) : (
            posts.map(post => <PostCard key={post._id} post={post} />)
          )}
        </div>
      ) : (
        <div className={reels.length === 0 ? "flex flex-col items-center justify-center py-16 text-center" : "grid grid-cols-2 sm:grid-cols-3 gap-3"}>
          {reels.length === 0 ? (
             <div className="flex flex-col items-center justify-center text-center">
               <PlaySquare className="w-12 h-12 text-neutral-700 mb-4" />
               <p className="text-neutral-400 font-medium">{t('No reels uploaded yet.')}</p>
             </div>
          ) : (
            reels.map(reel => (
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
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  <p className="text-white text-sm font-semibold truncate">{reel.caption || ''}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-white/80 text-xs">
                      <Heart className="w-3.5 h-3.5" /> {reel.likes?.length || 0}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
