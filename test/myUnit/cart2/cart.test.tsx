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
 *
 * * если в корзине есть товары - они отображаются
 * * сходятся все поля и все поля на месте
 * * нет товаров - все поля пустые
 * TODO: //жестка завязка на порядок полей
 */

describe("в корзине должна отображаться таблица с добавленными в нее товарами,", () => {
  const basename = "/hw/store";

  const TEST_AMOUNT = 3;
  const CART_AMOUNT = 5;
  const TEST_CART_SUMM = 170;

  //TODO: moke-шаблон?
  const TEST_CART_SUMMary = {
    0: { name: "name1", count: 5, price: 10, total: 50 },
    1: { name: "name2", count: 4, price: 11, total: 44 },
    2: { name: "name3", count: 3, price: 12, total: 36 },
    3: { name: "name4", count: 2, price: 13, total: 26 },
    4: { name: "name5", count: 1, price: 14, total: 14 },
  };

  //TODO:helpers?
  const testCartState = {
    0: { name: "name1", count: 5, price: 10 },
    1: { name: "name2", count: 4, price: 11 },
    2: { name: "name3", count: 3, price: 12 },
    3: { name: "name4", count: 2, price: 13 },
    4: { name: "name5", count: 1, price: 14 },
  };

  /*   let testWithTotal = {};

  for (let itemCartIndex in testCartState) {
    let item = testCartState[itemCartIndex];
    const total = item.count * item.price;
    testWithTotal[itemCartIndex] = {
      ...testCartState[itemCartIndex],
      total: total,
    };
  } */

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

  const { getByTestId } = render(application);

  const total = Object.values(cart).reduce(
    (sum, { count, price }) => sum + count * price,
    0
  );

  //пройти по массиву элементов и превсти объект к стейту
  type Nullable<T> = T | null;

  type RowType = {
    name: Nullable<string>;
    count: Nullable<number>;
    price: Nullable<number>;
    total: Nullable<number>;
  };

  const resTableData: Record<number, RowType> = {};
  const tableElem = screen.getByTestId("table-body");
  const rowList = tableElem.children;

  for (let i = 0; i < rowList.length; i++) {
    type Nullable<T> = T | null;

    type RowType = {
      name: Nullable<string>;
      count: Nullable<number>;
      price: Nullable<number>;
      total: Nullable<number>;
    };

    let currRow: RowType = { name: "", count: 0, price: 0, total: 0 };

    const tableRowList = rowList[i].children;

    currRow.name = tableRowList[1].textContent;

    const value = tableRowList[2]?.textContent?.match(/\d+/)?.[0];
    const price = value ? parseInt(value) : null;
    currRow.price = price;

    currRow.count = Number(tableRowList[3].textContent);

    const totalValue = tableRowList[4]?.textContent?.match(/\d+/)?.[0];
    const total = totalValue ? parseInt(totalValue) : null;
    currRow.total = total;
    resTableData[i] = currRow;
  }

  const tableSummElem = screen.getByTestId("table-summary");
  const totalValue = tableSummElem?.textContent?.match(/\d+/)?.[0];
  const totalSumm = totalValue ? parseInt(totalValue) : null;

  it("добавленные товары корректно отображаются в таблице", () => {
    expect(resTableData).toEqual(TEST_CART_SUMMary);
    expect(totalSumm).toEqual(TEST_CART_SUMM);
  });
});
