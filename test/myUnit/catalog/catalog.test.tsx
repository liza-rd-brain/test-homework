import React from "react";
/* import { it, expect } from "@jest/globals"; */
import { render, screen } from "@testing-library/react";
import events from "@testing-library/user-event";

import { BrowserRouter } from "react-router-dom";
import { MemoryRouter, useHistory } from "react-router";
import { Provider } from "react-redux";

import { initStore } from "../../../src/client/store";
import { Application } from "../../../src/client/Application";
import { CartApi, ExampleApi } from "../../../src/client/api";

import { addToCart } from "../../../src/client/store";
import { Cart } from "../../../src/client/pages/Cart";

/* describe("в каталоге должны отображаться товары, список которых приходит с сервера", () => {
  //! TODO: как получить товары с сервера, замокать?
});

describe("для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре", () => {
  //! TODO: проверить все с замоканными данныйми??
});

describe("на странице с подробной информацией отображаются: название товара, его описание, цена, цвет, материал и кнопка  'добавить в корзину'", () => {
  //! TODO: по клику кнопки просто перейти на товар или отрисовать товар в изоляции?
});

describe("если товар уже добавлен в корзину, в каталоге и на странице товара должно отображаться сообщение об этом", () => {});

describe("если товар уже добавлен в корзину, повторное нажатие кнопки добавить в корзину должно увеличивать его количество", () => {});
 */
describe("содержимое корзины должно сохраняться между перезагрузками страницы", () => {
  const basename = "/hw/store/catalog";
  // ! TODO: как обработать перезагрузку страницы

  const TEST_AMOUNT = 3;

  it("содержимое корзины должно сохраняться между перезагрузками страницы", async () => {
    const testCartState = {
      0: { name: "name1", count: TEST_AMOUNT, price: 10 },
      1: { name: "name2", count: TEST_AMOUNT, price: 10 },
      2: { name: "name3", count: TEST_AMOUNT, price: 10 },
      3: { name: "name4", count: TEST_AMOUNT, price: 10 },
      4: { name: "name5", count: TEST_AMOUNT, price: 10 },
    };

    const api = new ExampleApi(basename);
    const cart = new CartApi();

    //перезаписала метод!
    cart.getState = () => {
      return testCartState;
    };

    const store = initStore(api, cart);

    const application = (
      <MemoryRouter initialEntries={[basename]}>
        <Provider store={store}>
          <Cart />
        </Provider>
      </MemoryRouter>
    );

    const { getByTestId, unmount } = render(application);

    /*     window.location.reload(); */
    const stateAfterReload = store.getState().cart;
    console.log(stateAfterReload);
  });
});

/* describe("test window location's reload function", () => {
  const original = window.location;

  const reloadFn = () => {
    window.location.reload();
  };

  beforeAll(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { reload: jest.fn() },
    });
  });

  afterAll(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: original,
    });
  });

  it("mocks reload function", () => {
    expect(jest.isMockFunction(window.location.reload)).toBe(true);
  });

  it("calls reload function", () => {
    reloadFn(); // as defined above..
    expect(window.location.reload).toHaveBeenCalled();
  });
});
 */
