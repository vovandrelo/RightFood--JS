"use strict";

export default class ProductTable {
    constructor(table) {
        this.table = document.querySelector(table);
    }
    addLine(key, value) {
        const newLine = document.createElement("tr");
        newLine.classList.add("table__line");

        const newKey = document.createElement("td");
        newKey.textContent = key;
        newKey.classList.add("table__item");

        const newValue = document.createElement("td");
        newValue.textContent = `${value} г.`;
        newValue.classList.add("table__item");
        newValue.classList.add("table__item_right");


        newLine.append(newKey);
        newLine.append(newValue);

        this.table.append(newLine);
    }
}