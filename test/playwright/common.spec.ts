import { test, expect } from '@playwright/test';

test.describe("", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/hw/store');
        await page.setViewportSize({ width: 575, height: 1200 });
    });

    test('на ширине меньше 576px навигационное меню должно скрываться за "гамбургер"', async ({ page }) => {
        await page.goto('http://localhost:3000/hw/store');
        await page.setViewportSize({ width: 575, height: 1200 });
        const hiddenElem = page.locator('div.navbar-nav');
        await expect(hiddenElem).toBeHidden()
    });

    //TODO: как проверить
    //Проверить клик по всем ссылкам?
    test("при выборе элемента из` меню гамбургера, меню должно закрываться", async ({ page }) => {
        await expect(page).toHaveTitle(/Example store/);
        const burgerEl = page.locator('button.navbar-toggler');
        //кликаем по кнопке, меню открывается
        //выбираем ссылку закрывается
        await burgerEl.click({ force: true })
        const navListEl = page.locator('a.nav-link').first();
        await navListEl.click({ force: true })
        const hiddenElem = page.locator('div.navbar-nav');
        await expect(hiddenElem).toBeHidden();

    })
})

