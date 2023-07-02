import { test, expect } from '@playwright/test';

test.describe("Каталог", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/hw/store/catalog');
        await page.setViewportSize({ width: 575, height: 1200 });
    });

    test('в каталоге должны отображаться товары, список которых приходит с сервера', async ({ page }) => {
        //- в каталоге должны отображаться товары, список которых приходит с сервера;
        //- для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре;
        const res = await page.waitForResponse('**/hw/store/api/products');
        try {
            const data = (await res.json()) as Array<{ id: number; name: string; price: number }>;
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                const cardNameEl = await page//
                    .locator(`.Catalog > .row:last-child > div:nth-child(${i + 1}) .ProductItem-Name`)//
                    .getByText(item.name);
                const cardPrice = await page//
                    .locator(`.Catalog > .row:last-child > div:nth-child(${i + 1}) .ProductItem-Price`)//
                    .getByText(`$${item.price}`);
                const cardLink = await page//
                    .locator(`.Catalog > .row:last-child > div:nth-child(${i + 1}) .ProductItem-DetailsLink`)//
                    .getAttribute('href');

                expect(await cardNameEl.textContent()).toBe(item.name);
                expect(await cardPrice.textContent()).toBe(`$${item.price}`);
                expect(cardLink).toBe(`/hw/store/catalog/${item.id}`);
            }
        } catch (error) {
            expect(error).toBe(null);
        }
    });

    test(`на странице с подробной информацией отображаются: название товара, его описание, цена, цвет, материал и кнопка "добавить в корзину"`, async ({ page }) => {
        await page.goto('http://localhost:3000/hw/store/catalog/0');
        const res = await page.waitForResponse('**/hw/store/api/products/0');
        try {
            const data = await res.json() as ({
                "id": 0,
                "name": "Sleek Chicken",
                "description": "New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016",
                "price": 762,
                "color": "purple",
                "material": "Granite"
            })

            expect((await page.locator('.ProductDetails-Name').textContent())?.toLowerCase()).toBe(data.name.toLowerCase());
            expect((await page.locator('.ProductDetails-Description').textContent())?.toLowerCase()).toBe(data.description.toLowerCase());
            expect((await page.locator('.ProductDetails-Price').textContent())?.toLowerCase()).toBe(`$${data.price}`.toLowerCase());
            expect((await page.locator('.ProductDetails-Color').textContent())?.toLowerCase()).toBe(data.color.toLowerCase());
            expect((await page.locator('.ProductDetails-Material ').textContent())?.toLowerCase()).toBe(data.material.toLowerCase());
            expect(await page.locator('button.ProductDetails-AddToCart').count()).toBe(1)
        } catch (error) {
            expect(error).toBe(null);
        }
    })
})
