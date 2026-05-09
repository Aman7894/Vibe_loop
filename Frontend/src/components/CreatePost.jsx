import { useState, useRef } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import { Button } from './ui/button';
import { useUser } from '@clerk/clerk-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '../services/postService';
import { useTranslation } from 'react-i18next';

export default function CreatePost() {
  const { user } = useUser();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const mutation = useMutation({
    mutationFn: postService.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setDescription('');
      removeImage();
    },
  });

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() && !image) return;
    
    const formData = new FormData();
    formData.append('clerkId', user.id);
    if (description) formData.append('description', description);
    if (image) formData.append('image', image);

    mutation.mutate(formData);
  };

  return (
    <div className="mb-6 rounded-xl border bg-card/80 backdrop-blur-sm text-card-foreground shadow-sm shadow-black/5 p-4">
      <div className="flex space-x-4">
        <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-muted">
          {user?.imageUrl ? (
            <img src={user.imageUrl} alt="Avatar" className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div className="flex-1 space-y-4">
          <textarea
            className="w-full bg-transparent resize-none outline-none placeholder:text-muted-foreground min-h-[60px] text-lg"
            placeholder={t("What's happening?")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {previewUrl && (
            <div className="relative rounded-xl overflow-hidden border bg-muted">
              <img src={previewUrl} alt="Preview" className="w-full max-h-[300px] object-cover" />
              <button 
                onClick={removeImage}
                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white backdrop-blur-md transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-fb-blue hover:bg-fb-blue/10 transition-colors rounded-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-5 w-5" />
              </Button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageSelect} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            <Button 
              className="rounded-full px-6 bg-gradient-to-r from-insta-pink via-insta-purple to-insta-orange text-white border-0 shadow-md hover:shadow-lg transition-transform hover:scale-105" 
              onClick={handleSubmit}
              disabled={mutation.isPending || (!description.trim() && !image)}
            >
              {mutation.isPending ? t('Posting...') : t('Post')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
