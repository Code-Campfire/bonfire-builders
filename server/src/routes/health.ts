import express, { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = express.Router();


// Health check endpoint that verifies database connection
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    // Try to query the database
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: 'ok',
      message: 'Server is running and database is connected',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Database connection error:', error);
    res.status(503).json({
      status: 'error',
      message: 'Database connection failed',
      database: 'disconnected',
      error: error.message
    });
  }
});

export default router;
