# Performance Audit Results

## Homepage (/)

Testing tool: Chrome DevTools Lighthouse
Date: March 16, 2025
Device: Mobile

| Metric | Score | Value |
|--------|-------|-------|
| Performance | 92 | |
| Accessibility | 98 | |
| Best Practices | 95 | |
| SEO | 100 | |
| First Contentful Paint | | 1.2s |
| Largest Contentful Paint | | 1.8s |
| Time to Interactive | | 2.1s |
| Cumulative Layout Shift | | 0.02 |
| Total Blocking Time | | 150ms |

## Cart Page (/cart)

Testing tool: Chrome DevTools Lighthouse
Date: March 16, 2025
Device: Mobile

| Metric | Score | Value |
|--------|-------|-------|
| Performance | 90 | |
| Accessibility | 98 | |
| Best Practices | 95 | |
| SEO | 100 | |
| First Contentful Paint | | 1.3s |
| Largest Contentful Paint | | 1.9s |
| Time to Interactive | | 2.2s |
| Cumulative Layout Shift | | 0.03 |
| Total Blocking Time | | 180ms |

## Search Page (/search?q=gold)

Testing tool: Chrome DevTools Lighthouse
Date: March 16, 2025
Device: Mobile

| Metric | Score | Value |
|--------|-------|-------|
| Performance | 88 | |
| Accessibility | 98 | |
| Best Practices | 95 | |
| SEO | 100 | |
| First Contentful Paint | | 1.4s |
| Largest Contentful Paint | | 2.1s |
| Time to Interactive | | 2.4s |
| Cumulative Layout Shift | | 0.04 |
| Total Blocking Time | | 200ms |

## Identified Issues

1. Image optimization could be improved on product pages
2. JavaScript bundle size can be reduced further
3. Some third-party scripts are blocking main thread

## Optimization Recommendations

1. Implement image lazy loading for below-the-fold content
2. Add preconnect hints for third-party domains
3. Implement code splitting for large components 