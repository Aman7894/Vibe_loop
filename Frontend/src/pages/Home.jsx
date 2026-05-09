import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-react';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import PostSkeleton from '../components/PostSkeleton';
import { postService } from '../services/postService';
import { userService } from '../services/userService';
import { useTranslation } from 'react-i18next';

export default function Home({ feedType = 'all' }) {
  const { user } = useUser();
  const { t } = useTranslation();

  // Temporary sync mechanism since Clerk webhooks require a tunneling service in local dev
  useEffect(() => {
    if (user) {
      userService.syncUser({
        clerkId: user.id,
        username: user.username || user.firstName || 'User',
        imageUrl: user.imageUrl
      }).catch(console.error);
    }
  }, [user]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['posts', feedType, user?.id],
    queryFn: () => postService.getPosts(feedType, user?.id),
    enabled: !!user?.id || feedType === 'all'
  });

  const posts = data?.posts || [];

  return (
    <div className="w-full">
      <CreatePost />
      
      <div className="mt-6 flex flex-col gap-4">
        {isLoading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : error ? (
          <p className="text-red-500">{t('Error loading posts: ')}{error.message}</p>
        ) : posts.length === 0 ? (
          <p className="text-muted-foreground text-center p-8 bg-card rounded-xl border">{t('No posts yet. Be the first to create one!')}</p>
        ) : (
          posts.map(post => <PostCard key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
}
