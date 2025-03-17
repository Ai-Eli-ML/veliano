#!/bin/bash

# Deployment script for Vercel

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "Vercel CLI is not installed. Installing..."
  npm install -g vercel
fi

# Run pre-deployment checks
echo "Running pre-deployment checks..."

# Check for environment variables
echo "Checking environment variables..."
if [ ! -f .env.local ]; then
  echo "Warning: .env.local file not found. Make sure all environment variables are set in Vercel."
else
  echo "Environment variables file found."
fi

# Run build to check for errors
echo "Running build check..."
npm run build

# If build succeeded, proceed with deployment
if [ $? -eq 0 ]; then
  echo "Build successful. Ready to deploy."
  
  # Ask for deployment type
  read -p "Deploy to production? (y/n): " PROD_DEPLOY
  
  if [[ $PROD_DEPLOY == "y" || $PROD_DEPLOY == "Y" ]]; then
    echo "Deploying to production..."
    vercel --prod
  else
    echo "Deploying to preview environment..."
    vercel
  fi
  
  echo "Deployment complete!"
else
  echo "Build failed. Please fix the errors before deploying."
  exit 1
fi 