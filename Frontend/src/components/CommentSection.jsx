import { useState } from 'react';
import { Button } from './ui/button';
import { useUser } from '@clerk/clerk-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '../services/postService';
import { useTranslation } from 'react-i18next';

export default function CommentSection({ comments = [], postId }) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [newComment, setNewComment] = useState('');

  const commentMutation = useMutation({
    mutationFn: (text) => postService.addComment(postId, text, user.id),
    onSuccess: () => {
      setNewComment('');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    commentMutation.mutate(newComment);
  };

  return (
    <div className="p-4 border-t border-border/50 bg-card/40">
      <div className="flex space-x-3 mb-4">
        <div className="h-8 w-8 rounded-full overflow-hidden bg-muted shrink-0">
          {user?.imageUrl && <img src={user.imageUrl} alt="You" className="h-full w-full object-cover" />}
        </div>
        <div className="flex-1 flex items-center space-x-2">
          <input 
            type="text" 
            placeholder={t("Add a comment...")} 
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-fb-blue font-semibold"
            disabled={!newComment.trim() || commentMutation.isPending}
            onClick={handleSubmit}
          >
            {t('Post')}
          </Button>
        </div>
      </div>

      <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar pt-2">
        {comments.map((comment, index) => (
          <div key={index} className="flex space-x-3">
            <div className="h-8 w-8 rounded-full overflow-hidden bg-muted shrink-0">
              <img src={comment.author?.profileImageUrl || 'https://via.placeholder.com/150'} alt="User" className="h-full w-full object-cover" />
            </div>
            <div className="flex-1 bg-muted/30 p-3 rounded-2xl rounded-tl-none">
              <p className="text-sm font-semibold text-foreground">{comment.author?.username || t('Unknown User')}</p>
              <p className="text-sm text-foreground/90 mt-1">{comment.text}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-xs text-center text-muted-foreground py-2">{t('No comments yet. Be the first!')}</p>
        )}
      </div>
    </div>
  );
}
