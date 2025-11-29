import express, { Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = express.Router();

// GET all issues
router.get('/', async (req: Request, res: Response) => {
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
router.get('/:id/messages', async (req: Request, res: Response) => {
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

// GET a specific issue by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const issue = await prisma.issue.findUnique({
      where: {
        id: Number(req.params.id)
      },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            apartment_number: true
          }
        },
        complex: true,
        photos: true,
        messages: {
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
        }
      }
    });

    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    res.json(issue);
  } catch (error: any) {
    console.error('Error fetching issue:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST a new issue
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description, category, priority, location, user_id, complex_id } = req.body;

    // Validation
    if (!title || !description || !category || !priority || !location) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['title', 'description', 'category', 'priority', 'location']
      });
    }

    // TODO: In production, user_id should come from authenticated session
    // For now, we'll use a default or passed value
    const userId = user_id || 1; // Default to user 1 for testing
    const complexId = complex_id || 1; // Default to complex 1 for testing

    const newIssue = await prisma.issue.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        location: location.trim(),
        user_id: userId,
        complex_id: complexId
      },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            apartment_number: true
          }
        },
        complex: true
      }
    });

    res.status(201).json(newIssue);
  } catch (error: any) {
    console.error('Error creating issue:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT/UPDATE an issue
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { title, description, category, priority, status, location } = req.body;
    const issueId = Number(req.params.id);

    const updatedIssue = await prisma.issue.update({
      where: { id: issueId },
      data: {
        ...(title && { title: title.trim() }),
        ...(description && { description: description.trim() }),
        ...(category && { category }),
        ...(priority && { priority }),
        ...(status && { status }),
        ...(location && { location: location.trim() })
      },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true
          }
        },
        complex: true
      }
    });

    res.json(updatedIssue);
  } catch (error: any) {
    console.error('Error updating issue:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Issue not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

// DELETE an issue
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const issueId = Number(req.params.id);

    await prisma.issue.delete({
      where: { id: issueId }
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting issue:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Issue not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

export default router;
