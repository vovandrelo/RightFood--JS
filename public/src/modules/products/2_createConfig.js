"use strict";

//====================================================================================================================\\
//========================= МОДУЛЬ, ОТВЕЧАЮЩИЙ ЗА СОЗДАНИЕ КОНФИГУРАЦИИ СТРАНИЦЫ С ПРОДУКТАМИ ========================\\
//====================================================================================================================\\

const createConfig = (page, products) => {
    console.log("Создание конфигурации страницы: start");
    page.items = products;                                                                                                                          // Присвоение продуктов
    page.kcal.minVal = Math.floor(products.reduce((acc, curr) => +acc.kcal < +curr.kcal ? acc : curr).kcal);                                        // Вычисление минимального количества калорий
    page.kcal.maxVal = Math.ceil(products.reduce((acc, curr) => +acc.kcal > +curr.kcal ? acc : curr).kcal);                                         // Вычисление максимального количества калорий
    page.proteins.minVal = Math.floor(products.reduce((acc, curr) => +acc.proteins < +curr.proteins ? acc : curr).proteins);                        // Вычисление минимального количества белков
    page.proteins.maxVal = Math.ceil(products.reduce((acc, curr) => +acc.proteins > +curr.proteins ? acc : curr).proteins);                         // Вычисление максимального количества белков
    page.fats.minVal = Math.floor(products.reduce((acc, curr) => +acc.fats < +curr.fats ? acc : curr).fats);                                        // Вычисление минимального количества жиров
    page.fats.maxVal = Math.ceil(products.reduce((acc, curr) => +acc.fats > +curr.fats ? acc : curr).fats);                                         // Вычисление максимального количества жирой
    page.carbohydrates.minVal = Math.floor(products.reduce((acc, curr) => +acc.carbohydrates < +curr.carbohydrates ? acc : curr).carbohydrates);    // Вычисление минимального количества углеводов
    page.carbohydrates.maxVal = Math.ceil(products.reduce((acc, curr) => +acc.carbohydrates > +curr.carbohydrates ? acc : curr).carbohydrates);     // Вычисление максимального количества углеводов
    console.log("Создание конфигурации страницы: finish");
};

export default createConfig;