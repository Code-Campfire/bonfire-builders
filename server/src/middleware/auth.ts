import { Request, Response, NextFunction } from 'express';
import { rmSync } from 'fs';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: {
        userId: number,
        email: string,
        role: string,
        firstName: string,
        lastName: string
    };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(401).json({
            status: "Unauthorized",
            message: "Access token required"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        req.user = decoded; // Attaches user information to HTTP request
        next();
    }
    catch(error: any) {
        return res.status(403).json({
            status: "Forbidden",
            message: "Invalid or expired token"
        })
    }
}