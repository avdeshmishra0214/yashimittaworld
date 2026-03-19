import axios from 'axios';
import { auth } from '../utils/auth';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request
client.interceptors.request.use(config => {
  const token = auth.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
client.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      auth.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  login:    (data) => client.post('/auth/login', data),
  register: (data) => client.post('/auth/register', data),
};

export const profilesApi = {
  getAll:  ()     => client.get('/profiles'),
  getById: (id)   => client.get(`/profiles/${id}`),
  create:  (data) => client.post('/profiles', data),
  delete:  (id)   => client.delete(`/profiles/${id}`),
};

export const scoresApi = {
  save:         (data)    => client.post('/scores', data),
  getByProfile: (pid)     => client.get(`/scores/${pid}`),
  getLeaderboard: (game)  => client.get(`/scores/leaderboard/${game}`),
};

export const wordsApi = {
  get: (difficulty, count = 5) => {
    const params = { count };
    if (difficulty) params.difficulty = difficulty;
    return client.get('/words', { params });
  },
};

export default client;
