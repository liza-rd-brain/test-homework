import { test, expect } from '@playwright/test';

test.describe("Страницы", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/hw/store');
        await page.setViewportSize({ width: 575, height: 1200 });
    });

    test('в магазине должны быть страницы: главная, каталог, условия доставки, контакты', async ({ page }) => {
        const bodyElements = page.locator('body *');
        const cannotGetEl = page.locator('body pre');
        // главная
        await page.goto('http://localhost:3000/hw/store');
        expect(await bodyElements.count()).not.toBe(1);
        expect(await cannotGetEl.getByText(/$Cannot GET \/hw\/store/i).count()).not.toBe(1);
        // каталог
        await page.goto('http://localhost:3000/hw/store/catalog');
        expect(await bodyElements.count()).not.toBe(1);
        expect(await cannotGetEl.getByText(/$Cannot GET \/hw\/store\/catalog/i).count()).not.toBe(1);
        // условия доставки
        await page.goto('http://localhost:3000/hw/store/delivery');
        expect(await bodyElements.count()).not.toBe(1);
        expect(await cannotGetEl.getByText(/$Cannot GET \/hw\/store\/delivery/i).count()).not.toBe(1);
        // контакты
        await page.goto('http://localhost:3000/hw/store/contacts');
        expect(await bodyElements.count()).not.toBe(1);
        expect(await cannotGetEl.getByText(/$Cannot GET \/hw\/store\/contacts/i).count()).not.toBe(1);
    });

    test('страницы главная должна иметь статическое содержимое', async ({ page }, testInfo) => {
        // главная
        await page.goto('http://localhost:3000/hw/store');
        await expect(page).toHaveScreenshot();
    });

    test('условия доставки должны иметь статическое содержимое', async ({ page }, testInfo) => {
        // условия доставки
        await page.goto('http://localhost:3000/hw/store/delivery');
        await expect(page).toHaveScreenshot();
    });

    test('контакты должны иметь статическое содержимое', async ({ page }, testInfo) => {
        // контакты
        await page.goto('http://localhost:3000/hw/store/contacts');
        await expect(page).toHaveScreenshot();
    });
})

