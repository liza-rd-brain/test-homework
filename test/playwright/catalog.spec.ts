import { test, expect } from '@playwright/test';

test.describe("Каталог", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/hw/store/catalog');
    await page.setViewportSize({ width: 575, height: 1200 });
  });

  test('в каталоге должны отображаться товары, список которых приходит с сервера', async ({ page }) => {
    // + для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре;
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
        "id": number,
        "name": string,
        "description": string,
        "price": number,
        "color": string,
        "material": string
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
  });

  test(`если товар уже добавлен в корзину, в каталоге и на странице товара должно отображаться сообщение об этом`, async ({ page }) => {
    // + если товар уже добавлен в корзину, повторное нажатие кнопки "добавить в корзину" должно увеличивать его количество
    // + содержимое корзины должно сохраняться между перезагрузками страницы
    await page.goto('http://localhost:3000/hw/store/catalog/0');
    const res = await page.waitForResponse('**/hw/store/api/products/0');
    try {
      const data = await res.json() as ({
        "id": number,
        "name": string,
        "description": string,
        "price": number,
        "color": string,
        "material": string
      })

      await page.locator('button.ProductDetails-AddToCart').click();
      expect(await page.locator('.CartBadge.text-success').count()).toBe(1);
      await page.goto('http://localhost:3000/hw/store/catalog');
      expect(await page.locator('.Catalog > .row:last-child > div:nth-child(1) .CartBadge.text-success').count()).toBe(1);

      // одно нажатие -- один товар в корзине
      await page.goto('http://localhost:3000/hw/store/cart');
      expect(await page.locator('.Cart-Count').textContent()).toBe("1");

      await page.goto('http://localhost:3000/hw/store/catalog/0');
      await page.locator('button.ProductDetails-AddToCart').click();
      await page.locator('button.ProductDetails-AddToCart').click();
      await page.locator('button.ProductDetails-AddToCart').click();

      // +3 нажатия -- 4 товар в корзине
      await page.goto('http://localhost:3000/hw/store/cart');
      expect(await page.locator('.Cart-Count').textContent()).toBe("4");

      // перезагрузки страницы не сбрасывают состояние
      await page.reload();
      expect(await page.locator('.Cart-Index').textContent()).toBe("1");
      expect(await page.locator('.Cart-Name').textContent()).toBe(data.name);
      expect(await page.locator('.Cart-Price').textContent()).toBe(`$${data.price}`);
      expect(await page.locator('.Cart-Count').textContent()).toBe("4");
      expect(await page.locator('.Cart-OrderPrice').textContent()).toBe(`$${data.price * 4}`);
      expect(await page.locator('.Cart-Total').textContent()).toBe(`$${data.price * 4}`);
    } catch (error) {
      expect(error).toBe(null);
    }
  })
})
