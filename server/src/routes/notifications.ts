import express, { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = express.Router();

// GET all notifications for the authenticated user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        user_id: req.user.id
      },
      include: {
        issue: {
          select: {
            id: true,
            title: true,
            status: true
          }
        },
        relatedMessage: {
          select: {
            id: true,
            message_text: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(notifications);
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET unread notifications count for the authenticated user
router.get('/unread/count', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const count = await prisma.notification.count({
      where: {
        user_id: req.user.id,
        is_read: false
      }
    });

    res.json({ count });
  } catch (error: any) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET only unread notifications for the authenticated user
router.get('/unread', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        user_id: req.user.id,
        is_read: false
      },
      include: {
        issue: {
          select: {
            id: true,
            title: true,
            status: true
          }
        },
        relatedMessage: {
          select: {
            id: true,
            message_text: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(notifications);
  } catch (error: any) {
    console.error('Error fetching unread notifications:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH mark a notification as read
router.patch('/:id/read', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const notificationId = Number(req.params.id);

    // Verify the notification belongs to the authenticated user
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: {
        is_read: true,
        read_at: new Date()
      }
    });

    res.json(updatedNotification);
  } catch (error: any) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH mark all notifications as read for the authenticated user
router.patch('/read-all', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await prisma.notification.updateMany({
      where: {
        user_id: req.user.id,
        is_read: false
      },
      data: {
        is_read: true,
        read_at: new Date()
      }
    });

    res.json({ updated: result.count });
  } catch (error: any) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE a notification (soft delete by marking as read, or hard delete)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const notificationId = Number(req.params.id);

    // Verify the notification belongs to the authenticated user
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await prisma.notification.delete({
      where: { id: notificationId }
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
