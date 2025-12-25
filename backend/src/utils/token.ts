import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/jwt.js';
import { env } from '../config/env.js'

const JWT_SECRET = env.jwtSecret as string;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

export const validateToken = (token: string): JwtPayload => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        return decoded;
    } catch (err) {
        throw new Error("Invalid or Expired Token");
    }
}
