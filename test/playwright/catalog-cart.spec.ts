import { test, expect } from '@playwright/test';

test.describe("Каталог и корзина", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/hw/store/catalog');
    await page.setViewportSize({ width: 575, height: 1200 });
  });

  // ! BUG_ID === 1 пропадает имя товара в каталоге
  test('#BID-1; в каталоге должны корректно отображаться товары с сервера', async ({ page }) => {
    // * в каталоге должны отображаться товары, список которых приходит с сервера
    // * для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре;
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

  // ! BUG_ID === 9 кнопка add to cart меньше
  test(`#BID-9, добавление товара в корзину (проверка шапки)`, async ({ page }) => {
    await page.goto('http://localhost:3000/hw/store/catalog/0');
    await page.locator('button.ProductDetails-AddToCart.btn.btn-primary.btn-lg').click();
    expect(await page.locator('.Application-Menu > .navbar-nav > a:last-child').textContent()).toBe(`Cart (1)`);
  });

  // ! BUG_ID === "7" не добавляет элемент в корзину просто увеличивает количество
  test(`#BID-7, добавление товара в корзину (проверка корзины)`, async ({ page }) => {
    await page.goto('http://localhost:3000/hw/store/catalog/0');
    await page.locator('button.ProductDetails-AddToCart').click();
    expect(await page.locator('.Application-Menu > .navbar-nav > a:last-child').textContent()).toBe(`Cart (1)`);
    await page.goto('http://localhost:3000/hw/store/cart');
    expect(await page.locator('.Cart-Count').textContent()).toBe("1");
  });

  // ! BUG_ID === "8" неправильного цвета плашка у заказа
  // ! BUG_ID === '5' ломает отправление формы заказа
  // ! BUG_ID === 10 всегда не валидный номер телефона
  test(`#BID-8/5/10, простой сценарий заказа (с учетом статуса заказа)`, async ({ page }) => {
    await page.goto('http://localhost:3000/hw/store/catalog/0');
    await page.locator('button.ProductDetails-AddToCart').click();
    await page.goto('http://localhost:3000/hw/store/cart');
    await page.locator('#f-name').type('User');
    await page.locator('#f-phone').type('89233333333');
    await page.locator('#f-address').type('п2 э9');
    await page.locator('button.Form-Submit').getByText('Checkout').click();

    await new Promise((res) => setTimeout(res, 3000));
    expect(await page.locator('.Cart-SuccessMessage.alert-success').count()).toBe(1);
  });

  // ! BUG_ID === '2' невалидный номер заказа
  // ! BUG_ID === '5' ломает отправление формы заказа
  // ! BUG_ID === 10 всегда не валидный номер телефона
  test(`#BID-2/5/10, простой сценарий заказа (с учетом номера заказа)`, async ({ page }) => {
    await page.goto('http://localhost:3000/hw/store/catalog/0');
    await page.locator('button.ProductDetails-AddToCart').click();
    await page.goto('http://localhost:3000/hw/store/cart');
    await page.locator('#f-name').type('User');
    await page.locator('#f-phone').type('89233333333');
    await page.locator('#f-address').type('п2 э9');
    await page.locator('button.Form-Submit').getByText('Checkout').click();

    await new Promise((res) => setTimeout(res, 3000));
    expect(Number(await page.locator('.Cart-SuccessMessage .Cart-Number').textContent())).toBeLessThan(1000);
  });

  test(`каталог + корзина, добавление товаров должно корректно отражаться на корзину`, async ({ page }) => {
    // # КАТАЛОГ
    // * если товар уже добавлен в корзину, в каталоге и на странице товара должно отображаться сообщение об этом
    // * если товар уже добавлен в корзину, повторное нажатие кнопки "добавить в корзину" должно увеличивать его количество
    // * содержимое корзины должно сохраняться между перезагрузками страницы
    // # КОРЗИНА
    // * в шапке рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней
    // * в корзине должна отображаться таблица с добавленными в нее товарами
    // * для каждого товара должны отображаться: название, цена, кол-во, стоимость, общая сумма
    // * в корзине должна быть кнопка "очистить корзину", по нажатию на которую все товары должны удаляться
    // * если корзина пустая, должна отображаться ссылка на каталог товаров
    // # +++
    // * BUG_ID === 3 всегда отдает 1 товар (детали)
    // * BUG_ID === '5' ломает отправление формы заказа

    await page.goto('http://localhost:3000/hw/store/catalog/0');
    const product0Res = await page.waitForResponse('**/hw/store/api/products/0');
    try {
      const product0 = await product0Res.json() as ({
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
      // корзина отображает кол-во только по типу товаров, т.е. только 1 товар был добавлен
      expect(await page.locator('.Application-Menu > .navbar-nav > a:last-child').textContent()).toBe(`Cart (1)`);

      // добавляем еще 1 тип товара
      await page.goto('http://localhost:3000/hw/store/catalog/1');
      const product1Res = await page.waitForResponse('**/hw/store/api/products/1');
      const product1 = await product1Res.json() as ({
        "id": number,
        "name": string,
        "description": string,
        "price": number,
        "color": string,
        "material": string
      })
      await page.locator('button.ProductDetails-AddToCart').click();
      expect(await page.locator('.Application-Menu > .navbar-nav > a:last-child').textContent()).toBe(`Cart (2)`);

      // перезагрузки страницы не сбрасывают состояние
      await page.goto('http://localhost:3000/hw/store/cart');
      await page.reload();

      expect(await page.locator('tbody > tr:nth-child(1) .Cart-Index').textContent()).toBe("1");
      expect(await page.locator('tbody > tr:nth-child(1) .Cart-Name').textContent()).toBe(product0.name);
      expect(await page.locator('tbody > tr:nth-child(1) .Cart-Price').textContent()).toBe(`$${product0.price}`);
      expect(await page.locator('tbody > tr:nth-child(1) .Cart-Count').textContent()).toBe("4");
      expect(await page.locator('tbody > tr:nth-child(1) .Cart-Total').textContent()).toBe(`$${product0.price * 4}`);

      expect(await page.locator('tbody > tr:nth-child(2) .Cart-Index').textContent()).toBe("2");
      expect(await page.locator('tbody > tr:nth-child(2) .Cart-Name').textContent()).toBe(product1.name);
      expect(await page.locator('tbody > tr:nth-child(2) .Cart-Price').textContent()).toBe(`$${product1.price}`);
      expect(await page.locator('tbody > tr:nth-child(2) .Cart-Count').textContent()).toBe("1");
      expect(await page.locator('tbody > tr:nth-child(2) .Cart-Total').textContent()).toBe(`$${product1.price * 1}`);

      expect(await page.locator('.Cart-OrderPrice').textContent()).toBe(`$${(product0.price * 4) + (product1.price * 1)}`);

      // заказ
      await page.locator('#f-name').type('User');
      await page.locator('#f-phone').type('89233333333');
      await page.locator('#f-address').type('п2 э9');
      await page.locator('button.Form-Submit').getByText('Checkout').click();

      // очистка
      await page.goto('http://localhost:3000/hw/store/catalog/0');
      await page.locator('button.ProductDetails-AddToCart').click();
      await page.goto('http://localhost:3000/hw/store/cart');

      await page.locator('button.Cart-Clear').click();
      expect(await page.locator('div').getByText(/Cart is empty\. Please select products in the/i).count()).toBe(1);
      expect(await page.locator('div.Cart > .row > .col a').getAttribute('href')).toBe('/hw/store/catalog');
    } catch (error) {
      expect(error).toBe(null);
    }
  })
})
