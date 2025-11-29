import express, { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET all issues
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const issues = await prisma.issue.findMany();
    res.json(issues);
  } catch (error: any) {
    console.error('Error fetching issues:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// GET all messages for a specific issue
router.get('/:id/messages', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        issue_id: Number(req.params.id)
      }
    });
    res.json(messages);
  } catch (error: any) {
    console.error('Error fetching messages for issue:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// OTHER ENDPOINTS TO ADD:

// GET a specific single issue (for issue details page, include messages and photos)
// GET all issues for a specific complex
// GET all issues for a specific unit
// POST a new issue
// PUT an issue (update)
// DELETE an issue

export default router;
