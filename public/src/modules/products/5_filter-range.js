"use strict";

//====================================================================================================================\\
//============================================ ИМПОРТ НЕОБХОДИМЫХ МОДУЛЕЙ ============================================\\
//====================================================================================================================\\

import renderTable from "./3_render-table.js";                  // Создание таблицы с продуктами

//====================================================================================================================\\
//======================================= МОДУЛЬ, ОТВЕЧАЮЩИЙ ЗА ФИЛЬТРАЦИЮ КБЖУ ======================================\\
//====================================================================================================================\\

const filterRange = (filter, page, table, newPage = true) => {

    console.log("Создание фильтра с ползунками: start");

//====================================================================================================================\\
//============================================== ОПРЕДЕЛЕНИЕ ТИПА ФИЛЬТРА ============================================\\
//====================================================================================================================\\

    let curFilt = null;
    if (filter.dataset.filterType === "kcal") {                 // Если фильтр отвечает за фильтрацию калорий, то:
        curFilt = page.kcal;                                    // Определяем min/max значение калорий
    } else if (filter.dataset.filterType === "proteins") {      // Если фильтр отвечает за фильтрацию белков, то:
        curFilt = page.proteins;                                // Определяем min/max значение белков
    } else if (filter.dataset.filterType === "fats") {          // Если фильтр отвечает за фильтрацию жиров, то:
        curFilt = page.fats;                                    // Определяем min/max значение жиров
    } else if (filter.dataset.filterType === "carbohydrates") { // Если фильтр отвечает за фильтрацию углеводов, то:
        curFilt = page.carbohydrates;                           // Определяем min/max значение углеводов
    }

//====================================================================================================================\\
//============================================ ПОЛУЧЕНИЕ НЕОБХОДИМЫХ ДАННЫХ ==========================================\\
//====================================================================================================================\\
 
/* <================================== ПОЛУЧЕНИЕ НЕОБХОДИМЫХ ДАННЫХ ДЛЯ ТУМБЛЕРОВ ==================================> */

    const leftToggle = filter.querySelector('[data-type-toggle="left"]');   // Левый тумблер
    const rightToggle = filter.querySelector('[data-type-toggle="right"]'); // Правый тумблер
    const toggleWidth = leftToggle.offsetWidth;                             // Подсчёт ширины переключателя:
    const minPos = 0;                                                       // Крайнее левое положение
    const maxPos = filter.offsetWidth;                                      // Крайнее правое положение
    let toggleLeftPos = minPos;                                             // Начальное левое полржение
    let toggleRightPos = maxPos;                                            // Начальное правое положение
    let activeToggle = "none";                                              // Активный переключатель:

/* <================================= ПОЛУЧЕНИЕ НЕОБХОДИМЫХ ДАННЫХ ДЛЯ ПОЛЕЙ ВВОДА =================================> */

    // Получение необходимых полей ввода:
    const leftInput = filter.querySelector('[data-type-input="left"]');     // Левое поле ввода
    const rightInput = filter.querySelector('[data-type-input="right"]');   // Правое поле ввода
    const minValue = curFilt.minVal;                                        // Минимальное значение
    const maxValue = curFilt.maxVal;                                        // Максимальное значение
    let leftInputValue = minValue;                                          // Начальное минимальное значение
    let rightInputValue = maxValue;                                         // Начальное максимальное значение
    leftInput.value = leftInputValue;                                       // Установка левого начального значения
    rightInput.value = rightInputValue;                                     // Установка правого начального значения
    let activeInput = "none";                                               // Активное поле ввода:

    // Подсчёт минимально-возможной разницы значений:
    const minDiff = Math.ceil((maxValue-minValue) * (toggleWidth / filter.offsetWidth));


/* <=================================== ПОЛУЧЕНИЕ НЕОБХОДИМЫХ ДАННЫХ ДЛЯ АНИМАЦИИ ==================================> */

    const leftScale = filter.querySelector('[data-type-scale="left"]');     // Получение левой анимационной шкалы
    const rightScale = filter.querySelector('[data-type-scale="right"]');   // Получение праввой анимационной шкалы
    
    // Задание начального положения и ширины анимационных шкал
    leftScale.style.left = "0px";
    rightScale.style.right = "0px";
    leftScale.style.width = "0px";
    rightScale.style.width = "0px";


/* <================================================================================================================> */
/* <======================================== РЕАЛИЗАЦИЯ НЕОБХОДИМЫХ ФУНКЦИЙ ========================================> */
/* <================================================================================================================> */

/* <================================= ЗАДАНИЕ НАЧАЛЬНОГО ПОЛОЖЕНИЯ ПЕРЕКЛЮЧАТЕЛЯМ ==================================> */

    function startPos() {
        leftToggle.style.left = `${minPos - toggleWidth / 2}px`;
        rightToggle.style.left = `${maxPos - toggleWidth / 2}px`;
    }

/* <=========================================== ДВИЖЕНИЕ ПЕРЕКЛЮЧАТЕЛЕЙ ============================================> */

    function move(event) {
        const newPosition = event.pageX - filter.getBoundingClientRect().left;
        if (activeToggle === "left") {
            if (newPosition <= minPos) {
                toggleLeftPos = minPos;
                leftToggle.style.left = `${toggleLeftPos - toggleWidth / 2}px`;
                connectInputToToggle(toggleLeftPos);
                leftScale.style.width = "0px";
            } else if ((newPosition + toggleWidth) >= toggleRightPos) {
                toggleLeftPos = toggleRightPos - toggleWidth;
                leftToggle.style.left = `${toggleLeftPos - toggleWidth / 2}px`;
                connectInputToToggle(toggleLeftPos);
                leftScale.style.width = `${toggleLeftPos}px`;
            } else {
                toggleLeftPos = newPosition;
                leftToggle.style.left = `${toggleLeftPos - toggleWidth / 2}px`;
                connectInputToToggle(toggleLeftPos);
                leftScale.style.width = `${toggleLeftPos}px`;
            }
            
        } else if (activeToggle === "right") {
            if (newPosition >= maxPos) {
                toggleRightPos = maxPos;
                rightToggle.style.left = `${toggleRightPos - toggleWidth / 2}px`;
                connectInputToToggle(toggleRightPos);
                rightScale.style.width = `${filter.offsetWidth - toggleRightPos}px`;
            } else if ((newPosition - toggleWidth) <= toggleLeftPos) {
                toggleRightPos = toggleLeftPos + toggleWidth;
                rightToggle.style.left = `${toggleRightPos - toggleWidth / 2}px`;
                connectInputToToggle(toggleRightPos);
                rightScale.style.width = `${filter.offsetWidth - toggleRightPos}px`;
            } else {
                toggleRightPos = newPosition;
                rightToggle.style.left = `${toggleRightPos - toggleWidth / 2}px`;
                connectInputToToggle(toggleRightPos);
                rightScale.style.width = `${filter.offsetWidth - toggleRightPos}px`;
            }
        } else {
            console.log("Что-то сильно пошло не так...");
        }
    }

/* <============================================ ИЗМЕНЕНИЕ ПОЛЕЙ ВВОДА =============================================> */

    function changeInput() {
        if (activeInput === "left") {
            if (+leftInput.value < minValue) {
                leftInputValue = minValue;
                leftInput.value = leftInputValue;
                connectToggleToInput(leftInputValue);
            } else if (+leftInput.value >= rightInputValue - minDiff) {
                leftInputValue = rightInputValue - minDiff;
                leftInput.value = leftInputValue;
                connectToggleToInput(leftInputValue);
            } else {
                leftInputValue = +leftInput.value;
                leftInput.value = leftInputValue;
                connectToggleToInput(leftInputValue);
            }
        } else if (activeInput === "right"){
            if (+rightInput.value > maxValue) {
                rightInputValue = maxValue;
                rightInput.value = rightInputValue;
                connectToggleToInput(rightInputValue);
            } else if (+rightInput.value <= leftInputValue + minDiff) {
                rightInputValue = leftInputValue + minDiff;
                rightInput.value = rightInputValue;
                connectToggleToInput(rightInputValue);
            } else {
                rightInputValue = +rightInput.value;
                rightInput.value = rightInputValue;
                connectToggleToInput(rightInputValue);
            }
        } else {
            console.log("Что-то сильно пошло не так...");
        }
    }
/* <========================= УСТАНОВКА ЗАВВИСИМОСТЕЙ МЕЖДУ ПОЛЯМИ ВВОДА И ПЕРЕКЛЮЧАТЕЛЯМИ =========================> */

    // Установка полей ввода на основании переключателей:
    function connectInputToToggle(newPosition) {
        const relation = newPosition / maxPos;
        if (activeToggle === "left") {
            leftInputValue = Math.round(relation * (maxValue - minValue)) + minValue;
            leftInput.value = leftInputValue;
        } else if (activeToggle === "right") {
            rightInputValue = Math.round(relation * (maxValue - minValue)) + minValue;
            rightInput.value = rightInputValue;
        } else {
            console.log("Что-то сильно пошло не так...");
        }
    }

    function connectToggleToInput(newValue) {
        const relation = (newValue - minValue) / (maxValue - minValue);
        if (activeInput === "left") {
            toggleLeftPos = maxPos * relation;
            leftToggle.style.left = `${toggleLeftPos - toggleWidth / 2}px`;
            leftScale.style.width = `${toggleLeftPos}px`;
        } else if (activeInput === "right") {
            toggleRightPos = maxPos * relation;
            rightToggle.style.left = `${toggleRightPos - toggleWidth / 2}px`;
            rightScale.style.width = `${filter.offsetWidth - toggleRightPos}px`;
        } else {
            console.log("Что-то сильно пошло не так...");
        }
    }
/* <====================================== РЕНДЕР СТРАНИЦЫ НА ОСНОВЕ ФИЛЬТРОВ ======================================> */
    const update = () => {
        if (activeToggle === "left" || activeInput === "left") {
            curFilt.minVal = leftInputValue;
        } else if (activeToggle === "right" || activeInput === "right") {
            curFilt.maxVal = rightInputValue;
        } else {
            console.log("Что-то сильно пошло не так...");
        }
        activeToggle = "none";
        activeInput = "none";
        renderTable(page, table);
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", update);
    };

/* <================================================================================================================> */
/* <================================================== РЕАЛИЗАЦИЯ ==================================================> */
/* <================================================================================================================> */

    // Установка начальных значений:
    startPos(leftToggle);
    startPos(rightToggle);

    // Если страница была загружена вперввые, то назначаем необходимые обработчики:
    if (newPage) {
        // Реализация работы левого переключателя:
        leftToggle.addEventListener("mousedown", event => {         // При клике на переключатель:
            activeToggle = "left";                                  //  - Выбираем активный переключатель
            move(event);                                            //  - Устанавливаем переключатель по центру курсора
            document.addEventListener("mousemove", move);           //  - Пока мышка двигается, двигаем переключатель
            document.addEventListener("mouseup", update);
        });
        // Реализация работы правого переключателя:
        rightToggle.addEventListener("mousedown", event => {        // При клике на переключатель:
            activeToggle = "right";                                 //  - Выбираем активный переключатель
            move(event, rightToggle);                               //  - Устанавливаем переключатель по центру курсора
            document.addEventListener("mousemove", move);           //  - Пока мышка двигается, двигаем переключатель
            document.addEventListener("mouseup", update);
        });
        // Реализация работы левого поля ввода:
        leftInput.addEventListener("input", () => {
            activeInput = "left";
            leftInput.value = leftInput.value.replace(/\D/g, '');
        });
        // Реализация работы левого поля ввода:
        leftInput.addEventListener("change", () => {
            activeInput = "left";
            changeInput();
            update();
        });
        // Реализация работы правого поля ввода:
        rightInput.addEventListener("input", () => {
            activeInput = "right";
            rightInput.value = rightInput.value.replace(/\D/g, '');
        });
        // Реализация работы правого поля ввода:
        rightInput.addEventListener("change", () => {
            activeInput = "right";
            changeInput();
            update();
        });
    }

    console.log("Создание фильтра с ползунками: finish");
};

export default filterRange;