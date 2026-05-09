import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '../services/postService';
import CommentSection from './CommentSection';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function PostCard({ post, initialSaved = false }) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const hasLiked = post.likes?.some(p => p.username === user?.username) || false;
  
  const [isLiked, setIsLiked] = useState(hasLiked);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [isSaved, setIsSaved] = useState(initialSaved);

  const likeMutation = useMutation({
    mutationFn: () => postService.likePost(post._id, user.id),
    onSuccess: () => {},
  });

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    likeMutation.mutate();
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaved(!isSaved);
    try {
      await axios.post(`${API_URL}/api/posts/${post._id}/save`, { clerkUserId: user.id });
    } catch (err) {
      setIsSaved(isSaved); // revert on error
      console.error("Failed to save post", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post by ${post.author?.username || 'User'}`,
          text: post.description || 'Check out this post!',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      alert(t("Sharing is not supported on this browser."));
    }
  };

  const getRelativeTime = (dateStr) => {
    if (!dateStr) return t('Just now');
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    
    if (diffSec < 60) return t('Just now');
    if (diffMin < 60) return `${diffMin}m`;
    if (diffHr < 24) return `${diffHr}h`;
    if (diffDay < 30) return `${diffDay}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors duration-150 cursor-pointer">
      <div className="px-4 pt-3 pb-1 flex gap-3">
        {/* Avatar */}
        <Link to={`/profile/${post.author?.clerkId || ''}`} className="shrink-0 group">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-neutral-800 ring-1 ring-white/10 transition-all duration-200 group-hover:ring-indigo-500/40 group-hover:scale-105">
            <img 
              src={post.author?.profileImageUrl || post.author?.imageUrl || 'https://via.placeholder.com/150'} 
              alt={post.author?.username} 
              className="h-full w-full object-cover"
              crossOrigin="anonymous"
            />
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <Link to={`/profile/${post.author?.clerkId || ''}`} className="flex items-center gap-1.5 min-w-0">
                <span className="text-[15px] font-bold text-white truncate hover:underline underline-offset-2">
                  {post.author?.username || t('Unknown User')}
                </span>
                <svg className="w-[18px] h-[18px] text-indigo-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.66 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.07 4.73l-3.67-3.67 1.41-1.41 2.26 2.26 5.27-5.27 1.41 1.41-6.68 6.68z"/>
                </svg>
              </Link>
              <span className="text-[14px] text-neutral-500 shrink-0">·</span>
              <span className="text-[14px] text-neutral-500 shrink-0">{getRelativeTime(post.createdAt)}</span>
            </div>
            <button className="p-1.5 -mr-1.5 rounded-full hover:bg-indigo-500/10 text-neutral-500 hover:text-indigo-400 transition-colors">
              <MoreHorizontal className="h-[18px] w-[18px]" />
            </button>
          </div>

          {/* Post Text */}
          {post.description && (
            <p className="text-[15px] leading-[1.45] text-neutral-100 mt-0.5 whitespace-pre-wrap break-words">
              {post.description}
            </p>
          )}

          {/* Image with rounded corners */}
          {post.image && (
            <div className="mt-3 rounded-2xl overflow-hidden border border-white/[0.08] max-h-[510px]">
              <img 
                src={post.image} 
                alt="Post content" 
                className="w-full h-full object-cover"
                loading="lazy"
                crossOrigin="anonymous"
              />
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between mt-2 -ml-2 max-w-[425px]">
            {/* Comment */}
            <button 
              onClick={(e) => { e.stopPropagation(); setShowComments(!showComments); }}
              className="flex items-center gap-1.5 group"
            >
              <div className="p-2 rounded-full group-hover:bg-indigo-500/10 transition-colors">
                <MessageCircle className="h-[18px] w-[18px] text-neutral-500 group-hover:text-indigo-400 transition-colors" />
              </div>
              <span className="text-[13px] text-neutral-500 group-hover:text-indigo-400 transition-colors">
                {post.comments?.length || 0}
              </span>
            </button>

            {/* Like */}
            <button 
              onClick={(e) => { e.stopPropagation(); handleLike(); }}
              className="flex items-center gap-1.5 group"
            >
              <div className="p-2 rounded-full group-hover:bg-pink-500/10 transition-colors">
                <Heart className={`h-[18px] w-[18px] transition-colors ${isLiked ? 'fill-pink-500 text-pink-500' : 'text-neutral-500 group-hover:text-pink-400'}`} />
              </div>
              <span className={`text-[13px] transition-colors ${isLiked ? 'text-pink-500' : 'text-neutral-500 group-hover:text-pink-400'}`}>
                {likesCount}
              </span>
            </button>

            {/* Bookmark / Save */}
            <button 
              onClick={(e) => { e.stopPropagation(); handleSave(); }}
              className="flex items-center gap-1.5 group"
            >
              <div className="p-2 rounded-full group-hover:bg-amber-500/10 transition-colors">
                <Bookmark className={`h-[18px] w-[18px] transition-colors ${isSaved ? 'fill-amber-400 text-amber-400' : 'text-neutral-500 group-hover:text-amber-400'}`} />
              </div>
            </button>

            {/* Share */}
            <button 
              onClick={(e) => { e.stopPropagation(); handleShare(); }}
              className="flex items-center gap-1.5 group"
            >
              <div className="p-2 rounded-full group-hover:bg-indigo-500/10 transition-colors">
                <Share2 className="h-[18px] w-[18px] text-neutral-500 group-hover:text-indigo-400 transition-colors" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="ml-[52px] mr-4 mb-3">
          <CommentSection comments={post.comments || []} postId={post._id} />
        </div>
      )}
    </div>
  );
}
