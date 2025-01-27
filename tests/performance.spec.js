import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('homepage load performance metrics', async ({ page }) => {
    // Create performance observer
    await page.addInitScript(() => {
      window.performanceMetrics = {};
      
      // Observe LCP
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        window.performanceMetrics.lcp = entries[entries.length - 1].startTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Observe FID
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        window.performanceMetrics.fid = entries[0].processingStart - entries[0].startTime;
      }).observe({ entryTypes: ['first-input'] });

      // Observe CLS
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        window.performanceMetrics.cls = clsValue;
      }).observe({ entryTypes: ['layout-shift'] });
    });

    // Navigate to homepage
    const startTime = Date.now();
    await page.goto('http://localhost:3000');
    const loadTime = Date.now() - startTime;

    // Wait for network to be idle
    await page.waitForLoadState('networkidle');

    // Get performance metrics
    const metrics = await page.evaluate(() => window.performanceMetrics);
    
    // Performance assertions
    expect(loadTime).toBeLessThan(3000); // Page should load within 3 seconds
    expect(metrics.lcp).toBeLessThan(2500); // LCP should be under 2.5 seconds
    expect(metrics.cls).toBeLessThan(0.1); // CLS should be under 0.1
    
    // Get resource timing data
    const resourceTiming = await page.evaluate(() => {
      return performance.getEntriesByType('resource').map(entry => ({
        name: entry.name,
        duration: entry.duration,
        transferSize: entry.transferSize
      }));
    });

    // Log performance results
    console.log({
      pageLoadTime: loadTime,
      largestContentfulPaint: metrics.lcp,
      firstInputDelay: metrics.fid,
      cumulativeLayoutShift: metrics.cls,
      resourceTiming
    });
  });

  test('recipe creation form performance', async ({ page }) => {
    // Navigate to create recipe page
    const navigationStart = Date.now();
    await page.goto('http://localhost:3000/create-recipe');
    const navigationTime = Date.now() - navigationStart;

    // Measure form interaction performance
    const interactionStart = Date.now();
    await page.getByLabel('Recipe Title').fill('Performance Test Recipe');
    await page.getByLabel('Description').fill('Testing form performance');
    await page.getByLabel('Cooking Time (minutes)').fill('30');
    await page.getByLabel('Servings').fill('4');
    const interactionTime = Date.now() - interactionStart;

    // Performance assertions
    expect(navigationTime).toBeLessThan(2000); // Navigation should be under 2 seconds
    expect(interactionTime).toBeLessThan(1000); // Form interactions should be under 1 second
  });
}); 