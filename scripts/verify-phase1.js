#!/usr/bin/env node

/**
 * Phase 1 Verification Script
 * 
 * This script runs all verification checks for Phase 1 priorities:
 * 1. 404 Error detection
 * 2. Vercel deployment verification
 * 
 * Usage: node scripts/verify-phase1.js
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Create reports directory if it doesn't exist
if (!fs.existsSync(path.join(ROOT_DIR, 'reports'))) {
  fs.mkdirSync(path.join(ROOT_DIR, 'reports'), { recursive: true });
}

// Helper function to run a script
function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    console.log(`\n=== Running ${path.basename(scriptPath)} ===\n`);
    
    const process = spawn('node', [scriptPath], { stdio: 'inherit' });
    
    process.on('close', (code) => {
      if (code === 0) {
        console.log(`\n✅ ${path.basename(scriptPath)} completed successfully.\n`);
        resolve();
      } else {
        console.error(`\n❌ ${path.basename(scriptPath)} failed with code ${code}.\n`);
        resolve(); // Still continue with other checks even if one fails
      }
    });
    
    process.on('error', (err) => {
      console.error(`\n❌ Failed to start ${path.basename(scriptPath)}: ${err}\n`);
      resolve(); // Still continue with other checks even if one fails
    });
  });
}

// Generate summary report
function generateSummaryReport() {
  const reportPath = path.join(ROOT_DIR, 'reports', 'phase1-verification-summary.md');
  const timestamp = new Date().toISOString();
  
  // Check if navigation report exists
  let navigationResults = 'Navigation check was not run or failed to generate a report.';
  try {
    const navReportPath = path.join(ROOT_DIR, 'reports', 'navigation-check.json');
    if (fs.existsSync(navReportPath)) {
      const navReport = JSON.parse(fs.readFileSync(navReportPath, 'utf8'));
      navigationResults = `
- Defined routes: ${navReport.summary.definedRoutes}
- Found links: ${navReport.summary.totalLinks}
- Valid routes: ${navReport.summary.validRoutes}
- Missing routes: ${navReport.summary.missingRoutes}
      `;
      
      if (navReport.missingRoutes.length > 0) {
        navigationResults += '\n\n### Missing Routes:\n';
        navReport.missingRoutes.forEach(route => {
          navigationResults += `- \`${route}\`\n`;
        });
      }
    }
  } catch (error) {
    console.error('Error reading navigation report:', error);
  }
  
  // Check if deployment report exists
  let deploymentResults = 'Deployment verification was not run or failed to generate a report.';
  try {
    const deployReportPath = path.join(ROOT_DIR, 'reports', 'deployment-verification.md');
    if (fs.existsSync(deployReportPath)) {
      deploymentResults = fs.readFileSync(deployReportPath, 'utf8');
      // Extract just the verification steps section to avoid duplication
      const verificationStepsMatch = deploymentResults.match(/## Verification Steps([\s\S]*?)(?=##|$)/);
      if (verificationStepsMatch) {
        deploymentResults = verificationStepsMatch[0];
      }
    }
  } catch (error) {
    console.error('Error reading deployment report:', error);
  }
  
  const reportContent = `# Phase 1 Verification Summary

## Generated on: ${timestamp}

## Navigation Check Summary

${navigationResults}

## Deployment Verification Summary

${deploymentResults}

## Next Steps

1. Address any missing routes identified in the navigation check
   - Update the tracker in \`.cursor/navigation-issues.md\`
   - Create missing page components
   - Fix incorrect links

2. Fix any deployment issues identified
   - Update the checklist in \`.cursor/vercel-deployment-checklist.md\`
   - Address environment variable issues
   - Fix configuration problems

3. Re-run this verification script after making changes to confirm fixes

## References

- [Project Plan](.cursor/project-plan.md) - Phase 1 priorities
- [Navigation Issues Tracker](.cursor/navigation-issues.md)
- [Vercel Deployment Checklist](.cursor/vercel-deployment-checklist.md)
- [Deployment Guide](.cursor/DEPLOY.md)
`;

  fs.writeFileSync(reportPath, reportContent);
  console.log(`Summary report generated: ${reportPath}`);
}

// Main execution
async function main() {
  console.log('=== Phase 1 Verification ===');
  console.log('Running all verification checks for Phase 1 priorities');
  
  // Run navigation check
  await runScript(path.join(__dirname, 'check-navigation.js'));
  
  // Run deployment verification
  await runScript(path.join(__dirname, 'verify-deployment.js'));
  
  // Generate summary report
  generateSummaryReport();
  
  console.log('\n=== Phase 1 Verification Complete ===');
  console.log('Check the reports directory for detailed results.');
  console.log('Summary report: reports/phase1-verification-summary.md');
}

main().catch(err => {
  console.error('Error running Phase 1 verification:', err);
  process.exit(1);
}); 