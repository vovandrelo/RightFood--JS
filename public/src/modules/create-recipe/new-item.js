"use strict";

export default class NewItem {
    constructor(dataLine) {
        this.dataLine = document.querySelector(dataLine);
    }
    showAddInput() {
        this.dataLine.style.display = "flex";
    }
    hideAddInput() {
        this.dataLine.style.display = "none";
    }
}