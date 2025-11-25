import express, { Request, Response } from 'express';

const router = express.Router();
const prisma = require("../../prisma/client.js");


// Health check endpoint that verifies database connection
router.get('/', async (req: Request, res: Response) => {
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
