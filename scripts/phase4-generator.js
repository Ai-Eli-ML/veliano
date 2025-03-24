#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the current file path and directory to resolve paths correctly in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setup readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration
const config = {
  features: [
    'reviews',
    'wishlist',
    'email',
    'recommendations',
    'search'
  ],
  outputDir: 'phase4-output',
  templatesDir: './phase4-templates',
  logFile: 'phase4-progress.log'
};

// Create necessary directories
function setupDirectories() {
  const dirs = [
    config.outputDir,
    path.join(config.outputDir, 'migrations'),
    path.join(config.outputDir, 'types'),
    path.join(config.outputDir, 'components'),
    path.join(config.outputDir, 'actions'),
    path.join(config.outputDir, 'repositories'),
    path.join(config.outputDir, 'lib'),
    path.join(config.outputDir, 'app')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
  });
}

// Log progress to file
function logProgress(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  fs.appendFileSync(path.join(config.outputDir, config.logFile), logMessage);
  console.log(message);
}

// Read user input interactively
function promptUser(question) {
  return new Promise((resolve) => {
    rl.question(`> ${question} `, (answer) => {
      logProgress(`User input: ${answer}`);
      resolve(answer);
    });
  });
}

// Create feature selection menu
async function selectFeatures() {
  console.log('\n📋 Phase 4 Feature Selection\n');
  
  const selectedFeatures = [];
  
  for (const feature of config.features) {
    const featureName = feature.charAt(0).toUpperCase() + feature.slice(1);
    const answer = await promptUser(`Include ${featureName} System? (Y/n)`);
    
    if (answer.toLowerCase() !== 'n') {
      selectedFeatures.push(feature);
      logProgress(`Selected feature: ${feature}`);
    }
  }
  
  return selectedFeatures;
}

// Generate database migrations
async function generateMigrations(features) {
  console.log('\n🗃️ Generating database migrations...');
  
  try {
    for (const feature of features) {
      // Instead of parsing .prompt file, read the template files directly
      const templatePath = path.join(config.templatesDir, `${feature}.ts`);
      
      if (fs.existsSync(templatePath)) {
        const templateContent = fs.readFileSync(templatePath, 'utf8');
        
        // Extract the database schema using regex
        const schemaRegex = /export const databaseSchema = `([\s\S]*?)`;/;
        const match = templateContent.match(schemaRegex);
        
        if (match && match[1]) {
          const schemaContent = match[1];
          const filename = `${Date.now()}_add_${feature}_tables.sql`;
          const filePath = path.join(config.outputDir, 'migrations', filename);
          
          fs.writeFileSync(filePath, schemaContent);
          logProgress(`Generated migration: ${filename}`);
        } else {
          logProgress(`⚠️ Could not extract database schema for feature: ${feature}`);
        }
      } else {
        logProgress(`⚠️ Template file not found for feature: ${feature}`);
      }
    }
  } catch (error) {
    console.error('Error generating migrations:', error);
  }
}

// Generate TypeScript type definitions
async function generateTypes(features) {
  console.log('\n📝 Generating TypeScript types...');
  
  try {
    for (const feature of features) {
      // Read the template files directly
      const templatePath = path.join(config.templatesDir, `${feature}.ts`);
      
      if (fs.existsSync(templatePath)) {
        const templateContent = fs.readFileSync(templatePath, 'utf8');
        
        // Extract the TypeScript types using regex
        const typesRegex = /export const typesDefinition = `([\s\S]*?)`;/;
        const match = templateContent.match(typesRegex);
        
        if (match && match[1]) {
          const typesContent = match[1];
          const filename = `${feature}.ts`;
          const filePath = path.join(config.outputDir, 'types', filename);
          
          fs.writeFileSync(filePath, typesContent);
          logProgress(`Generated type definition: ${filename}`);
        } else {
          logProgress(`⚠️ Could not extract type definitions for feature: ${feature}`);
        }
      }
    }
  } catch (error) {
    console.error('Error generating types:', error);
  }
}

// Generate repositories
async function generateRepositories(features) {
  console.log('\n🔄 Generating repositories...');
  
  try {
    for (const feature of features) {
      const templatePath = path.join(config.templatesDir, `${feature}.ts`);
      
      if (fs.existsSync(templatePath)) {
        const templateContent = fs.readFileSync(templatePath, 'utf8');
        
        // Extract the repository code using regex
        let repoRegex;
        if (feature === 'reviews') {
          repoRegex = /export const reviewRepository = `([\s\S]*?)`;/;
        } else if (feature === 'wishlist') {
          repoRegex = /export const wishlistRepository = `([\s\S]*?)`;/;
        } else if (feature === 'email') {
          repoRegex = /export const emailRepository = `([\s\S]*?)`;/;
        } else if (feature === 'recommendations') {
          repoRegex = /export const recommendationsRepository = `([\s\S]*?)`;/;
        } else if (feature === 'search') {
          repoRegex = /export const searchRepository = `([\s\S]*?)`;/;
        }
        
        if (repoRegex) {
          const match = templateContent.match(repoRegex);
          
          if (match && match[1]) {
            const repoContent = match[1];
            const className = feature.charAt(0).toUpperCase() + feature.slice(1) + 'Repository';
            const filename = `${className}.ts`;
            const filePath = path.join(config.outputDir, 'repositories', filename);
            
            fs.writeFileSync(filePath, repoContent);
            logProgress(`Generated repository: ${filename}`);
          } else {
            logProgress(`⚠️ Could not extract repository for feature: ${feature}`);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error generating repositories:', error);
  }
}

// Generate server actions
async function generateServerActions(features) {
  console.log('\n⚡ Generating server actions...');
  
  try {
    for (const feature of features) {
      const templatePath = path.join(config.templatesDir, `${feature}.ts`);
      
      if (fs.existsSync(templatePath)) {
        const templateContent = fs.readFileSync(templatePath, 'utf8');
        
        // Extract the server actions code using regex
        const actionsRegex = /export const serverActions = `([\s\S]*?)`;/;
        const match = templateContent.match(actionsRegex);
        
        if (match && match[1]) {
          const actionsContent = match[1];
          const filename = `${feature}.ts`;
          const filePath = path.join(config.outputDir, 'actions', filename);
          
          fs.writeFileSync(filePath, actionsContent);
          logProgress(`Generated server actions: ${filename}`);
        } else {
          logProgress(`⚠️ Could not extract server actions for feature: ${feature}`);
        }
      }
    }
  } catch (error) {
    console.error('Error generating server actions:', error);
  }
}

// Generate components
async function generateComponents(features) {
  console.log('\n🧩 Generating components...');
  
  try {
    for (const feature of features) {
      const templatePath = path.join(config.templatesDir, `${feature}.ts`);
      
      if (fs.existsSync(templatePath)) {
        const templateContent = fs.readFileSync(templatePath, 'utf8');
        
        // Create component directory
        const componentDir = path.join(config.outputDir, 'components', feature);
        if (!fs.existsSync(componentDir)) {
          fs.mkdirSync(componentDir, { recursive: true });
        }
        
        // Extract different components using regex
        const componentRegexes = [
          { pattern: new RegExp(`export const (\\w+)Component = \`([\\s\\S]*?)\`;`, 'g') },
          { pattern: new RegExp(`export const (\\w+) = \`([\\s\\S]*?)\`;`, 'g') }
        ];
        
        for (const regexObj of componentRegexes) {
          let match;
          while ((match = regexObj.pattern.exec(templateContent)) !== null) {
            const componentName = match[1];
            const componentContent = match[2];
            
            if (componentName && componentContent) {
              const pascalCaseName = componentName
                .replace(/([A-Z])/g, ' $1')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join('');
                
              const filename = `${pascalCaseName}.tsx`;
              const filePath = path.join(componentDir, filename);
              
              fs.writeFileSync(filePath, componentContent);
              logProgress(`Generated component: ${feature}/${filename}`);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error generating components:', error);
  }
}

// Read additional input from the user
async function readAdditionalInput() {
  console.log('\n📝 Additional Configuration\n');
  
  const additionalConfig = {};
  
  additionalConfig.emailProvider = await promptUser('Email service provider to integrate with? (sendgrid/mailchimp/custom)');
  additionalConfig.recommendationAlgorithm = await promptUser('Recommendation algorithm preference? (simple/collaborative/hybrid)');
  additionalConfig.searchImplementation = await promptUser('Search implementation approach? (postgres/elasticsearch/algolia)');
  
  return additionalConfig;
}

// Main execution function
async function main() {
  console.log('🚀 Phase 4 One-Shot Generator\n');
  
  // Setup directory structure
  setupDirectories();
  
  // Select features to implement
  const selectedFeatures = await selectFeatures();
  
  if (selectedFeatures.length === 0) {
    console.log('⚠️ No features selected. Exiting...');
    rl.close();
    return;
  }
  
  // Generate various components in parallel
  await Promise.all([
    generateMigrations(selectedFeatures),
    generateTypes(selectedFeatures)
  ]);
  
  // These depend on types being generated first
  await generateRepositories(selectedFeatures);
  await generateServerActions(selectedFeatures);
  await generateComponents(selectedFeatures);
  
  // Get additional configuration from user
  const additionalConfig = await readAdditionalInput();
  
  // Write configuration to file for the AI to use
  fs.writeFileSync(
    path.join(config.outputDir, 'config.json'), 
    JSON.stringify({ features: selectedFeatures, ...additionalConfig }, null, 2)
  );
  
  console.log('\n✅ Phase 4 setup complete!');
  console.log(`\nConfiguration has been written to ${path.join(config.outputDir, 'config.json')}`);
  console.log('\nGenerated files are in the phase4-output directory. You can now:');
  console.log('1. Review the generated files');
  console.log('2. Apply the database migrations');
  console.log('3. Copy the components, repositories, and server actions to your project');
  
  console.log('\n🚀 The one-shot implementation has completed successfully!');
  rl.close();
}

// Run the main function
main().catch(error => {
  console.error('Error:', error);
  rl.close();
});