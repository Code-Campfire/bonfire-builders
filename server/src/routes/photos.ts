import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    // Fetch all photos from the database
    const photos = await prisma.photo.findMany();
    res.json(photos);
  } catch (error: any) {
    console.error('Error fetching photos:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// OTHER ENDPOINTS TO ADD:

// GET all photos for a specific issue
// POST a new photo
// PUT a photo
// DELETE a photo

export default router;
