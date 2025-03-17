#!/usr/bin/env node

/**
 * Vercel Deployment Verification Script
 * 
 * This script helps verify the deployment configuration and environment variables
 * for Vercel deployment of the Veliano project.
 * 
 * Usage: node scripts/verify-deployment.js
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Required environment variables
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASSWORD',
  'SMTP_FROM_EMAIL',
  'SMTP_FROM_NAME',
  'NEXT_PUBLIC_GA_ID',
  'NEXT_PUBLIC_SITE_URL'
];

// Configuration files to check
const CONFIG_FILES = [
  'next.config.js',
  'next.config.mjs',
  'tsconfig.json',
  'package.json'
];

// Check if Vercel CLI is installed
function checkVercelCLI() {
  try {
    const version = execSync('vercel --version').toString().trim();
    console.log(`✅ Vercel CLI is installed: ${version}`);
    return true;
  } catch (error) {
    console.error('❌ Vercel CLI is not installed. Please install it with: npm i -g vercel');
    return false;
  }
}

// Check if user is logged into Vercel
function checkVercelLogin() {
  try {
    // This command will fail if not logged in
    execSync('vercel whoami', { stdio: 'pipe' });
    console.log('✅ Logged into Vercel CLI');
    return true;
  } catch (error) {
    console.error('❌ Not logged into Vercel CLI. Please run: vercel login');
    return false;
  }
}

// Check if the project is linked to Vercel
function checkVercelProject() {
  try {
    const projectInfo = execSync('vercel project ls --json').toString();
    const projects = JSON.parse(projectInfo);
    
    if (projects.length > 0) {
      console.log('✅ Project is linked to Vercel');
      console.log(`   Project name: ${projects[0].name}`);
      return true;
    } else {
      console.log('❌ No Vercel project linked. Run: vercel link');
      return false;
    }
  } catch (error) {
    console.error('❌ Error checking Vercel project:', error.message);
    return false;
  }
}

// Check environment variables
function checkEnvironmentVariables() {
  // Check .env.production first
  let envProdContent = '';
  try {
    envProdContent = fs.readFileSync(path.join(ROOT_DIR, '.env.production'), 'utf8');
    console.log('✅ Found .env.production file');
  } catch (error) {
    console.log('⚠️ No .env.production file found. This is needed for production deployments.');
  }
  
  // Check .env.vercel file
  let envVercelContent = '';
  try {
    envVercelContent = fs.readFileSync(path.join(ROOT_DIR, '.env.vercel'), 'utf8');
    console.log('✅ Found .env.vercel file');
  } catch (error) {
    console.log('⚠️ No .env.vercel file found. This might be needed for Vercel deployments.');
  }
  
  // Check for required variables in any of the env files
  const missingVars = [];
  for (const envVar of REQUIRED_ENV_VARS) {
    if (
      !envProdContent.includes(`${envVar}=`) && 
      !envVercelContent.includes(`${envVar}=`)
    ) {
      missingVars.push(envVar);
    }
  }
  
  if (missingVars.length > 0) {
    console.log('❌ Missing environment variables in env files:');
    missingVars.forEach(variable => console.log(`   - ${variable}`));
  } else {
    console.log('✅ All required environment variables found in env files');
  }
  
  // Try to check Vercel environment variables (requires authentication)
  try {
    const vercelEnvVars = execSync('vercel env ls --json').toString();
    const envVars = JSON.parse(vercelEnvVars);
    
    const vercelMissingVars = [];
    for (const envVar of REQUIRED_ENV_VARS) {
      if (!envVars.some(v => v.key === envVar)) {
        vercelMissingVars.push(envVar);
      }
    }
    
    if (vercelMissingVars.length > 0) {
      console.log('❌ Missing environment variables in Vercel:');
      vercelMissingVars.forEach(variable => console.log(`   - ${variable}`));
    } else {
      console.log('✅ All required environment variables set in Vercel');
    }
  } catch (error) {
    console.log('⚠️ Could not check Vercel environment variables. Make sure you are logged in.');
  }
}

// Check configuration files
function checkConfigFiles() {
  let hasIssues = false;
  
  // Check for duplicate next.config files
  if (
    fs.existsSync(path.join(ROOT_DIR, 'next.config.js')) && 
    fs.existsSync(path.join(ROOT_DIR, 'next.config.mjs'))
  ) {
    console.log('❌ Both next.config.js and next.config.mjs exist. This can cause conflicts.');
    hasIssues = true;
  }
  
  // Check output configuration
  let outputConfigured = false;
  for (const configFile of ['next.config.js', 'next.config.mjs']) {
    const configPath = path.join(ROOT_DIR, configFile);
    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, 'utf8');
      if (configContent.includes('output: \'standalone\'') || 
          configContent.includes('output:"standalone"') || 
          configContent.includes('output: "standalone"')) {
        outputConfigured = true;
      }
    }
  }
  
  if (!outputConfigured) {
    console.log('⚠️ Next.js output is not configured as "standalone". This is recommended for Vercel deployments.');
    hasIssues = true;
  } else {
    console.log('✅ Next.js output is correctly configured as "standalone"');
  }
  
  return !hasIssues;
}

// Check package.json for build configuration
function checkPackageJSON() {
  try {
    const packageJSONPath = path.join(ROOT_DIR, 'package.json');
    const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, 'utf8'));
    
    // Check if build script exists
    if (!packageJSON.scripts || !packageJSON.scripts.build) {
      console.log('❌ No build script found in package.json');
      return false;
    }
    
    console.log(`✅ Build script found: "${packageJSON.scripts.build}"`);
    
    // Check dependencies for potential issues
    const dependencies = { ...packageJSON.dependencies, ...packageJSON.devDependencies };
    
    // Check for next.js version
    if (dependencies.next) {
      console.log(`✅ Next.js version: ${dependencies.next}`);
    }
    
    // Check for typescript
    if (dependencies.typescript) {
      console.log(`✅ TypeScript version: ${dependencies.typescript}`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error reading package.json:', error.message);
    return false;
  }
}

// Generate a report
function generateReport() {
  const reportPath = path.join(ROOT_DIR, 'reports', 'deployment-verification.md');
  
  const reportContent = `# Deployment Verification Report
  
## Generated on: ${new Date().toISOString()}

## Verification Steps

1. Vercel CLI Installation: ${checkVercelCLI() ? '✅ Installed' : '❌ Not installed'}
2. Vercel Login Status: ${checkVercelLogin() ? '✅ Logged in' : '❌ Not logged in'}
3. Project Link Status: ${checkVercelProject() ? '✅ Linked' : '❌ Not linked'}
4. Configuration: ${checkConfigFiles() ? '✅ Properly configured' : '❌ Configuration issues found'}
5. Package.json: ${checkPackageJSON() ? '✅ Properly configured' : '❌ Issues found'}

## Environment Variables Check

\`\`\`
${execSync('vercel env ls').toString()}
\`\`\`

## Recommendations

1. Ensure all environment variables are properly set in Vercel dashboard
2. If using both next.config.js and next.config.mjs, consolidate to just one
3. Make sure output is set to 'standalone' in Next.js config
4. Verify build command is correctly set in Vercel

## Deployment Commands

\`\`\`bash
# Clear cache and redeploy
vercel deploy --force

# Pull environment variables
vercel env pull .env.production

# Check deployment logs
vercel logs
\`\`\`

See [Vercel Deployment Checklist](.cursor/vercel-deployment-checklist.md) for complete verification steps.
`;

  // Ensure reports directory exists
  if (!fs.existsSync(path.join(ROOT_DIR, 'reports'))) {
    fs.mkdirSync(path.join(ROOT_DIR, 'reports'), { recursive: true });
  }
  
  fs.writeFileSync(reportPath, reportContent);
  console.log(`Report generated: ${reportPath}`);
}

// Main function
async function main() {
  console.log('=== Vercel Deployment Verification ===\n');
  
  checkVercelCLI();
  console.log('');
  
  checkVercelLogin();
  console.log('');
  
  checkVercelProject();
  console.log('');
  
  console.log('Checking environment variables:');
  checkEnvironmentVariables();
  console.log('');
  
  console.log('Checking configuration files:');
  checkConfigFiles();
  console.log('');
  
  console.log('Checking package.json:');
  checkPackageJSON();
  console.log('');
  
  generateReport();
}

// Ensure reports directory exists
if (!fs.existsSync(path.join(ROOT_DIR, 'reports'))) {
  fs.mkdirSync(path.join(ROOT_DIR, 'reports'), { recursive: true });
}

main().catch(err => {
  console.error('Error running deployment verification:', err);
  process.exit(1);
}); 