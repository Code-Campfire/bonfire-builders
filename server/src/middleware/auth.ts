import { Request, Response, NextFunction } from 'express';
import { rmSync } from 'fs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

export interface AuthRequest extends Request {
    user?: {
        id: number,
        email: string,
        role: string,
        first_name: string,
        last_name: string,
        complex_id: number,
        phone?: string,
        apartment_number?: string,
        building_name?: string,
        move_in_date?: string
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

// Role-based access control middleware
export const requireRole = (...allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                status: "Unauthorized",
                message: "Authentication required"
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                status: "Forbidden",
                message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
            });
        }

        next();
    };
};

// Check if user is landlord
export const requireLandlord = requireRole('LANDLORD');

// Check if user is tenant
export const requireTenant = requireRole('TENANT');

// Check if user is landlord or tenant (any authenticated user)
export const requireAuthenticated = requireRole('LANDLORD', 'TENANT');

// Ownership verification middleware for issues
export const requireIssueOwnership = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const issueId = Number(req.params.id);
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                status: "Unauthorized",
                message: "Authentication required"
            });
        }

        const issue = await prisma.issue.findUnique({
            where: { id: issueId },
            select: { user_id: true }
        });

        if (!issue) {
            return res.status(404).json({
                status: "Not Found",
                message: "Issue not found"
            });
        }

        // Landlords can access any issue, tenants can only access their own
        if (req.user?.role !== 'LANDLORD' && issue.user_id !== userId) {
            return res.status(403).json({
                status: "Forbidden",
                message: "You do not have permission to access this issue"
            });
        }

        next();
    } catch (error: any) {
        return res.status(500).json({
            status: "Error",
            message: "Failed to verify ownership",
            error: error.message
        });
    }
};

// Ownership verification middleware for complex-scoped resources
export const requireComplexAccess = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const complexId = Number(req.params.id || req.body.complex_id);
        const userComplexId = req.user?.complex_id;

        if (!userComplexId) {
            return res.status(401).json({
                status: "Unauthorized",
                message: "User not assigned to a complex"
            });
        }

        // Landlords can access any complex data (if needed for multi-complex management)
        // Tenants can only access their own complex data
        if (req.user?.role !== 'LANDLORD' && complexId !== userComplexId) {
            return res.status(403).json({
                status: "Forbidden",
                message: "You do not have permission to access this complex"
            });
        }

        next();
    } catch (error: any) {
        return res.status(500).json({
            status: "Error",
            message: "Failed to verify complex access",
            error: error.message
        });
    }
};