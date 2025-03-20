#!/usr/bin/env node

/**
 * This script helps set up environment variables in Vercel
 * Run it with: node scripts/setup-vercel-env.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Required environment variables
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_SITE_URL'
];

// Check if Vercel CLI is installed
function checkVercelCLI() {
  try {
    execSync('npx vercel --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    console.error('Vercel CLI is not installed. Please run: npm install -g vercel');
    return false;
  }
}

// Check if the user is logged in to Vercel
function checkVercelLogin() {
  try {
    execSync('npx vercel whoami', { stdio: 'ignore' });
    return true;
  } catch (error) {
    console.log('You need to log in to Vercel first.');
    execSync('npx vercel login', { stdio: 'inherit' });
    return true;
  }
}

// Link the project to Vercel if not already linked
function linkVercelProject() {
  try {
    // Check if .vercel directory exists
    if (!fs.existsSync(path.join(process.cwd(), '.vercel'))) {
      console.log('Linking project to Vercel...');
      execSync('npx vercel link', { stdio: 'inherit' });
    } else {
      console.log('Project already linked to Vercel.');
    }
    return true;
  } catch (error) {
    console.error('Failed to link project to Vercel:', error.message);
    return false;
  }
}

// Pull environment variables from Vercel
function pullEnvVars() {
  try {
    console.log('Pulling environment variables from Vercel...');
    execSync('npx vercel env pull .env.vercel', { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error('Failed to pull environment variables:', error.message);
    return false;
  }
}

// Read environment variables from a file
function readEnvFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return {};
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const envVars = {};

    content.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^['"]|['"]$/g, '');
        envVars[key] = value;
      }
    });

    return envVars;
  } catch (error) {
    console.error(`Failed to read ${filePath}:`, error.message);
    return {};
  }
}

// Set an environment variable in Vercel
function setEnvVar(key, value, scope = 'production') {
  try {
    console.log(`Setting ${key} in Vercel (${scope})...`);
    execSync(`npx vercel env add ${key} ${scope}`, { input: value, stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Failed to set ${key}:`, error.message);
    return false;
  }
}

// Check if the key exists in the environment variables
function findMissingEnvVars(localEnvVars, vercelEnvVars) {
  const missingVars = [];

  REQUIRED_ENV_VARS.forEach(key => {
    if (!vercelEnvVars[key]) {
      if (localEnvVars[key]) {
        missingVars.push({
          key,
          value: localEnvVars[key],
          status: 'local'
        });
      } else {
        missingVars.push({
          key,
          value: null,
          status: 'missing'
        });
      }
    }
  });

  return missingVars;
}

// Main function
async function main() {
  console.log('Checking Vercel CLI installation...');
  if (!checkVercelCLI()) {
    rl.close();
    return;
  }

  console.log('Checking Vercel login status...');
  if (!checkVercelLogin()) {
    rl.close();
    return;
  }

  console.log('Checking Vercel project link...');
  if (!linkVercelProject()) {
    rl.close();
    return;
  }

  console.log('Reading environment variables...');
  const localEnvVars = readEnvFile(path.join(process.cwd(), '.env'));
  
  pullEnvVars();
  const vercelEnvVars = readEnvFile(path.join(process.cwd(), '.env.vercel'));

  const missingVars = findMissingEnvVars(localEnvVars, vercelEnvVars);

  if (missingVars.length === 0) {
    console.log('All required environment variables are set in Vercel.');
    rl.close();
    return;
  }

  console.log('\nThe following environment variables need to be set in Vercel:');
  missingVars.forEach(({ key, value, status }) => {
    if (status === 'local') {
      console.log(`- ${key} (available in local .env)`);
    } else {
      console.log(`- ${key} (missing in both local .env and Vercel)`);
    }
  });

  const askToSet = () => {
    rl.question('\nDo you want to set these environment variables in Vercel? (y/n) ', (answer) => {
      if (answer.toLowerCase() === 'y') {
        rl.close();
        
        missingVars.forEach(({ key, value, status }) => {
          if (status === 'local') {
            // Set from local .env
            setEnvVar(key, value, 'production');
            setEnvVar(key, value, 'preview');
            setEnvVar(key, value, 'development');
          } else {
            // Prompt for value
            console.log(`\nPlease set ${key} manually using the Vercel dashboard.`);
          }
        });
        
        console.log('\nDone! You may need to redeploy your application for changes to take effect.');
      } else {
        console.log('\nNo environment variables were set. You can set them manually in the Vercel dashboard.');
        rl.close();
      }
    });
  };

  askToSet();
}

main().catch(error => {
  console.error('An error occurred:', error);
  rl.close();
}); 