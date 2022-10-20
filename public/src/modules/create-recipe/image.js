"use strict";

export default class Image {
    constructor(input, inputBlock) {
        this.inputBlock = document.querySelector(inputBlock);
        this.input = document.querySelector(input);
    }
    addImage(file) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            this.inputBlock.style.backgroundImage = `url(${reader.result})`;
            this.inputBlock.innerHTML = "";
        };
    }
    getImage(event) {
        let file = [...event.dataTransfer.files][0];
        return file;
    }
}