import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { X, Upload, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';

export default function UploadReelModal({ isOpen, onClose }) {
  const { user } = useUser();
  const { t } = useTranslation();
  const [video, setVideo] = useState(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!video || !user) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append('video', video);
    formData.append('caption', caption);
    formData.append('clerkUserId', user.id);

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/api/reels/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIsUploading(false);
      handleClose();
    } catch (err) {
      console.error("Failed to upload reel", err);
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setVideo(null);
    setCaption('');
    setPreview(null);
    setIsUploading(false);
    onClose();
  };

  return typeof document !== 'undefined' ? createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }} 
            animate={{ scale: 1, y: 0 }} 
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-white dark:bg-[#121212] rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                <Film className="text-indigo-500" /> {t('Upload Reel')}
              </h2>
              <button onClick={handleClose} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-neutral-500">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleUpload} className="p-6">
              {/* Dropzone / Preview */}
              {!preview ? (
                <div className="relative border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-500 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition">
                  <Upload size={32} className="text-neutral-400 mb-3" />
                  <p className="text-sm font-medium dark:text-white">{t('Click to select a video')}</p>
                  <p className="text-xs text-neutral-500 mt-1">{t('MP4, WebM up to 50MB')}</p>
                  <input 
                    type="file" 
                    accept="video/*" 
                    onChange={handleFileChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden bg-black/90 aspect-[9/16] w-full max-h-[300px] flex justify-center mb-4 border border-neutral-200 dark:border-neutral-800">
                  <video src={preview} controls className="h-full object-contain"></video>
                  <button 
                    type="button"
                    onClick={() => { setVideo(null); setPreview(null); }}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-md transition"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 dark:text-neutral-300">{t('Caption')}</label>
                  <textarea 
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder={t("Write a catchy caption...")}
                    className="w-full bg-neutral-100 dark:bg-neutral-900 border border-transparent focus:border-indigo-500 rounded-xl px-4 py-3 outline-none dark:text-white transition resize-none h-24"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={!video || isUploading}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <span className="flex items-center gap-2">
                       <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span>
                       {t('Uploading...')}
                    </span>
                  ) : t('Post Reel')}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  ) : null;
}
