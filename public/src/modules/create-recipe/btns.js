"use strict";

export default class Btns {
    constructor(accept, cancel, add, save) {
        this.accept = document.querySelector(accept);
        this.cancel = document.querySelector(cancel);
        this.add = document.querySelector(add);
        this.save = document.querySelector(save);
        console.log(this.save);
    }
    btnHide(btnName) {
        if (btnName === "accept") {
            this.accept.style.display = "none";
        } else if (btnName === "cancel") {
            this.cancel.style.display = "none";
        } else if (btnName === "add") {
            this.add.style.display = "none";
        }
    }
    btnShow(btnName) {
        if (btnName === "accept") {
            this.accept.style.display = "flex";
        } else if (btnName === "cancel") {
            this.cancel.style.display = "flex";
        } else if (btnName === "add") {
            this.add.style.display = "flex";
        }
    }
}