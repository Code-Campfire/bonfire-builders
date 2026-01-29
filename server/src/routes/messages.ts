import express, { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest, authenticateToken } from '../middleware/auth';
import { sendNewMessageNotification } from '../services/emailService';

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
    const { issue_id, message_text, sender_id, sender_role } = req.body
    // Validate issue exists and user has access
    const issue = await prisma.issue.findUnique({
      where:  {id: issue_id} ,
      include: { user: true, complex: true }
    });

    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }


    const message = await prisma.message.create({
      data: req.body,
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

    // Send notifications to tenant if landlord sent message
    if (req.user && req.user.role === 'LANDLORD') {
      const userPreferences = (issue.user.preferences as { emailNotifications?: boolean }) || {};
      const emailEnabled = userPreferences.emailNotifications !== false; // Default true

      // Send email notification if enabled
      if (emailEnabled) {
        await sendNewMessageNotification(issue.user, issue, message_text, req.user);
      }

      // Always create in-app notification
      const notification = await prisma.notification.create({
        data: {
          user_id: issue.user_id,
          type: 'MESSAGE_RECEIVED',
          title: 'New message on your issue',
          message: `${req.user.first_name} ${req.user.last_name} replied to "${issue.title}"`,
          issue_id: issue.id,
          message_id: message.id
        }
      });

      // Emit real-time notification event to the tenant
      const io = req.app.get('io');
      io.to(`user-${issue.user_id}`).emit('new-notification', notification);
    }

    // Send notifications to landlords if tenant sent message
    if (req.user && req.user.role === 'TENANT') {
      const landlords = await prisma.user.findMany({
        where: {
          complex_id: issue.complex_id,
          role: 'LANDLORD'
        }
      });

      const io = req.app.get('io');

      // Create in-app notifications for all landlords
      for (const landlord of landlords) {
        const notification = await prisma.notification.create({
          data: {
            user_id: landlord.id,
            type: 'MESSAGE_RECEIVED',
            title: 'New message from tenant',
            message: `${req.user.first_name} ${req.user.last_name} replied to "${issue.title}"`,
            issue_id: issue.id,
            message_id: message.id
          }
        });

        // Emit real-time notification event to each landlord
        io.to(`user-${landlord.id}`).emit('new-notification', notification);
      }
    }

    // Emit real-time message event to issue room
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
