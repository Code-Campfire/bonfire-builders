import express, { Response } from 'express';
import { AuthRequest, authenticateToken } from '../middleware/auth';
import { getLandlordMetrics, getTenantMetrics } from '../services/metricsService';

const router = express.Router();

/**
 * GET /api/metrics
 * Returns metrics based on user role:
 * - LANDLORD: Full metrics dashboard (all issues in their complex)
 * - TENANT: Simplified metrics (30-day rolling average)
 * - ADMIN: Full metrics (all complexes)
 *
 * Query params:
 * - daysBack: Number of days to look back (default: 30 for tenants, all time for landlords)
 */
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const userComplexId = req.user?.complex_id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Parse daysBack query parameter
    const daysBack = req.query.daysBack ? parseInt(req.query.daysBack as string) : undefined;

    if (userRole === 'TENANT') {
      // Tenants see simplified metrics for their complex (30-day rolling by default)
      if (!userComplexId) {
        return res.status(400).json({ error: 'User missing complex assignment' });
      }

      const metrics = await getTenantMetrics(userComplexId, daysBack || 30);
      return res.json({
        role: 'TENANT',
        daysBack: daysBack || 30,
        metrics
      });
    } else if (userRole === 'LANDLORD') {
      // Landlords see full metrics for their complex (all time by default)
      if (!userComplexId) {
        return res.status(400).json({ error: 'User missing complex assignment' });
      }

      const metrics = await getLandlordMetrics(userComplexId, daysBack || 0);
      return res.json({
        role: 'LANDLORD',
        daysBack: daysBack || 0,
        metrics
      });
    } else if (userRole === 'ADMIN') {
      // Admins can see metrics for all complexes or a specific complex
      const complexId = req.query.complexId
        ? parseInt(req.query.complexId as string)
        : userComplexId;

      if (!complexId) {
        return res.status(400).json({
          error: 'Admin must specify complexId query parameter or have a complex assignment'
        });
      }

      const metrics = await getLandlordMetrics(complexId, daysBack || 0);
      return res.json({
        role: 'ADMIN',
        complexId,
        daysBack: daysBack || 0,
        metrics
      });
    } else {
      return res.status(403).json({ error: 'Invalid user role' });
    }
  } catch (error: any) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
