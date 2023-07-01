import React from "react";
/* import { it, expect } from "@jest/globals"; */
import { render, screen } from "@testing-library/react";
import events from "@testing-library/user-event";

import { BrowserRouter } from "react-router-dom";
import { MemoryRouter, useHistory } from "react-router";
import { Provider } from "react-redux";

import { initStore } from "../../src/client/store";
import { Application } from "../../src/client/Application";
import { CartApi, ExampleApi } from "../../src/client/api";

import { addToCart } from "../../src/client/store";
import { Cart } from "../../src/client/pages/Cart";

describe("в каталоге должны отображаться товары, список которых приходит с сервера", () => {
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

describe("содержимое корзины должно сохраняться между перезагрузками страницы", () => {
  // ! TODO: как обработать перезагрузку страницы
});
