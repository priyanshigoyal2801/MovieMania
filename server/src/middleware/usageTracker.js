/**
 * Usage Tracking Middleware
 * 
 * Logs API usage with version and instance information.
 * This helps trace which builds are being used in production.
 */

import { getBuildInfo } from '../config/buildConfig.js';

// In-memory usage stats (reset on server restart)
const usageStats = {
    requestCount: 0,
    endpointHits: {},
    userAgents: {},
    startTime: new Date().toISOString()
};

/**
 * Middleware to track API usage
 */
export const usageTracker = (req, res, next) => {
    // Increment request count
    usageStats.requestCount++;

    // Track endpoint hits
    const endpoint = `${req.method} ${req.route?.path || req.path}`;
    usageStats.endpointHits[endpoint] = (usageStats.endpointHits[endpoint] || 0) + 1;

    // Track user agents (for client identification)
    const userAgent = req.headers['user-agent'] || 'unknown';
    const clientId = req.headers['x-client-id'] || 'anonymous';

    if (!usageStats.userAgents[clientId]) {
        usageStats.userAgents[clientId] = {
            userAgent: userAgent.substring(0, 100),
            firstSeen: new Date().toISOString(),
            requestCount: 0
        };
    }
    usageStats.userAgents[clientId].requestCount++;
    usageStats.userAgents[clientId].lastSeen = new Date().toISOString();

    // Add build info to response headers (watermark)
    const buildInfo = getBuildInfo();
    res.setHeader('X-MovieMania-Version', buildInfo.versionString);
    res.setHeader('X-MovieMania-Instance', buildInfo.instance.id);
    res.setHeader('X-MovieMania-Build', buildInfo.build.id);

    next();
};

/**
 * Get current usage statistics
 */
export const getUsageStats = () => {
    const buildInfo = getBuildInfo();
    return {
        build: buildInfo,
        stats: {
            ...usageStats,
            uptime: getUptime(),
            topEndpoints: getTopEndpoints(10)
        }
    };
};

/**
 * Calculate server uptime
 */
function getUptime() {
    const start = new Date(usageStats.startTime);
    const now = new Date();
    const diff = now - start;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes, startTime: usageStats.startTime };
}

/**
 * Get top N most accessed endpoints
 */
function getTopEndpoints(n = 10) {
    return Object.entries(usageStats.endpointHits)
        .sort((a, b) => b[1] - a[1])
        .slice(0, n)
        .map(([endpoint, count]) => ({ endpoint, count }));
}

/**
 * Log usage to console (for development/debugging)
 */
export const logUsageSnapshot = () => {
    const stats = getUsageStats();
    console.log('\n📊 Usage Snapshot:');
    console.log(`   Version: ${stats.build.versionString}`);
    console.log(`   Instance: ${stats.build.instance.id}`);
    console.log(`   Requests: ${stats.stats.requestCount}`);
    console.log(`   Uptime: ${stats.stats.uptime.days}d ${stats.stats.uptime.hours}h ${stats.stats.uptime.minutes}m`);
    console.log(`   Unique Clients: ${Object.keys(stats.stats.userAgents).length}`);
};

export default usageTracker;
