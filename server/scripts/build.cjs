/**
 * Build Script
 * 
 * Generates build metadata and prepares the application for production.
 * Run this before deploying to set build ID, timestamp, and git info.
 * 
 * Usage: node scripts/build.js
 */

const fs = require('fs');
const { execSync } = require('child_process');
const crypto = require('crypto');
const path = require('path');

console.log('🔨 MovieMania Build Script\n');

// Generate build metadata
const buildData = {
    BUILD_ID: generateBuildId(),
    BUILD_TIMESTAMP: new Date().toISOString(),
    GIT_COMMIT: getGitCommit(),
    GIT_BRANCH: getGitBranch(),
    NODE_ENV: 'production'
};

console.log('📦 Build Metadata:');
Object.entries(buildData).forEach(([key, value]) => {
    console.log(`   ${key}: ${value}`);
});

// Write to .env.build file (for production deployment)
const envContent = Object.entries(buildData)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

const buildEnvPath = path.join(__dirname, '..', '.env.build');
fs.writeFileSync(buildEnvPath, envContent);
console.log(`\n✅ Build metadata written to: ${buildEnvPath}`);

// Create build info JSON (for frontend/monitoring)
const buildInfoPath = path.join(__dirname, '..', 'build-info.json');
fs.writeFileSync(buildInfoPath, JSON.stringify({
    version: getPackageVersion(),
    ...buildData,
    generatedAt: new Date().toISOString()
}, null, 2));
console.log(`✅ Build info JSON written to: ${buildInfoPath}`);

console.log('\n🎉 Build preparation complete!\n');
console.log('To deploy with this build info, ensure these environment variables are set:');
Object.keys(buildData).forEach(key => {
    console.log(`   export ${key}="${buildData[key]}"`);
});

// Helper functions
function generateBuildId() {
    const timestamp = Date.now().toString(36);
    const random = crypto.randomBytes(3).toString('hex');
    return `${timestamp}-${random}`;
}

function getGitCommit() {
    try {
        return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
    } catch {
        return 'unknown';
    }
}

function getGitBranch() {
    try {
        return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    } catch {
        return 'unknown';
    }
}

function getPackageVersion() {
    try {
        const pkg = require('../package.json');
        return pkg.version || '1.0.0';
    } catch {
        return '1.0.0';
    }
}
