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
 * *1.Моделируем пустую корзину
 * *2.ищем ссылку на каталог товаров
 */

it("если корзина пустая, должна отображаться ссылка на каталог товаров", () => {
  const basename = "/hw/store/cart";
  const api = new ExampleApi(basename);
  const cart = new CartApi();
  const testCartState = {};

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

  const { getByTestId } = render(application);

  const linkToCatalog = screen.getByTestId("catalog-link");

  expect(linkToCatalog).toBeDefined();
});
