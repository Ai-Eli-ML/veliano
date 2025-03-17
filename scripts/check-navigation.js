#!/usr/bin/env node

/**
 * Navigation Path Checker
 * 
 * This script scans the Next.js application to identify potential 404 errors by:
 * 1. Listing all folder-based routes in the app/ directory
 * 2. Finding all links in components and pages
 * 3. Comparing links to ensure they have corresponding routes
 * 
 * Usage: node scripts/check-navigation.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const APP_DIR = path.join(ROOT_DIR, 'app');

// Routes that are built-in or API routes that don't need pages
const EXPECTED_MISSING_ROUTES = [
  '/api/', 
  '/_next',
  '/fonts/',
  '/assets/',
  '/images/',
];

// Track results
const results = {
  validRoutes: [],
  missingRoutes: [],
  allDefinedRoutes: [],
  possibleLinkTargets: []
};

// Extract router paths from the app directory
function scanAppDirectory(dir = APP_DIR, basePath = '') {
  const items = fs.readdirSync(dir);
  
  // If this directory has a page.tsx, it's a valid route
  if (items.includes('page.tsx') || items.includes('page.js')) {
    results.allDefinedRoutes.push(basePath || '/');
  }
  
  // Scan subdirectories
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Skip special Next.js directories that aren't actual routes
      if (item.startsWith('_') || item === 'api' || item.startsWith('(')) {
        continue;
      }
      
      // Build the route path and scan the subdirectory
      const routePath = basePath ? `${basePath}/${item}` : `/${item}`;
      scanAppDirectory(itemPath, routePath);
    }
  }
}

// Find all hrefs in file content
function extractLinks(content) {
  const hrefRegex = /href=["']([^"']+)["']/g;
  const links = [];
  let match;
  
  while ((match = hrefRegex.exec(content)) !== null) {
    let link = match[1];
    
    // Skip external links, image links, and anchors
    if (link.startsWith('http') || 
        link.startsWith('#') || 
        link.includes('.jpg') || 
        link.includes('.png') || 
        link.includes('.svg') || 
        link.includes('.webp')) {
      continue;
    }
    
    // Handle dynamic routes by replacing [param] with :param
    link = link.replace(/\[([^\]]+)\]/g, ':$1');
    
    // Strip query parameters
    link = link.split('?')[0];
    
    links.push(link);
  }
  
  return links;
}

// Find all links in files
function findAllLinks(dirPath, fileExtensions = ['.tsx', '.jsx', '.js', '.ts']) {
  const allLinks = new Set();
  
  function scanDir(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        scanDir(itemPath);
      } else if (fileExtensions.some(ext => item.endsWith(ext))) {
        const content = fs.readFileSync(itemPath, 'utf8');
        const links = extractLinks(content);
        links.forEach(link => allLinks.add(link));
      }
    }
  }
  
  scanDir(dirPath);
  return [...allLinks];
}

// Check if a link has a corresponding route
function validateLink(link) {
  // Handle trailing slashes consistency
  const normalizedLink = link.endsWith('/') ? link.slice(0, -1) : link;
  
  // Return true if it's a known route or expected to be missing
  if (results.allDefinedRoutes.includes(normalizedLink) || 
      results.allDefinedRoutes.includes(normalizedLink + '/')) {
    results.validRoutes.push(link);
    return true;
  }
  
  // Skip expected missing routes
  if (EXPECTED_MISSING_ROUTES.some(prefix => link.startsWith(prefix))) {
    return true;
  }
  
  // Check if it's a dynamic route pattern
  const isDynamicRoute = results.allDefinedRoutes.some(route => {
    const dynamicPattern = route.replace(/:[^/]+/g, '.*');
    const regexPattern = new RegExp(`^${dynamicPattern}$`);
    return regexPattern.test(normalizedLink);
  });
  
  if (isDynamicRoute) {
    results.validRoutes.push(link);
    return true;
  }
  
  // It's missing
  results.missingRoutes.push(link);
  return false;
}

// Generate output report
function generateReport() {
  console.log('=== Navigation Path Check Report ===');
  console.log(`\nTotal defined routes: ${results.allDefinedRoutes.length}`);
  console.log(`Total links found: ${results.possibleLinkTargets.length}`);
  console.log(`Valid routes: ${results.validRoutes.length}`);
  console.log(`Potentially missing routes: ${results.missingRoutes.length}`);
  
  if (results.missingRoutes.length > 0) {
    console.log('\n=== Potentially Missing Routes ===');
    results.missingRoutes.sort().forEach(route => {
      console.log(`- ${route}`);
    });
  }
  
  // Write the full detailed report to a file
  const reportData = {
    timestamp: new Date().toISOString(),
    summary: {
      definedRoutes: results.allDefinedRoutes.length,
      totalLinks: results.possibleLinkTargets.length,
      validRoutes: results.validRoutes.length,
      missingRoutes: results.missingRoutes.length
    },
    definedRoutes: results.allDefinedRoutes.sort(),
    missingRoutes: results.missingRoutes.sort()
  };
  
  fs.writeFileSync(
    path.join(ROOT_DIR, 'reports', 'navigation-check.json'),
    JSON.stringify(reportData, null, 2)
  );
  
  console.log('\nDetailed report written to reports/navigation-check.json');
}

// Main execution
async function main() {
  console.log('Scanning app directory for defined routes...');
  scanAppDirectory();
  
  console.log('Finding all links in components and pages...');
  results.possibleLinkTargets = findAllLinks(ROOT_DIR, ['.tsx', '.jsx', '.js']);
  
  console.log('Validating links against defined routes...');
  results.possibleLinkTargets.forEach(validateLink);
  
  generateReport();
}

// Ensure reports directory exists
if (!fs.existsSync(path.join(ROOT_DIR, 'reports'))) {
  fs.mkdirSync(path.join(ROOT_DIR, 'reports'), { recursive: true });
}

main().catch(err => {
  console.error('Error running navigation check:', err);
  process.exit(1);
}); 