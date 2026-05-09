import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { useUser } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function SuggestedUsers() {
  const { user: currentUser } = useUser();
  const { t } = useTranslation();
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // We need to keep track of follow state locally for optimistic UI
  const [followingMap, setFollowingMap] = useState({});

  useEffect(() => {
    if (!currentUser) return;
    
    Promise.all([
      api.get('/api/users'),
      api.get(`/api/users/${currentUser.id}`)
    ])
    .then(([allUsersRes, currentProfileRes]) => {
        const followingArray = currentProfileRes.data.user.following || [];
        const currentUserData = allUsersRes.data.users.find(u => u.clerkId === currentUser.id);
        
        // Build initial following map
        const initialFollowingMap = {};
        followingArray.forEach(id => {
            initialFollowingMap[id.toString()] = true;
        });
        setFollowingMap(initialFollowingMap);

        // Filter out others (anyone not the current user)
        let others = allUsersRes.data.users.filter(u => u.clerkId !== currentUser.id);
        
        // Shuffle and pick 4 other recommendations
        others = others.sort(() => 0.5 - Math.random()).slice(0, 4);
        
        // If we found the current user in the API, prepend them to the list
        const finalSelection = currentUserData ? [currentUserData, ...others] : others;
        
        setSuggestedUsers(finalSelection);
    })
    .catch(err => {
        console.error("Error fetching users for suggestions", err);
    })
    .finally(() => {
        setLoading(false);
    });
  }, [currentUser]);

  const handleFollowToggle = async (targetUserId) => {
    if (!currentUser) return;

    const isCurrentlyFollowing = followingMap[targetUserId] || false;
    
    // Optimistic UI update
    setFollowingMap(prev => ({
        ...prev,
        [targetUserId]: !isCurrentlyFollowing
    }));

    try {
        await api.post(`/api/users/${targetUserId}/follow`, { 
            clerkUserId: currentUser.id 
        });
    } catch (err) {
        // Revert on error
        setFollowingMap(prev => ({
            ...prev,
            [targetUserId]: isCurrentlyFollowing
        }));
        console.error("Follow error", err);
    }
  };

  if (loading) {
    return (
        <div className="space-y-4">
            <div className="animate-pulse flex gap-3 h-10 w-full mb-3 bg-neutral-800/10 rounded-xl" />
            <div className="animate-pulse flex gap-3 h-10 w-full bg-neutral-800/10 rounded-xl" />
        </div>
    );
  }

  if (suggestedUsers.length === 0) {
      return <p className="text-sm text-neutral-500">{t('No suggestions available')}</p>;
  }

  return (
    <div className="space-y-4">
      {suggestedUsers.map((u) => {
          const isFollowing = followingMap[u._id];
          const isSelf = u.clerkId === currentUser.id;
          
          return (
            <div key={u._id} className="flex items-center gap-3 p-2 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition group">
                <Link to={`/profile/${u.clerkId}`} className="shrink-0 relative overflow-hidden w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 ring-2 ring-transparent group-hover:ring-indigo-500/30 transition-all">
                    {u.imageUrl ? (
                        <img src={u.imageUrl} alt={u.username} className="w-full h-full object-cover" crossOrigin="anonymous" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-indigo-600 dark:text-indigo-400 font-bold uppercase">{u.username[0]}</div>
                    )}
                </Link>
                <Link to={`/profile/${u.clerkId}`} className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="font-semibold text-sm truncate hover:underline underline-offset-2">{u.username}</p>
                      {isSelf && <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-tighter">You</span>}
                    </div>
                    <p className="text-[11px] text-neutral-500 truncate">{isSelf ? t('Your profile') : t('Suggested for you')}</p>
                </Link>
                {isSelf ? (
                  <Link 
                    to={`/profile/${u.clerkId}`}
                    className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/5 text-neutral-400 hover:bg-white/10 transition-colors"
                  >
                    {t('View')}
                  </Link>
                ) : (
                  <button 
                    onClick={() => handleFollowToggle(u._id)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                        isFollowing 
                          ? 'bg-neutral-800/5 dark:bg-white/10 text-neutral-600 dark:text-white hover:text-red-500' 
                          : 'bg-indigo-500 text-white shadow-md hover:bg-indigo-600'
                    }`}
                  >
                    {isFollowing ? t('Following') : t('Follow')}
                  </button>
                )}
            </div>
          );
      })}
    </div>
  );
}
