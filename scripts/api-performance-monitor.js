// API Performance Monitor for Next.js
// Save this file in a scripts folder and run with: node scripts/api-performance-monitor.js

const http = require('http');
const https = require('https');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
  routes: [
    { path: '/api/webhooks/stripe', method: 'POST', payload: { test: true } },
    { path: '/api/metrics', method: 'POST', payload: { metric: 'test', value: 1, page: '/', timestamp: Date.now() } },
    // Add more routes as needed
  ],
  iterations: 5,
  logFile: './api-performance-results.json',
  timeout: 10000, // 10 seconds
};

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Function to make HTTP requests with timing
async function testEndpoint(route) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const isHttps = config.baseUrl.startsWith('https');
    const client = isHttps ? https : http;
    
    const url = new URL(route.path, config.baseUrl);
    
    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname,
      method: route.method,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: config.timeout,
    };

    const req = client.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        resolve({
          route: route.path,
          method: route.method,
          statusCode: res.statusCode,
          duration: duration,
          data: data.substring(0, 100) + (data.length > 100 ? '...' : ''),
          timestamp: new Date().toISOString(),
        });
      });
    });
    
    req.on('error', (error) => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      resolve({
        route: route.path,
        method: route.method,
        statusCode: 0,
        duration: duration,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    });
    
    req.on('timeout', () => {
      req.abort();
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      resolve({
        route: route.path,
        method: route.method,
        statusCode: 0,
        duration: duration,
        error: 'Request timed out',
        timestamp: new Date().toISOString(),
      });
    });
    
    if (route.method !== 'GET' && route.payload) {
      req.write(JSON.stringify(route.payload));
    }
    
    req.end();
  });
}

// Function to print results to console
function printResult(result) {
  const statusColor = result.statusCode >= 200 && result.statusCode < 300 
    ? colors.green 
    : colors.red;
  
  const durationColor = result.duration < 300 
    ? colors.green 
    : result.duration < 1000 
      ? colors.yellow 
      : colors.red;
  
  console.log(`${colors.blue}[${result.timestamp}]${colors.reset} ${result.method} ${result.route}`);
  console.log(`  Status: ${statusColor}${result.statusCode || 'ERROR'}${colors.reset}`);
  console.log(`  Duration: ${durationColor}${result.duration}ms${colors.reset}`);
  
  if (result.error) {
    console.log(`  Error: ${colors.red}${result.error}${colors.reset}`);
  }
  
  console.log('');
}

// Function to save results to log file
function saveResults(results) {
  const logDir = path.dirname(config.logFile);
  
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  let existingData = [];
  if (fs.existsSync(config.logFile)) {
    try {
      existingData = JSON.parse(fs.readFileSync(config.logFile, 'utf8'));
    } catch (e) {
      console.log(`${colors.yellow}Warning: Could not parse existing log file. Creating new file.${colors.reset}`);
    }
  }
  
  const allResults = [...existingData, ...results];
  fs.writeFileSync(config.logFile, JSON.stringify(allResults, null, 2));
  console.log(`${colors.green}Results saved to ${config.logFile}${colors.reset}`);
}

// Main function
async function main() {
  console.log(`${colors.cyan}======= API Performance Monitor =======${colors.reset}`);
  console.log(`Base URL: ${config.baseUrl}`);
  console.log(`Testing ${config.routes.length} routes, ${config.iterations} iterations each`);
  console.log('');
  
  const allResults = [];
  
  for (const route of config.routes) {
    console.log(`${colors.magenta}Testing ${route.method} ${route.path}${colors.reset}`);
    
    for (let i = 0; i < config.iterations; i++) {
      console.log(`  Iteration ${i + 1}/${config.iterations}`);
      const result = await testEndpoint(route);
      printResult(result);
      allResults.push(result);
    }
  }
  
  // Calculate statistics
  console.log(`${colors.cyan}======= Summary =======${colors.reset}`);
  
  const routeStats = {};
  
  for (const result of allResults) {
    const routeKey = `${result.method} ${result.route}`;
    
    if (!routeStats[routeKey]) {
      routeStats[routeKey] = {
        count: 0,
        totalDuration: 0,
        successes: 0,
        failures: 0,
        durations: [],
      };
    }
    
    routeStats[routeKey].count++;
    routeStats[routeKey].totalDuration += result.duration;
    routeStats[routeKey].durations.push(result.duration);
    
    if (result.statusCode >= 200 && result.statusCode < 300) {
      routeStats[routeKey].successes++;
    } else {
      routeStats[routeKey].failures++;
    }
  }
  
  for (const [route, stats] of Object.entries(routeStats)) {
    const avgDuration = stats.totalDuration / stats.count;
    const successRate = (stats.successes / stats.count) * 100;
    
    // Calculate median duration
    stats.durations.sort((a, b) => a - b);
    const medianDuration = stats.durations[Math.floor(stats.durations.length / 2)];
    
    // Calculate p95 duration
    const p95Index = Math.ceil(stats.durations.length * 0.95) - 1;
    const p95Duration = stats.durations[p95Index];
    
    console.log(`${colors.magenta}${route}${colors.reset}`);
    console.log(`  Requests: ${stats.count}`);
    console.log(`  Success Rate: ${successRate.toFixed(1)}%`);
    console.log(`  Avg Duration: ${avgDuration.toFixed(1)}ms`);
    console.log(`  Median Duration: ${medianDuration}ms`);
    console.log(`  P95 Duration: ${p95Duration}ms`);
    console.log('');
  }
  
  // Save results to file
  await saveResults(allResults);
}

// Execute main function
main().catch(error => {
  console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
  process.exit(1);
}); 