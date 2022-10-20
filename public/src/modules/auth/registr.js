"use strict";

//<==================================================================================================================>\\
//<=========================================== ИМПОРТ НЕОБХОДИМЫХ МОДУЛЕЙ ===========================================>\\
//<==================================================================================================================>\\

import service from "../service.js";
import check from "./check.js";



const registr = () => {
    const form = document.querySelector(".client-form[data-formType='registr']");
    const name = form.querySelector(".client-form__input[data-inputType='name']");
    const login = form.querySelector(".client-form__input[data-inputType='login']");
    const passes = form.querySelectorAll(".client-form__input[data-inputType='pass']");
    const btn = form.querySelector(".client-form__btn");

    const access = {
        name: false,
        login: false,
        pass: false
    };

    name.addEventListener("input", () => access.name = check(name, btn, /^ /, / $/, /[^а-яА-яa-zA-Z ]/, 2, 20));
    name.addEventListener("change", () => access.name = check(name, btn, /^ /, / $/, /[^а-яА-яa-zA-Z ]/, 2, 20));
    name.addEventListener("paste", () => access.name = check(name, btn, /^ /, / $/, /[^а-яА-яa-zA-Z ]/, 2, 20));
    login.addEventListener("input", () => access.login = check(login, btn, /^\./, /\.$/, /[^a-zA-Z0-9.]/, 5, 20));
    login.addEventListener("change", () => access.login = check(login, btn, /^\./, /\.$/, /[^a-zA-Z0-9.]/, 5, 20));
    login.addEventListener("paste", () => access.login = check(login, btn, /^\./, /\.$/, /[^a-zA-Z0-9.]/, 5, 20));
    passes.forEach(pass => {
        pass.addEventListener("input", () => access.pass = check(pass, btn, /[^a-zA-Z0-9]/, /[^a-zA-Z0-9]/, /[^a-zA-Z0-9]/, 5, 20, access.pass));
        pass.addEventListener("change", () => access.pass = check(pass, btn, /[^a-zA-Z0-9]/, /[^a-zA-Z0-9]/, /[^a-zA-Z0-9]/, 5, 20, access.pass));
        pass.addEventListener("paste", () => access.pass = check(pass, btn, /[^a-zA-Z0-9]/, /[^a-zA-Z0-9]/, /[^a-zA-Z0-9]/, 5, 20, access.pass));
    });

    

    const passMatching = (passOne, passsTwo) => (passOne.value === passsTwo.value) ? true : false;

    form.addEventListener("submit", event => {
        event.preventDefault();
        if (access.name && access.login && access.pass) {
            if (passMatching(passes[0], passes[1])) {
                const formData = new FormData(form);
                const json = JSON.stringify(Object.fromEntries(formData.entries()));

                service.postData('/auth/registr', json)
                .then(data => {
                    console.log(data);
                    window.location.href = 'http://localhost:3000/auth/login';  
                })
                .catch(error => console.log(error));
            } else {
                console.log("Пароли не совпадают!");
            }
        }
    });
};

export default registr;