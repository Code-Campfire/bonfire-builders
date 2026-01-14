import express, { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = express.Router();

// GET all issues (requires authentication)
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    // Build WHERE clause based on role
    let whereClause = {};

    if (req.user?.role === 'TENANT') {
      // Tenants only see issues they created
      whereClause = {
        user_id: req.user.id
      };
    } else if (req.user?.role === 'LANDLORD') {
      // Landlords see all issues in their complex
      whereClause = {
        complex_id: req.user.complex_id
      };
    } else if (req.user?.role === 'ADMIN') {
      // Admins see everything - no filter
      whereClause = {};
    }

    const issues = await prisma.issue.findMany({
      where: whereClause,
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
    // First, check if the issue exists and user has permission
    const issue = await prisma.issue.findUnique({
      where: { id: Number(req.params.id) },
      select: { user_id: true, complex_id: true }
    });

    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    // Authorization check
    const isAuthorized = 
      req.user?.role === 'ADMIN' ||
      (req.user?.role === 'TENANT' && issue.user_id === req.user.id) ||
      (req.user?.role === 'LANDLORD' && issue.complex_id === req.user.complex_id);

    if (!isAuthorized) {
      return res.status(403).json({ error: 'You do not have permission to view these messages' });
    }

    // User is authorized - fetch and return messages
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

    // Authorization check based on role
    const isAuthorized = 
      req.user?.role === 'ADMIN' || // Admins can see everything
      (req.user?.role === 'TENANT' && issue.user_id === req.user.id) || // Tenant owns it
      (req.user?.role === 'LANDLORD' && issue.complex_id === req.user.complex_id); // Landlord's complex

    if (!isAuthorized) {
      return res.status(403).json({ error: 'You do not have permission to view this issue' });
    }

    // User is authorized - return the issue
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

    // Notify all landlords in the complex about the new issue
    if (req.user?.role === 'TENANT') {
      const landlords = await prisma.user.findMany({
        where: {
          complex_id: user.complex_id,
          role: 'LANDLORD'
        }
      });

      // Create in-app notifications for all landlords
      for (const landlord of landlords) {
        await prisma.notification.create({
          data: {
            user_id: landlord.id,
            type: 'ISSUE_CREATED',
            title: 'New maintenance issue reported',
            message: `${req.user.first_name} ${req.user.last_name} reported: "${title.trim()}"`,
            issue_id: newIssue.id
          }
        });
      }
    }

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
      select: { user_id: true, complex_id: true }
    });

    if (!existingIssue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    // Tenants can only update their own issues
    if (req.user?.role === 'TENANT' && existingIssue.user_id !== userId) {
      return res.status(403).json({ 
        error: 'You do not have permission to update this issue' 
      });
    }

    // Landlords can only update issues in their complex
    if (req.user?.role === 'LANDLORD' && existingIssue.complex_id !== req.user.complex_id) {
      return res.status(403).json({ 
        error: 'You can only update issues in your complex' 
      });
    }

    // Admins can update anything (no additional check needed)

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

    // Send notifications to tenant when landlord updates the issue
    if (req.user && req.user.role === 'LANDLORD' && existingIssue.user_id !== userId) {
      let notificationTitle = '';
      let notificationMessage = '';
      let notificationType: 'ISSUE_STATUS_CHANGED' | 'ISSUE_ACKNOWLEDGED' | 'ISSUE_RESOLVED' | 'ISSUE_CLOSED' | 'ISSUE_PRIORITY_CHANGED' = 'ISSUE_STATUS_CHANGED';

      // Determine notification type and message based on what was updated
      if (status && status !== currentIssue.acknowledged_date) {
        if (status === 'IN_PROGRESS' && !currentIssue.acknowledged_date) {
          notificationType = 'ISSUE_ACKNOWLEDGED';
          notificationTitle = 'Issue acknowledged';
          notificationMessage = `${req.user.first_name} ${req.user.last_name} has acknowledged your issue "${updatedIssue.title}"`;
        } else if (status === 'RESOLVED') {
          notificationType = 'ISSUE_RESOLVED';
          notificationTitle = 'Issue resolved';
          notificationMessage = `${req.user.first_name} ${req.user.last_name} marked your issue "${updatedIssue.title}" as resolved`;
        } else if (status === 'CLOSED') {
          notificationType = 'ISSUE_CLOSED';
          notificationTitle = 'Issue closed';
          notificationMessage = `${req.user.first_name} ${req.user.last_name} closed your issue "${updatedIssue.title}"`;
        } else {
          notificationType = 'ISSUE_STATUS_CHANGED';
          notificationTitle = 'Issue status updated';
          notificationMessage = `${req.user.first_name} ${req.user.last_name} updated the status of "${updatedIssue.title}" to ${status.replace('_', ' ').toLowerCase()}`;
        }
      } else if (priority && priority !== req.body.originalPriority) {
        notificationType = 'ISSUE_PRIORITY_CHANGED';
        notificationTitle = 'Issue priority changed';
        notificationMessage = `${req.user.first_name} ${req.user.last_name} changed the priority of "${updatedIssue.title}" to ${priority}`;
      } else {
        // General update
        notificationTitle = 'Issue updated';
        notificationMessage = `${req.user.first_name} ${req.user.last_name} updated your issue "${updatedIssue.title}"`;
      }

      // Create in-app notification for the tenant
      if (notificationMessage) {
        await prisma.notification.create({
          data: {
            user_id: existingIssue.user_id,
            type: notificationType,
            title: notificationTitle,
            message: notificationMessage,
            issue_id: updatedIssue.id
          }
        });
      }
    }

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
