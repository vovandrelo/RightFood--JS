"use strict";

//====================================================================================================================\\
//================================ МОДУЛЬ, ОТВЕЧАЮЩИЙ ЗА СОЗДАНИЕ ТАБЛИЦЫ С ПРОДУКТАМИ ===============================\\
//====================================================================================================================\\

const renderTable = (page, table) => {
    console.log("Создание таблицы: start");

    // Перебираем каждый продукт:
    page.items.forEach((item, i) => {
        // На первой итерации происходит создание заголовка таблицы:
        if (i === 0) {
            table.innerHTML = `
                <tr class="products__table-titles">
                    <th class="products__table-titleCol">Продукт</th>
                    <th class="products__table-titleCol">Ккал</th>
                    <th class="products__table-titleCol">Бел</th>
                    <th class="products__table-titleCol">Жир</th>
                    <th class="products__table-titleCol">Угл</th>
                    <th class="products__table-titleCol">Гр</th>
                </tr>`;
        }

        // Добавление продуктов, прошедших фильтрацию, в таблицу :
        if ((+item.kcal >= page.kcal.minVal && +item.kcal <= page.kcal.maxVal) &&
            (+item.proteins >= page.proteins.minVal && +item.proteins <= page.proteins.maxVal) &&
            (+item.fats >= page.fats.minVal && +item.fats <= page.fats.maxVal) &&
            (+item.carbohydrates >= page.carbohydrates.minVal && +item.carbohydrates <= page.carbohydrates.maxVal))
        {
            table.innerHTML += `
            <tr class="products__table-titles">
                <td class="products__table-col">${item.name}</td>
                <td class="products__table-col">${item.kcal}</td>
                <td class="products__table-col">${item.proteins}</td>
                <td class="products__table-col">${item.fats}</td>
                <td class="products__table-col">${item.carbohydrates}</td>
                <td class="products__table-col">100</td>
            </tr>
            `;
        }
    });
    console.log("Создание таблицы: finish");
};

export default renderTable;