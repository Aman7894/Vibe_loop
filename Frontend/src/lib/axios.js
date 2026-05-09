import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// Optionally, you could intercept requests here to add auth headers if needed
// api.interceptors.request.use((config) => { ... return config; });

export default api;
