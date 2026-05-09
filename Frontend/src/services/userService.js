import api from '../lib/axios';

export const userService = {
  syncUser: async (userData) => {
    // Usually handled by a webhook, but we can do a manual sync if needed
    const res = await api.post('/api/users/sync', userData);
    return res.data;
  },
  
  getUserProfile: async (clerkUserId) => {
    const res = await api.get(`/api/users/${clerkUserId}`);
    return res.data;
  },

  followUser: async (targetUserId, clerkUserId) => {
    const res = await api.post(`/api/users/${targetUserId}/follow`, { clerkUserId });
    return res.data;
  }
};
