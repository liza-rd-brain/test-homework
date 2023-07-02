import { test, expect } from '@playwright/test';

test.describe("Общие требования", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/hw/store');
        await page.setViewportSize({ width: 575, height: 1200 });
    });

    test('на ширине меньше 576px навигационное меню должно скрываться за "гамбургер"', async ({ page }) => {
        const hiddenElem = page.locator('div.navbar-nav');
        await expect(hiddenElem).toBeHidden()
    });

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

    test('в шапке отображаются ссылки на страницы магазина, а также ссылка на корзину', async ({ page }) => {
        const exampleStoreEl = page.locator('a.Application-Brand.navbar-brand');
        const catalogEl = page.locator('.navbar-nav > a:nth-child(1)');
        const deliveryEl = page.locator('.navbar-nav > a:nth-child(2)');
        const contactsEl = page.locator('.navbar-nav > a:nth-child(3)');
        const cartEl = page.locator('.navbar-nav > a:nth-child(4)');

        await expect(await exampleStoreEl.getAttribute('href')).toBe('/hw/store/');
        await expect(await catalogEl.getAttribute('href')).toBe('/hw/store/catalog');
        await expect(await deliveryEl.getAttribute('href')).toBe('/hw/store/delivery');
        await expect(await contactsEl.getAttribute('href')).toBe('/hw/store/contacts');
        await expect(await cartEl.getAttribute('href')).toBe('/hw/store/cart');
    })


    test('название магазина в шапке должно быть ссылкой на главную страницу', async ({ page }) => {
        const exampleStoreEl = page.locator('a.Application-Brand.navbar-brand');
        await expect(await exampleStoreEl.getAttribute('href')).toBe('/hw/store/');
    })
})

