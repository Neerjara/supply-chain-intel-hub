import { test, expect } from '@playwright/test';

test.describe('Supply Chain Inventory Management', () => {
  test('User can view inventory analytics dashboard', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page).toHaveTitle(/Supply Chain Intelligence Hub/i);

    // Verify presence of inventory KPI metrics card
    const kpiCard = page.locator('[data-testid="inventory-kpi-card"]');
    await expect(kpiCard).toBeVisible();
  });

  test('User can trigger real-time stock alert check', async ({ page }) => {
    await page.goto('/inventory');
    
    const refreshButton = page.locator('button:has-text("Refresh Inventory")');
    await refreshButton.click();

    const statusBadge = page.locator('[data-testid="stock-sync-status"]');
    await expect(statusBadge).toHaveText(/Synchronized/i);
  });
});
