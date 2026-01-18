/**
 * Version API Routes
 * 
 * Exposes build and version information via API endpoints.
 * Useful for:
 * - Health checks
 * - Deployment verification
 * - Client version validation
 */

import express from 'express';
import { getBuildInfo } from '../config/buildConfig.js';
import { getUsageStats } from '../middleware/usageTracker.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/version
 * Public endpoint - returns basic version info
 */
router.get('/', (req, res) => {
    const buildInfo = getBuildInfo();

    res.json({
        success: true,
        data: {
            name: buildInfo.project.name,
            version: buildInfo.version,
            versionString: buildInfo.versionString,
            environment: buildInfo.build.environment
        }
    });
});

/**
 * GET /api/version/full
 * Public endpoint - returns full build information
 */
router.get('/full', (req, res) => {
    const buildInfo = getBuildInfo();

    res.json({
        success: true,
        data: buildInfo
    });
});

/**
 * GET /api/version/health
 * Health check endpoint for load balancers/monitoring
 */
router.get('/health', (req, res) => {
    const buildInfo = getBuildInfo();

    res.json({
        status: 'healthy',
        version: buildInfo.versionString,
        instance: buildInfo.instance.id,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

/**
 * GET /api/version/stats
 * Admin only - returns usage statistics
 */
router.get('/stats', authenticate, async (req, res) => {
    // Only allow admins to view stats
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
    }

    const stats = getUsageStats();

    res.json({
        success: true,
        data: stats
    });
});

export default router;
