import axios from 'axios';

export const ACCESS_TOKEN_KEY = 'accessToken';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '';

export const apiClient = axios.create({
  baseURL: rawBaseUrl ? `${rawBaseUrl}/api` : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
