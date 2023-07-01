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

/**
 * const button = screen.getByRole('button', {name: 'Click Me'})
 */

/**
 * !1.сначала проверить, что количество уникальных товаров отображается:
 * * добавить 1 товар одного вида - в корзине 1
 * * добавить несколько  - того же вида -  в корзине 1
 * * добавить несколько разных видов - релевантная выдача
 * * нет товаров  - пустая корзина
 * ? сверить стейт с картинкой
 */
describe(" в шапке рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней", () => {
  const basename = "/hw/store";

  const api = new ExampleApi(basename);
  const cart = new CartApi();

  const store = initStore(api, cart);

  const initialState = store.getState();

  //TODO: заменить Application на нужный компонент
  const application = (
    <BrowserRouter basename={basename}>
      <Provider store={store}>
        <Application />
      </Provider>
    </BrowserRouter>
  );

  /**
   * ? излишний тест
   */
  /*  it("в корзине лежит один товар одного вида после добавления одного товара ", async () => {
    const storeOneProduct = {
      ...initialState,
      cart: { 1: { name: "name", count: 1, price: 10 } },
    };

    const testPayload = {
      id: 1,
      name: "name",
      price: 10,
      description: "description",
      material: "material",
      color: "color",
    };

    store.dispatch(addToCart(testPayload));

    const stateAfterDispatch = store.getState();

    expect(stateAfterDispatch).toEqual(storeOneProduct);
  });
 */
  it("если в сторе один неповторяющийся товар, то в ui корзины тоже 1 ", () => {
    const TEST_AMOUNT = 1;

    const testCartState = {
      0: { name: "name", count: TEST_AMOUNT, price: 10 },
    };

    const api = new ExampleApi(basename);
    const cart = new CartApi();

    //перезаписала метод!
    cart.getState = () => {
      return testCartState;
    };

    const store = initStore(api, cart);

    const application = (
      <BrowserRouter basename={basename}>
        <Provider store={store}>
          <Application />
        </Provider>
      </BrowserRouter>
    );

    const { getByTestId } = render(application);

    //проверка regexp
    const elemString = screen.getByTestId("cart-link").textContent;
    const value = elemString?.match(/\d+/)?.[0];
    if (value) {
      expect(parseInt(value)).toBe(TEST_AMOUNT);
    } else {
      expect(true).toBe(false);
    }
  });

  it("если в сторе 5 повторяющихся товаров,  в ui корзины 1 ", () => {
    const TEST_AMOUNT = 5;
    const CART_AMOUNT = 1;
    const testCartState = {
      0: { name: "name", count: TEST_AMOUNT, price: 10 },
    };

    const api = new ExampleApi(basename);
    const cart = new CartApi();

    //перезаписала метод!
    cart.getState = () => {
      return testCartState;
    };

    const store = initStore(api, cart);

    const application = (
      <BrowserRouter basename={basename}>
        <Provider store={store}>
          <Application />
        </Provider>
      </BrowserRouter>
    );

    const { getByTestId } = render(application);

    //проверка regexp
    const elemString = screen.getByTestId("cart-link").textContent;
    const value = elemString?.match(/\d+/)?.[0];
    if (value) {
      expect(parseInt(value)).toBe(CART_AMOUNT);
    } else {
      expect(true).toBe(false);
    }
  });

  it("если в сторе 5 неповторяющихся товаров,в ui корзины 5 ", () => {
    const TEST_AMOUNT = 3;
    const CART_AMOUNT = 5;

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
      <BrowserRouter basename={basename}>
        <Provider store={store}>
          <Application />
        </Provider>
      </BrowserRouter>
    );

    const { getByTestId } = render(application);

    //проверка regexp
    const elemString = screen.getByTestId("cart-link").textContent;
    const value = elemString?.match(/\d+/)?.[0];
    if (value) {
      expect(parseInt(value)).toBe(CART_AMOUNT);
    } else {
      expect(true).toBe(false);
    }
  });

  it("если в сторе нет товаров,в ui корзины тоже пусто ", () => {
    const CART_NAME = "Cart";
    const api = new ExampleApi(basename);
    const cart = new CartApi();
    const store = initStore(api, cart);

    const application = (
      <BrowserRouter basename={basename}>
        <Provider store={store}>
          <Application />
        </Provider>
      </BrowserRouter>
    );

    const { getByTestId } = render(application);

    //проверка regexp
    const elemString = screen.getByTestId("cart-link").textContent;
    const value = elemString?.match(/\d+/)?.[0];
    expect(value).toBe(undefined);
  });
});

/**
 * * если в корзине есть товары - они отображаются
 * * сходятся все поля и все поля на месте
 * * нет товаров - все поля пустые
 */

describe("в корзине должна отображаться таблица с добавленными в нее товарами,", () => {
  const basename = "/hw/store";

  const TEST_AMOUNT = 3;
  const CART_AMOUNT = 5;

  //TODO: moke-шаблон?
  const testCartState = {
    0: { name: "name1", count: 5, price: 10 },
    1: { name: "name2", count: 4, price: 11 },
    2: { name: "name3", count: 3, price: 12 },
    3: { name: "name4", count: 2, price: 13 },
    4: { name: "name5", count: 1, price: 14 },
  };

  const api = new ExampleApi(basename);
  const cart = new CartApi();

  //перезаписала метод!
  cart.getState = () => {
    return testCartState;
  };

  const store = initStore(api, cart);

  const application = (
    <BrowserRouter basename={basename}>
      <Provider store={store}>
        <Cart />
      </Provider>
    </BrowserRouter>
  );
});

/**
 * ? BUG_ID=8
 * *1.Кнопка должна быть в корзине кнопка очистить корзину
 * *2.Нажимаем на нее =>товары удаляются
 */

describe("если корзина пустая, должна отображаться ссылка на каталог товаров", () => {});
