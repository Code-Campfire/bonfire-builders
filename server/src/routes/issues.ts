import express, { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = express.Router();

// GET all issues (requires authentication)
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const issues = await prisma.issue.findMany({
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            apartment_number: true,
            building_name: true
          }
        },
        complex: {
          select: {
            id: true,
            name: true,
            address: true
          }
        },
        _count: {
          select: {
            photos: true,
            messages: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(issues);
  } catch (error: any) {
    console.error('Error fetching issues:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// GET all messages for a specific issue (requires authentication)
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

// GET a specific issue by ID (requires authentication)
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
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
            apartment_number: true,
            building_name: true,
            phone: true
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
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, priority, location } = req.body;

    // Validation
    if (!title || !description || !category || !priority || !location) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['title', 'description', 'category', 'priority', 'location']
      });
    }

    // Get user_id and complex_id from authenticated user
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Fetch the user's current complex_id from database to ensure it's up-to-date
    // (JWT may have stale data if user was updated after token was issued)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { complex_id: true }
    });

    if (!user || !user.complex_id) {
      return res.status(400).json({ error: 'User missing complex assignment' });
    }

    const newIssue = await prisma.issue.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        location: location.trim(),
        user_id: userId,
        complex_id: user.complex_id
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

// PUT/UPDATE an issue (requires authentication and ownership or landlord role)
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, priority, status, location } = req.body;
    const issueId = Number(req.params.id);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Verify issue exists and check ownership
    const existingIssue = await prisma.issue.findUnique({
      where: { id: issueId },
      select: { user_id: true }
    });

    if (!existingIssue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    // Only the issue owner or landlord can update
    if (req.user?.role !== 'LANDLORD' && existingIssue.user_id !== userId) {
      return res.status(403).json({ 
        error: 'You do not have permission to update this issue' 
      });
    }

    // Fetch current issue to check existing dates
    const currentIssue = await prisma.issue.findUnique({
      where: { id: issueId },
      select: { acknowledged_date: true, resolved_date: true, closed_date: true }
    });

    if (!currentIssue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    // Prepare update data
    const updateData: any = {
      ...(title && { title: title.trim() }),
      ...(description && { description: description.trim() }),
      ...(category && { category }),
      ...(priority && { priority }),
      ...(status && { status }),
      ...(location && { location: location.trim() })
    };

    // Set date fields based on status transitions
    // When moving to a status, set its date if not already set
    // When moving back to an earlier status, clear the dates for later statuses
    if (status === 'PENDING') {
      // Moving back to PENDING clears all progress dates
      updateData.acknowledged_date = null;
      updateData.resolved_date = null;
      updateData.closed_date = null;
    } else if (status === 'IN_PROGRESS') {
      if (!currentIssue.acknowledged_date) {
        updateData.acknowledged_date = new Date();
      }
      // Clear resolved and closed dates (moving back from later status)
      updateData.resolved_date = null;
      updateData.closed_date = null;
    } else if (status === 'RESOLVED') {
      if (!currentIssue.resolved_date) {
        updateData.resolved_date = new Date();
      }
      // Clear closed_date (moving back from CLOSED)
      updateData.closed_date = null;
    } else if (status === 'CLOSED') {
      if (!currentIssue.closed_date) {
        updateData.closed_date = new Date();
      }
    }

    const updatedIssue = await prisma.issue.update({
      where: { id: issueId },
      data: updateData,
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

// DELETE an issue (requires authentication and ownership or landlord role)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const issueId = Number(req.params.id);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Verify issue exists and check ownership
    const existingIssue = await prisma.issue.findUnique({
      where: { id: issueId },
      select: { user_id: true }
    });

    if (!existingIssue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    // Only the issue owner or landlord can delete
    if (req.user?.role !== 'LANDLORD' && existingIssue.user_id !== userId) {
      return res.status(403).json({ 
        error: 'You do not have permission to delete this issue' 
      });
    }

    // Delete associated records first to avoid foreign key constraint violations
    await prisma.message.deleteMany({
      where: { issue_id: issueId }
    });

    await prisma.photo.deleteMany({
      where: { issue_id: issueId }
    });

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
