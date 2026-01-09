import { Request } from 'express';

export interface UserPayload {
  userId: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface TaskQuery {
  page?: string;
  limit?: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  search?: string;
}