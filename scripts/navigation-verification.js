/**
 * Navigation Verification Script
 * 
 * This script analyzes the Next.js app router structure and identifies potential
 * navigation issues or missing pages by:
 * 
 * 1. Scanning the app directory for route components
 * 2. Checking navigation components for links
 * 3. Comparing defined routes against referenced routes
 * 
 * Usage: node navigation-verification.js
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Setup __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const APP_DIR = path.join(__dirname, '..', 'app');
const COMPONENTS_DIR = path.join(__dirname, '..', 'components');
const EXPECTED_ROUTES = [
  '/', 
  '/products',
  '/products/[category]',
  '/products/[category]/[id]',
  '/cart',
  '/checkout',
  '/account',
  '/account/orders',
  '/account/settings',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/admin',
  '/admin/products',
  '/admin/orders',
  '/admin/customers',
  '/admin/settings',
  '/about',
  '/contact',
  '/faq',
  '/privacy',
  '/terms',
  '/404',
  '/500',
];

// Utility functions
function findRoutes(dir, basePath = '') {
  const routes = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip specific directories
      if (['api', '_components', 'components', 'lib', 'utils'].includes(entry.name)) {
        continue;
      }
      
      // Handle dynamic routes
      let routeSegment = entry.name;
      if (routeSegment.startsWith('(') && routeSegment.endsWith(')')) {
        // Route group - don't add to the path
        routes.push(...findRoutes(fullPath, basePath));
      } else if (routeSegment.startsWith('[') && routeSegment.endsWith(']')) {
        // Dynamic route parameter
        routes.push(...findRoutes(fullPath, basePath + '/' + routeSegment));
      } else {
        routes.push(...findRoutes(fullPath, basePath + '/' + routeSegment));
      }
    } else {
      // Check if this file defines a route
      if (['page.js', 'page.jsx', 'page.ts', 'page.tsx'].includes(entry.name)) {
        const routePath = basePath || '/';
        routes.push(routePath);
      }
    }
  }
  
  return routes;
}

function findLinksInFiles(dir, extensions = ['.js', '.jsx', '.ts', '.tsx']) {
  const links = new Set();
  const errors = [];
  
  function scanDirectory(directory) {
    try {
      const entries = fs.readdirSync(directory, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);
        
        if (entry.isDirectory()) {
          scanDirectory(fullPath);
        } else if (extensions.some(ext => entry.name.endsWith(ext))) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            
            // Find Link components
            const linkMatches = content.match(/href=["']([^"']+)["']/g) || [];
            
            for (const match of linkMatches) {
              const href = match.match(/href=["']([^"']+)["']/)[1];
              
              // Skip external links, anchor links, or dynamic links with parameters
              if (href.startsWith('http') || href.startsWith('#') || href.includes('{')) {
                continue;
              }
              
              // Add to the collection
              links.add(href);
            }
          } catch (err) {
            errors.push(`Error reading file ${fullPath}: ${err.message}`);
          }
        }
      }
    } catch (err) {
      errors.push(`Error scanning directory ${directory}: ${err.message}`);
    }
  }
  
  scanDirectory(dir);
  
  if (errors.length > 0) {
    console.warn('Warnings during link scanning:');
    errors.forEach(err => console.warn(`  - ${err}`));
  }
  
  return Array.from(links);
}

function normalizePath(path) {
  // Remove query params and hash
  let normalized = path.split('?')[0].split('#')[0];
  
  // Remove trailing slash except for root
  if (normalized !== '/' && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }
  
  return normalized;
}

function checkRoutes() {
  console.log('🔍 Scanning application for routes and links...\n');
  
  // Find actual routes in the app directory
  const definedRoutes = findRoutes(APP_DIR).map(normalizePath);
  console.log(`📋 Defined Routes (${definedRoutes.length}):`);
  definedRoutes.sort().forEach(route => console.log(`  - ${route}`));
  
  // Find links in the components and app directory
  const appLinks = findLinksInFiles(APP_DIR).map(normalizePath);
  const componentLinks = findLinksInFiles(COMPONENTS_DIR).map(normalizePath);
  const allLinks = [...new Set([...appLinks, ...componentLinks])];
  
  console.log(`\n🔗 Links Found in Code (${allLinks.length}):`);
  allLinks.sort().forEach(link => console.log(`  - ${link}`));
  
  // Find missing routes (links that don't have a corresponding route)
  const missingRoutes = allLinks.filter(link => {
    // Skip links with dynamic parameters
    if (link.includes('[') || link.includes(']')) return false;
    
    return !definedRoutes.some(route => {
      // Convert dynamic route params to regex
      const routeRegex = route
        .replace(/\[\[\.\.\.([^\]]+)\]\]/g, '.*') // Catch-all routes
        .replace(/\[([^\]]+)\]/g, '[^/]+'); // Dynamic segments
      
      const regex = new RegExp(`^${routeRegex}$`);
      return regex.test(link);
    });
  });
  
  console.log(`\n❌ Missing Routes (${missingRoutes.length}):`);
  if (missingRoutes.length > 0) {
    missingRoutes.sort().forEach(route => console.log(`  - ${route}`));
  } else {
    console.log('  None found! All links have corresponding routes.');
  }
  
  // Compare against expected routes
  const missingExpectedRoutes = EXPECTED_ROUTES.filter(route => {
    // Skip dynamic routes for direct comparison
    if (route.includes('[') || route.includes(']')) return false;
    
    return !definedRoutes.includes(route);
  });
  
  console.log(`\n📝 Missing Expected Routes (${missingExpectedRoutes.length}):`);
  if (missingExpectedRoutes.length > 0) {
    missingExpectedRoutes.sort().forEach(route => console.log(`  - ${route}`));
  } else {
    console.log('  All expected routes exist!');
  }
  
  // Suggest fixes
  if (missingRoutes.length > 0 || missingExpectedRoutes.length > 0) {
    console.log('\n🛠️ Suggested Fixes:');
    
    const allMissingRoutes = [...new Set([...missingRoutes, ...missingExpectedRoutes])];
    allMissingRoutes.sort().forEach(route => {
      let relativePath = route === '/' ? '/page.tsx' : `${route}/page.tsx`;
      relativePath = relativePath.replace(/^\//, '');
      
      console.log(`  - Create ${path.join('app', relativePath)}`);
    });
  }
  
  return {
    definedRoutes,
    missingRoutes,
    missingExpectedRoutes
  };
}

// Execute check
checkRoutes(); 