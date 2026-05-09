import api from '../lib/axios';

export const postService = {
  getPosts: async (feedType, clerkId) => {
    const res = await api.get('/posts', { params: { feed: feedType, clerkId } });
    return res.data;
  },
  
  createPost: async (formData) => {
    const res = await api.post('/create-post', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  likePost: async (postId, clerkUserId) => {
    const res = await api.post(`/api/posts/${postId}/like`, { clerkUserId });
    return res.data;
  },

  getComments: async (postId) => {
    const res = await api.get(`/api/posts/${postId}/comments`);
    return res.data;
  },

  addComment: async (postId, text, clerkUserId) => {
    const res = await api.post(`/api/posts/${postId}/comments`, { text, clerkUserId });
    return res.data;
  }
};
