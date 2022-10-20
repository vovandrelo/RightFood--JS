"use strict";

import service from "./service.js";

const enegryValue = () => {
    const section = document.querySelector(".enegryValue");

    const inputWeight = section.querySelector("[data-inputtype='user-weight']");
    const inputAge = section.querySelector("[data-inputtype='user-age']");
    const inputHeight = section.querySelector("[data-inputtype='user-height']");

    const popUpMenuGender = section.querySelector("[data-inputtype='user-gender']");
    const popUpMenuGenderList = section.querySelectorAll(".pop-up-menu__list")[0];

    const popUpMenuActive = section.querySelector("[data-inputtype='user-active']");
    const popUpMenuActiveList = section.querySelectorAll(".pop-up-menu__list")[1];

    const popUpMenuPurp = section.querySelector("[data-inputtype='user-purp']");
    const popUpMenuPurpList = section.querySelectorAll(".pop-up-menu__list")[2];

    const inputResult = section.querySelector("[data-inputtype='result']");
    const strResult = section.querySelector(".enegryValue__ratio .enegryValue__descr");
    const btnSave = section.querySelector("[data-btn-type='save-energyValue']");

    const config = {
        weight: null,
        age: null,
        height: null,
        gender: null,
        active: null,
        purp: null
    };

    let result = null;

    const computeResult = () => {
        if (config.gender === "male") {
            console.log("Мужчина");
            result = 10 * config.weight + 6.25 * config.height + 5 * config.age + 5;
        } else if (config.gender === "female") {
            console.log("Женщина");
            result = 10 * config.weight + 6.25 * config.height + 5 * config.age - 161;
        } else {
            console.log("Что ты?!");
            result = 10 * config.weight + 6.25 * config.height + 5 * config.age - 70;
        }

        if (config.active === "min") {
            result *= 1.2;
        } else if (config.active === "norm") {
            result *= 1.4;
        } else if (config.active === "moreStandart") {
            result *= 1.7;
        } else if (config.active === "max") {
            result *= 1.9;
        }

        if (config.purp === "weightApp") {
            result *= 1.15;
            strResult.innerHTML = `А процентное соотношение БЖУ имеет вид: Белки - 30-35%; Жиры - 15-25%; Углеводы - 55-60%`;
        } else if (config.purp === "weightNone") {
            strResult.innerHTML = `А процентное соотношение БЖУ имеет вид: Белки - 25-35%; Жиры - 20-25%; Углеводы - 45-65%`;
        } else if (config.purp === "weightDrop") {
            result *= 0.75;
            strResult.innerHTML = `А процентное соотношение БЖУ имеет вид: Белки - 30-35%; Жиры - 20-25%; Углеводы - 50-55%`;
        }

        result = Math.round(result);
        inputResult.value = result;
    };

    const checkConfig = () => {
        if (config.weight && config.age && config.height &&
            config.gender && config.active && config.purp) {
            computeResult();
        } else {
            inputResult.value = "";
            strResult.innerHTML = "";
        }
    };

    const chooseItem = event => {
        if (event.currentTarget.previousElementSibling.dataset.inputtype === "user-gender") {
            popUpMenuGender.value = event.target.innerHTML;
            if (event.target.innerHTML === "Мужской") {
                config.gender = "male";
                checkConfig();
            } else if (event.target.innerHTML === "Женский") {
                config.gender = "female";
                checkConfig();
            } else if (event.target.innerHTML === "Иной") {
                config.gender = "other";
                checkConfig();
            }
        } else if (event.currentTarget.previousElementSibling.dataset.inputtype === "user-active") {
            popUpMenuActive.value = event.target.innerHTML;
            if (event.target.innerHTML === "Минимальный") {
                config.active = "min";
                checkConfig();
            } else if (event.target.innerHTML === "Нормальный") {
                config.active = "norm";
                checkConfig();
            } else if (event.target.innerHTML === "Повышенный") {
                config.active = "moreStandart";
                checkConfig();
            } else if (event.target.innerHTML === "Максимальный") {
                config.active = "max";
                checkConfig();
            }
        } else if (event.currentTarget.previousElementSibling.dataset.inputtype === "user-purp") {
            popUpMenuPurp.value = event.target.innerHTML;
            if (event.target.innerHTML === "Набор массы") {
                config.purp = "weightApp";
                checkConfig();
            } else if (event.target.innerHTML === "Поддержание веса") {
                config.purp = "weightNone";
                checkConfig();
            } else if (event.target.innerHTML === "Похудение") {
                config.purp = "weightDrop";
                checkConfig();
            }
        } else {
            console.log("Я стесняюсь спросить, а куда вы вообще нажали?!");
        }
    };

    btnSave.addEventListener("click", () => {
        if (config.weight && config.age && config.height &&
            config.gender && config.active && config.purp) {
            const JWT = localStorage.getItem('JWT');
            if (JWT) {
                service.postData(`/enegryValue/add`, JSON.stringify({result: +result}), JWT)
                .then(res => {
                    window.location.href = 'http://localhost:3000/recipes/user/';
                })
                .catch(err => console.log(err.message));
            } else {
                window.location.href = 'http://localhost:3000/auth/login';
            }
        }
    });

    popUpMenuGender.addEventListener("focus", () => {
        popUpMenuGenderList.style.height = "120px";
        popUpMenuGenderList.addEventListener("click", chooseItem);
    });
    popUpMenuActive.addEventListener("focus", () => {
        popUpMenuActiveList.style.height = "156px";
        popUpMenuActiveList.addEventListener("click", chooseItem);
    });
    popUpMenuPurp.addEventListener("focus", () => {
        popUpMenuPurpList.style.height = "120px";
        popUpMenuPurpList.addEventListener("click", chooseItem);
    });

    popUpMenuGender.addEventListener("blur", () => {
        popUpMenuGenderList.style.height = "0px";
        popUpMenuActiveList.style.height = "0px";
        popUpMenuPurpList.style.height = "0px";
    });
    popUpMenuActive.addEventListener("blur", () => {
        popUpMenuGenderList.style.height = "0px";
        popUpMenuActiveList.style.height = "0px";
        popUpMenuPurpList.style.height = "0px";
    });
    popUpMenuPurp.addEventListener("blur", () => {
        popUpMenuGenderList.style.height = "0px";
        popUpMenuActiveList.style.height = "0px";
        popUpMenuPurpList.style.height = "0px";
    });

    ["change", "input", "cut", "copy", "paste"].forEach(event => {
        inputWeight.addEventListener(event, () => {
            inputWeight.value = inputWeight.value.replace(/\D/g, '');
            if (inputWeight.value.length === 0) {
                config.weight = null;
            } else {
                config.weight = inputWeight.value;
            }
            checkConfig();
        });
        inputAge.addEventListener(event, () => {
            inputAge.value = inputAge.value.replace(/\D/g, '');
            if (inputAge.value.length === 0) {
                config.age = null;
            } else {
                config.age = inputAge.value;
            }
            checkConfig();
        });
        inputHeight.addEventListener(event, () => {
            inputHeight.value = inputHeight.value.replace(/\D/g, '');
            if (inputHeight.value.length === 0) {
                config.height = null;
            } else {
                config.height = inputHeight.value;
            }
            checkConfig();
        });
        popUpMenuGender.addEventListener(event, () => {
            popUpMenuGender.value = '';
        });
        popUpMenuActive.addEventListener(event, () => {
            popUpMenuActive.value = '';
        });
        popUpMenuPurp.addEventListener(event, () => {
            popUpMenuPurp.value = '';
        });
    });
};

export default enegryValue;