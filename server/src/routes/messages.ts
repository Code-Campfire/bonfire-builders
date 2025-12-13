import express, { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = express.Router();

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
    const { issue_id, message_text } = req.body;
    const sender_id = req.user!.userId;

    // Validate issue exists and user has access
    const issue = await prisma.issue.findUnique({
      where: { id: issue_id },
      include: { user: true, complex: true }
    });

    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    // Check if user is tenant of the issue or landlord
    const isAuthorized = issue.user_id === sender_id || req.user!.role === 'LANDLORD';
    if (!isAuthorized) {
      return res.status(403).json({ error: 'Unauthorized to send messages for this issue' });
    }

    const message = await prisma.message.create({
      data: {
        issue_id,
        sender_id,
        message_text,
        sender_type: req.user!.role
      },
      include: {
        sender: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            role: true
          }
        }
      }
    });

    // Emit real-time event
    const io = req.app.get('io');
    io.to(`issue-${issue_id}`).emit('new-message', message);

    res.status(201).json(message);
  } catch (error: any) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: error.message });
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
