import express, { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET all complexes
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const complexes = await prisma.complex.findMany({
      include: {
        _count: {
          select: { issues: true }
        }
      }
    });
    res.json(complexes);
  } catch (error: any) {
    console.error('Error fetching complexes:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// GET a specific complex
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const complex = await prisma.complex.findUnique({
      where: {
        id: Number(req.params.id)
      }
    });
    res.json(complex);
  } catch (error: any) {
    console.error('Error fetching complex:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// POST a new complex
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const complex = await prisma.complex.create({
      data: req.body
    });
    res.status(201).json(complex);
  } catch (error: any) {
    console.error('Error creating complex:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// PUT a complex
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const complex = await prisma.complex.update({
      where: {
        id: Number(req.params.id)
      },
      data: req.body
    });
    res.json(complex);
  } catch (error: any) {
    console.error('Error updating complex:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// DELETE a complex
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.complex.delete({
      where: {
        id: Number(req.params.id)
      }
    });
    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting complex:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

export default router;
