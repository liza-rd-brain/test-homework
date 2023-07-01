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
 * ? BUG_ID=8
 * *1.Кнопка должна быть в корзине кнопка очистить корзину
 * *2.Нажимаем на нее =>товары удаляются
 */
describe("в корзине должна быть кнопка 'очистить корзину', по нажатию на которую все товары должны удаляться", () => {
  const basename = "/hw/store/cart";

  it("кнопка для очистки очищает корзину", async () => {
    //моделирую непустую корзину
    const TEST_AMOUNT = 1;
    const BTN_TEXT = "Clear shopping cart";

    const api = new ExampleApi(basename);
    const cart = new CartApi();

    cart.getState = () => {
      return testCartState;
    };

    const testCartState = {
      0: { name: "name1", count: 5, price: 10 },
      1: { name: "name2", count: 4, price: 11 },
      2: { name: "name3", count: 3, price: 12 },
      3: { name: "name4", count: 2, price: 13 },
      4: { name: "name5", count: 1, price: 14 },
    };

    const emptyCartState = {};

    const store = initStore(api, cart);

    //! TODO: так нормально?
    const application = (
      <MemoryRouter initialEntries={[basename]}>
        <Provider store={store}>
          <Cart />
        </Provider>
      </MemoryRouter>
    );

    const { getByTestId } = render(application);

    const clearButton = screen.getByTestId("button-clear");
    expect(clearButton.textContent).toBe(BTN_TEXT);

    //после клика очищается вся корзина
    await events.click(getByTestId("button-clear"));
    const stateAfterClearCart = store.getState().cart;
    expect(stateAfterClearCart).toEqual(emptyCartState);
  });
});
