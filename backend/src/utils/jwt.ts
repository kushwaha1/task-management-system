import jwt from 'jsonwebtoken';
import { UserPayload } from '../types';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? 'access-secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'refresh-secret';
const ACCESS_EXPIRY = (process.env.JWT_ACCESS_EXPIRY || '15m') as any;
const REFRESH_EXPIRY = (process.env.JWT_REFRESH_EXPIRY || '7d') as any;

export const generateAccessToken = (payload: UserPayload): string => {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY });
};

export const generateRefreshToken = (payload: UserPayload): string => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });
};

export const verifyAccessToken = (token: string): UserPayload => {
  return jwt.verify(token, ACCESS_SECRET) as UserPayload;
};

export const verifyRefreshToken = (token: string): UserPayload => {
  return jwt.verify(token, REFRESH_SECRET) as UserPayload;
};