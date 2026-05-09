import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Heart, MessageCircle, Share2, Bookmark, Volume2, VolumeX } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const ReelsFeed = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [savedReelIds, setSavedReelIds] = useState([]);
  const { user } = useUser();
  const { t } = useTranslation();
  const { reelId } = useParams();
  const videoRefs = useRef([]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Setup intersection observer to pause videos that aren't focused
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.6
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.play().catch(err => console.log('Autoplay blocked', err));
        } else {
          video.pause();
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach((video) => {
         if (video) observer.unobserve(video);
      });
    };
  }, [reels]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reelsRes, savedRes] = await Promise.all([
          axios.get(`${API_URL}/api/reels`),
          axios.get(`${API_URL}/api/saved/${user.id}`)
        ]);

        const savedIds = (savedRes.data.savedReels || []).map(id => id.toString());
        setSavedReelIds(savedIds);

        let fetchedReels = reelsRes.data.reels.map(r => ({
           ...r, 
           hasLiked: r.likes?.some(l => l?._id === user?.id || l === user?.id) || false,
           likeCount: r.likes?.length || 0
        }));

        if (reelId) {
          const targetIndex = fetchedReels.findIndex(r => r._id === reelId);
          if (targetIndex > -1) {
            const [targetReel] = fetchedReels.splice(targetIndex, 1);
            fetchedReels.unshift(targetReel);
          }
        }

        setReels(fetchedReels);
      } catch (err) {
        console.error('Failed to fetch reels', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  const handleLike = async (reelId, idx) => {
    if (!user) return;
    
    const newReels = [...reels];
    const currentlyLiked = newReels[idx].hasLiked;
    
    newReels[idx].hasLiked = !currentlyLiked;
    newReels[idx].likeCount += currentlyLiked ? -1 : 1;
    setReels(newReels);

    try {
      await axios.post(`${API_URL}/api/reels/${reelId}/like`, { clerkUserId: user.id });
    } catch (err) {
      console.error("Failed to like", err);
      const reverted = [...reels];
      reverted[idx].hasLiked = currentlyLiked;
      reverted[idx].likeCount += currentlyLiked ? 1 : -1;
      setReels(reverted);
    }
  };

  const handleSaveReel = async (reelId) => {
    if (!user) return;
    const wasSaved = savedReelIds.includes(reelId);
    
    // Optimistic update
    if (wasSaved) {
      setSavedReelIds(prev => prev.filter(id => id !== reelId));
    } else {
      setSavedReelIds(prev => [...prev, reelId]);
      showToast(t('Reel saved!'));
    }

    try {
      await axios.post(`${API_URL}/api/reels/${reelId}/save`, { clerkUserId: user.id });
    } catch (err) {
      // Revert
      if (wasSaved) {
        setSavedReelIds(prev => [...prev, reelId]);
      } else {
        setSavedReelIds(prev => prev.filter(id => id !== reelId));
      }
      console.error("Failed to save reel", err);
    }
  };

  const handleShare = async (videoUrl) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'VibeLoop Reel',
          url: videoUrl || window.location.href
        });
        showToast(t("Shared successfully!"));
      } else {
        await navigator.clipboard.writeText(videoUrl || window.location.href);
        showToast(t("Link copied to clipboard!"));
      }
    } catch (err) {
      showToast(t("Link copied to clipboard!"));
    }
  };

  const handleComment = () => {
    showToast(t("Comments panel opening... (coming soon)"));
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    videoRefs.current.forEach(video => {
      if (video) video.muted = !isMuted;
    });
  };

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
         <div className="animate-spin w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full mb-4"></div>
         <p className="text-white">{t('Loading your feed...')}</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] overflow-y-scroll snap-y snap-mandatory bg-black pt-4 no-scrollbar pb-20 relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-24 left-1/2 z-50 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-2xl font-semibold backdrop-blur-md border border-white/20"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {reels.map((reel, idx) => (
        <div key={reel._id} className="relative w-full h-[85vh] snap-start snap-always flex justify-center items-center mb-4">
          {/* Reel Video Player container */}
          <div className="relative w-full max-w-[420px] h-full bg-zinc-900 rounded-3xl overflow-hidden mx-auto shadow-2xl">
            <video 
              ref={el => videoRefs.current[idx] = el}
              src={reel.videoUrl} 
              className="object-cover w-full h-full cursor-pointer"
              loop
              playsInline
              onClick={toggleMute}
              crossOrigin="anonymous"
            />
            
            {/* Audio Toggle Indicator */}
            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2 rounded-full cursor-pointer z-10" onClick={toggleMute}>
              {isMuted ? <VolumeX className="text-white w-5 h-5" /> : <Volume2 className="text-white w-5 h-5" />}
            </div>

            {/* Overlay Info */}
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none">
              <div className="flex items-center space-x-3 mb-3 pointer-events-auto">
                <Link to={`/profile/${reel.creator?.clerkId || ''}`} className="flex items-center space-x-3 group">
                  <div className="relative overflow-hidden w-12 h-12 rounded-full border-2 border-white/20 shadow-lg">
                    <img src={reel.creator?.imageUrl || 'https://via.placeholder.com/40'} alt="creator" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  </div>
                  <div>
                    <span className="text-white font-bold block group-hover:underline decoration-white/50">{reel.creator?.username || 'Creator'}</span>
                  </div>
                </Link>
                <button 
                  onClick={() => window.location.href = `/profile/${reel.creator?.clerkId || ''}`} 
                  className="text-[10px] bg-white text-black px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider mt-0.5 shadow-md hover:bg-neutral-200 transition"
                >
                  {t('Profile')}
                </button>
              </div>
              <p className="text-white/95 text-[15px] max-w-[85%] font-medium leading-snug">{reel.caption}</p>
            </div>

            {/* Right Action Bar */}
            <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-5 z-10">
              <button 
                onClick={() => handleLike(reel._id, idx)}
                className="flex flex-col items-center text-white p-3 rounded-full backdrop-blur-xl bg-black/30 hover:bg-black/50 transition-transform active:scale-90 border border-white/10"
              >
                <Heart size={28} className={reel.hasLiked ? "fill-red-500 text-red-500" : ""} />
                <span className="text-xs font-bold mt-1.5 drop-shadow-md">{reel.likeCount}</span>
              </button>
              
              <button 
                onClick={handleComment}
                className="flex flex-col items-center text-white p-3 rounded-full backdrop-blur-xl bg-black/30 hover:bg-black/50 transition-transform active:scale-90 border border-white/10"
              >
                <MessageCircle size={28} />
                <span className="text-xs font-bold mt-1.5 drop-shadow-md">{reel.commentsCount || 0}</span>
              </button>

              {/* Save / Bookmark */}
              <button 
                onClick={() => handleSaveReel(reel._id)}
                className="flex flex-col items-center text-white p-3 rounded-full backdrop-blur-xl bg-black/30 hover:bg-black/50 transition-transform active:scale-90 border border-white/10"
              >
                <Bookmark size={28} className={savedReelIds.includes(reel._id) ? "fill-amber-400 text-amber-400" : ""} />
              </button>
              
              <button 
                onClick={() => handleShare(reel.videoUrl)}
                className="flex flex-col items-center text-white p-3 rounded-full backdrop-blur-xl bg-black/30 hover:bg-black/50 transition-transform active:scale-90 border border-white/10"
              >
                <Share2 size={28} />
              </button>
            </div>
          </div>
        </div>
      ))}
      
      {reels.length === 0 && !loading && (
         <div className="flex flex-col items-center justify-center h-full text-white space-y-4">
           <Heart size={48} className="text-neutral-700" />
           <p className="text-neutral-400 font-medium">{t('No reels found yet. Upload one!')}</p>
         </div>
      )}
    </div>
  );
};

export default ReelsFeed;
