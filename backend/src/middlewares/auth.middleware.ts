import { Request, Response, NextFunction } from 'express';
import { validateToken } from '../utils/token.js';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        name: string;
    };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = validateToken(token);
        req.user = payload;
        next();
    } catch {
        return res.status(401).json({ message: "Unauthorized" });
    }

}