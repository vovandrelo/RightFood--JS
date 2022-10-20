"use strict";

export default class InputData {
    constructor(search) {
        this.search = document.querySelector(search);
        this.correct = false;
    }
    check(minVal, type) {
        this.correct = false;
        this.search.classList.add('input-data_err');
        const value = this.search.value;

        if (type === "number") {
            if (/[^0-9]/.test(value)) {
                this.search.value = value.replace(/[^0-9]/g, '');
            }
        }

        if (this.search.value.length >= minVal) {
            this.correct = true;
            this.search.classList.remove('input-data_err');
        }
    }
    createInput() {
        this.search.value = '';
        this.correct = false;
        this.search.classList.remove('input-data_err');
    }
    deleteInput() {
        this.search.value = '';
        this.correct = true;
        this.search.classList.remove('input-data_err');
    }
}