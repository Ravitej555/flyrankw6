import { test, expect } from '@playwright/test';

test.describe('Primary User Flow: Buttons with a Brain & AI Route Test', () => {
  test('walks the primary flow end-to-end', async ({ page }) => {
    // 1. Navigate to home
    await page.goto('/');

    // 2. Expect main title
    await expect(page.getByRole('heading', { name: /motion & state micro-interactions/i })).toBeVisible();

    // 3. Find prompt input and enter a valid prompt
    const promptInput = page.getByRole('textbox', { name: /enter your ai prompt/i });
    await expect(promptInput).toBeVisible();
    await promptInput.fill('Evaluate enterprise readiness for Q3 release');

    // 4. Submit via BrainButton
    const sendBtn = page.getByRole('button', { name: /send ai prompt/i });
    await expect(sendBtn).toBeVisible();
    await sendBtn.click();

    // 5. Verify the synthesized message and lead scorecard appear
    await expect(page.getByText(/analyzing enterprise intent/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('region', { name: /structured result for scorelead/i })).toBeVisible({ timeout: 10000 });

    // 6. Test manual state freeze override in Reviewer Chaos Deck
    const errorStateBtn = page.getByRole('button', { name: 'error' });
    await errorStateBtn.click();
    await expect(page.getByText(/failed\. retry\?/i)).toBeVisible();
  });
});
