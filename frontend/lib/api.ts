import axios from 'axios';
import { AuthResponse, TasksResponse, Task, CreateTaskDTO, UpdateTaskDTO } from '../interceptors/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const { data } = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        localStorage.setItem('accessToken', data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (email: string, password: string, name: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/register', {
      email,
      password,
      name,
    });
    return data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};

// Task API
export const taskAPI = {
  getTasks: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<TasksResponse> => {
    const { data } = await api.get<TasksResponse>('/tasks', { params });
    return data;
  },

  getTask: async (id: string): Promise<Task> => {
    const { data } = await api.get<Task>(`/tasks/${id}`);
    return data;
  },

  createTask: async (task: CreateTaskDTO): Promise<Task> => {
    const { data } = await api.post<Task>('/tasks', task);
    return data;
  },

  updateTask: async (id: string, task: UpdateTaskDTO): Promise<Task> => {
    const { data } = await api.patch<Task>(`/tasks/${id}`, task);
    return data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  toggleTask: async (id: string): Promise<Task> => {
    const { data } = await api.post<Task>(`/tasks/${id}/toggle`);
    return data;
  },
};