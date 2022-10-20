"use strict";

//<==================================================================================================================>\\
//<=========================================== ИМПОРТ НЕОБХОДИМЫХ МОДУЛЕЙ ===========================================>\\
//<==================================================================================================================>\\

import service from "../service.js";
import check from "./check.js";

//<==================================================================================================================>\\
//<====================================== РЕАЛИЗАЦИЯ АВТОРИЗАЦИИ ПОЛЬЗОВАТЕЛЯ =======================================>\\
//<==================================================================================================================>\\

const login = () => {
    // Получение необходимых элементов со странцы:
    const form = document.querySelector(".client-form[data-formType='login']");         // Форма ввода значений
    const login = form.querySelector(".client-form__input[data-inputType='login']");    // Поле для логина
    const pass = form.querySelector(".client-form__input[data-inputType='pass']");      // Поле для пароля
    const btn = form.querySelector(".client-form__btn");                                // Кнопка входа

    // Конфигурация страницы:
    const access = {
        login: false,
        pass: false
    };

    // Проверка на корректность введённых данных:
    ["change", "input", "cut", "copy", "paste"].forEach(event => {
        login.addEventListener(event, () => access.login = check(login, btn, /^\./, /\.$/, /[^a-zA-Z0-9.]/, 5, 20));
        pass.addEventListener(event, () => access.pass = check(pass, btn, /[^a-zA-Z0-9]/, /[^a-zA-Z0-9]/, /[^a-zA-Z0-9]/, 5, 20, access.pass));
    });

    // Обработка кнопки "Отправить":
    form.addEventListener("submit", event => {
        event.preventDefault();
        console.log(access);
        if (access.login && access.pass) {
            // Определение необходимых переменных
            const formData = new FormData(form);                                    // Получаем данные пользвователя
            const json = JSON.stringify(Object.fromEntries(formData.entries()));    // Формируем JSON-объект с данными

            // Выполняем запрос на вход пользователя:
            service.postData('/auth/login', json)
            .then(JWT => {
                // Если введённые данные пользователем корректны и вход выполнен успешно, то:
                localStorage.setItem('JWT', JWT.JWT);                           // Добавление в LS JWT-токен
                localStorage.setItem('auth', true);                             // Добавление в LS статус авторизации
                localStorage.setItem('userID', JWT.id);                         // Добавление в LS id-пользователя
                localStorage.setItem('admin', JWT.admin);                         // Добавление в LS роль-пользователя
                window.location.href = 'http://localhost:3000/recipes/user';    // Переадресация на страницу с рецептами
            })
            // В случае ошибки выводим соответствующее сообщение:
            .catch(error => console.log(error));
        }
    });
};

export default login;