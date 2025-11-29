import express, { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET all messages
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const messages = await prisma.message.findMany();
    res.json(messages);
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// POST a new message
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const message = await prisma.message.create({
      data: req.body
    });
    res.status(201).json(message);
  } catch (error: any) {
    console.error('Error creating message:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// PUT a message
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const message = await prisma.message.update({
      where: {
        id: Number(req.params.id)
      },
      data: req.body
    });
    res.json(message);
  } catch (error: any) {
    console.error('Error updating message:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// DELETE a message
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.message.delete({
      where: {
        id: Number(req.params.id)
      }
    });
    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

export default router;
