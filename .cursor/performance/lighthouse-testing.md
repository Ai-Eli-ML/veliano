# Lighthouse Testing Guide

## Running Lighthouse Audits

### Using Chrome DevTools:
1. Open Chrome DevTools (F12 or Ctrl+Shift+I)
2. Go to the "Lighthouse" tab
3. Select the categories to audit:
   - Performance
   - Accessibility
   - Best Practices
   - SEO
4. Choose "Mobile" or "Desktop" device
5. Click "Analyze page load"

### Using Vercel Analytics:
If deployed on Vercel, check the Analytics dashboard for performance metrics.

## Key Metrics to Monitor

### Core Web Vitals
- **Largest Contentful Paint (LCP)**: 
  - Good: ≤ 2.5s
  - Needs Improvement: > 2.5s to ≤ 4.0s
  - Poor: > 4.0s

- **First Input Delay (FID)**: 
  - Good: ≤ 100ms
  - Needs Improvement: > 100ms to ≤ 300ms
  - Poor: > 300ms

- **Cumulative Layout Shift (CLS)**:
  - Good: ≤ 0.1
  - Needs Improvement: > 0.1 to ≤ 0.25
  - Poor: > 0.25

### Other Important Metrics
- **First Contentful Paint (FCP)**
- **Time to Interactive (TTI)**
- **Total Blocking Time (TBT)**
- **Speed Index**

## Common Issues to Fix

### Performance
- Excessive JavaScript
- Render-blocking resources
- Large image files
- Inefficient loading of third-party scripts
- Missing image dimensions
- Inefficient cache policy

### Accessibility
- Insufficient color contrast
- Missing alt text on images
- Missing form labels
- Missing ARIA attributes
- Non-descriptive link text

### Best Practices
- HTTP instead of HTTPS
- Outdated libraries with known vulnerabilities
- Console errors
- Improper image aspect ratios

### SEO
- Missing meta descriptions
- Non-descriptive link text
- Non-crawlable links
- Missing robots.txt
- Not mobile friendly

## Project-Specific Metrics

| Page | LCP Baseline | TTI Baseline | Notes |
|------|-------------|-------------|-------|
| Home | TBD | TBD | Check hero image optimization |
| Product Listing | TBD | TBD | Monitor pagination performance |
| Product Detail | TBD | TBD | Check image gallery performance |
| Cart | TBD | TBD | Monitor state updates |
| Checkout | TBD | TBD | Focus on form performance |

## Improvement Tracking

After each optimization, record the metrics to track progress: 