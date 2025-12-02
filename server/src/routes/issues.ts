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
            phone: true,
            apartment_number: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            role: true
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
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Convert category and priority to uppercase to match enum
    const normalizedCategory = category.toUpperCase().replace(/\s+/g, '_');
    const normalizedPriority = priority.toUpperCase();

    // Use defaults for user_id and complex_id for testing
    const userId = user_id || 1;
    const complexId = complex_id || 1;

    const newIssue = await prisma.issue.create({
      data: {
        title,
        description,
        category: normalizedCategory,
        priority: normalizedPriority,
        status: 'OPEN',
        location,
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
            phone: true,
            apartment_number: true
          }
        },
        complex: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(201).json(newIssue);
  } catch (error: any) {
    console.error('Error creating issue:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT (update) an existing issue
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, category, priority, location, status } = req.body;

    const updatedIssue = await prisma.issue.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        category,
        priority,
        location,
        status
      },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
            apartment_number: true
          }
        },
        complex: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(200).json(updatedIssue);
  } catch (error: any) {
    console.error('Error updating issue:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE an issue
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if issue exists
    const existingIssue = await prisma.issue.findUnique({
      where: { id: Number(id) }
    });

    if (!existingIssue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    // Delete associated messages and photos first (cascade should handle this, but being explicit)
    await prisma.message.deleteMany({
      where: { issue_id: Number(id) }
    });

    await prisma.photo.deleteMany({
      where: { issue_id: Number(id) }
    });

    // Delete the issue
    await prisma.issue.delete({
      where: { id: Number(id) }
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting issue:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
