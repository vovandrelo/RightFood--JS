"use strict";

//<==================================================================================================================>\\
//<====================================== ПРОВЕРКА ПОЛЕЙ ВВОДА НА КОРРЕКТНОСТЬ ======================================>\\
//<==================================================================================================================>\\

const checking = (input, btn, startSymb, lastSymb, reg, minVal, maxVal) => {
    // Если введённое/первый символ/последний символ некорректны, то:
    if (reg.test(input.value) || startSymb.test(input.value) || lastSymb.test(input.value)) {
        // Устанавливаем тему оформления в значение "Ошибка"
        input.classList.add("client-form__input_error");
        btn.classList.add("client-form__btn_error");
        return false;
    }
    // Если введённое значение превышает/не превышает максимальное/минимальное количество символов, то:
    if (input.value.length <= minVal || input.value.length >= maxVal) {
        // Устанавливаем тему оформления в значение "Ошибка"
        input.classList.add("client-form__input_error");
        btn.classList.add("client-form__btn_error");
        return false;
    }
    // Если ввведённые данные корректны, то устанавливаем тему оформления в значение "Ок"
    input.classList.remove("client-form__input_error");
    btn.classList.remove("client-form__btn_error");
    return true;
};


export default checking;