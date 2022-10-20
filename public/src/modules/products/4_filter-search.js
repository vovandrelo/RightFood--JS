"use strict";

//====================================================================================================================\\
//============================================ ИМПОРТ НЕОБХОДИМЫХ МОДУЛЕЙ ============================================\\
//====================================================================================================================\\

import createConfig from "./2_createConfig.js";     // Создание конфигурации страницы
import renderTable from "./3_render-table.js";      // Создание таблицы с продуктами
import filterRange from "./5_filter-range.js";      // Создание фильтра с типом продукта
import service from "../service.js";                // Реализация запросов на сервер

//====================================================================================================================\\
//=================================== МОДУЛЬ, ОТВЕЧАЮЩИЙ ЗА ФИЛЬТР С ТИПОМ ПРОДУКТОВ =================================\\
//====================================================================================================================\\

const filterSearch = (page, table, filters, lineHeight, maxHight) => {
    console.log("Создание фильтра с типом продукта: start");
    // Получение необходимых данных:
    const popUpMenu = document.querySelector(".pop-up-menu");   // Блок выпадающего меню
    const search = popUpMenu.querySelector(".search");          // Поле с поиском
    const list = popUpMenu.querySelector(".pop-up-menu__list"); // Список продуктов

    // Событие клика по списку:
    list.addEventListener("click", event => {
        // Если событие произошло на элементе списка, то:
        if (event.target && event.target.classList.contains("pop-up-menu__list-item")) {
            const prodType = event.target.dataset.prodType;     // Получаем тип продукта
            search.value = ucFirst(prodType);                   // Преобразование первой буквы списка в верхний регистр

            // Выполнение запроса на получение данного типа продукта:
            console.log("Выполнение запроса на получение продуктов типа:", prodType);
            service.getData(`/products/type/${prodType}`)
            // При успешном получении указанных продуктов:
            .then(products => {
                createConfig(page, products);                   // Создание конфига на основе полученных продуктов
                renderTable(page, table);                       // Создание таблицы на основе полученных продуктов
                filters.forEach(filter => {                     // Создание фильтров на основе полученных продуктов
                    filterRange(filter, page, table, false);
                });
            })
            // Если при получении продуктов произошла ошибка:
            .catch(err => console.log(err.message));
        }
    });

    // Событие клика по блоку с поиском типов продуктов:
    search.addEventListener("focus", () => {
        // Отрисовка элемента загрузки:
        list.innerHTML = `
            <svg class="spinner" viewBox="0 0 50 50">
                <circle class="spinner__path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
            </svg>
        `;
        list.style.height = `${lineHeight}px`;

        // Выполнение запроса на получение всех типов продукта:
        console.log("Выполнение запроса на получение всех типов продуктов");
        service.getData("/products/types")
        .then(prodTypes => {
            // Отрисовка полученных типов на основе их количества:
            if (prodTypes.length > maxHight) {  list.style.height = `${lineHeight * maxHight}px`; }
            else {                              list.style.height = `${lineHeight * prodTypes.length}px`; }

            prodTypes.forEach((prodType, i) => {
                if (i === 0) {
                    list.innerHTML = `<li class="pop-up-menu__list-item" data-prod-type='${prodType.type}'>${ucFirst(prodType.type)}</li>`;
                } else {
                    list.innerHTML += `<li class="pop-up-menu__list-item" data-prod-type='${prodType.type}'>${ucFirst(prodType.type)}</li>`;
                }
            });
        })
        // Если при получении типов продуктов произошла ошибка:
        .catch(err => console.log(err.message));
    });

    // Событие сброса блока с поиском продукта:
    search.addEventListener("blur", () => {
        // Скрываем меню с продуктами:
        list.style.height = `${0}px`;
    });

    // Функция преобразования первой буквы строки с верхний регистр:
    function ucFirst(str) {
        if (!str) { return str; }                       // Если переданная строка пустая, ничего не произойдёт:
        return str[0].toUpperCase() + str.slice(1);     // Возвращаем преобразованную строку:
    }
    console.log("Создание фильтра с типом продукта: finish");
};


export default filterSearch;