import { it, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";

import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { initStore } from "../../src/client/store";
import { Application } from "../../src/client/Application";
import { CartApi, ExampleApi } from "../../src/client/api";
import React from "react";
// import * as reduxHooks from 'react-redux'
import { addToCart } from "../../src/client/store";

const basename = "/hw/store";

const api = new ExampleApi(basename);
let cart = new CartApi();
const store = initStore(api, cart);

// jest.mock('react-redux')

it("Проверка количества элементов рядом с корзиной в шапке", () => {
  const application = (
    <BrowserRouter basename={basename}>
      <Provider store={store}>
        <Application />
      </Provider>
    </BrowserRouter>
  );

  const good = {
    id: 1,
    name: "test",
    price: 100,
    description: "test",
    material: "test",
    color: "test",
  };

  const { container } = render(application);

  store.dispatch(addToCart(good));

  const elem = screen.getByTestId("cart-label");

  expect(Object.keys(store.getState().cart).length).toBe(1);
  expect(elem.textContent).toBe("Cart (1)");
});
