/**
 * Build Configuration and Version Management
 * 
 * This file contains version info that gets embedded into builds.
 * Updated automatically during the build process.
 */

import crypto from 'crypto';
import os from 'os';

/**
 * Generate a unique instance ID for this running server
 */
function generateInstanceId() {
    const machineId = [
        process.pid,
        os.hostname(),
        Date.now()
    ].join('-');

    return crypto.createHash('md5').update(machineId).digest('hex').substring(0, 12);
}

const buildConfig = {
    // Semantic version
    version: '1.0.0',

    // Build metadata (updated during build)
    build: {
        id: process.env.BUILD_ID || 'dev',
        timestamp: process.env.BUILD_TIMESTAMP || new Date().toISOString(),
        commit: process.env.GIT_COMMIT || 'unknown',
        branch: process.env.GIT_BRANCH || 'unknown',
        environment: process.env.NODE_ENV || 'development'
    },

    // Instance identification
    instance: {
        id: process.env.INSTANCE_ID || generateInstanceId(),
        startedAt: new Date().toISOString()
    },

    // Project info
    project: {
        name: 'MovieMania',
        description: 'Personal Entertainment Tracking Platform',
        repository: 'https://github.com/x-neon-nexus-o/MovieMania',
        license: 'MIT'
    }
};

/**
 * Get version string for display
 */
function getVersionString() {
    const { version, build } = buildConfig;
    return `v${version}-${build.id}`;
}

/**
 * Get full build info object
 */
function getBuildInfo() {
    return {
        version: buildConfig.version,
        versionString: getVersionString(),
        build: buildConfig.build,
        instance: buildConfig.instance,
        project: buildConfig.project
    };
}

export { buildConfig, getVersionString, getBuildInfo };
export default buildConfig;
