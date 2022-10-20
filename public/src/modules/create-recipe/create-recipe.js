"use strict";

import PopUpMenu from "../pop-up-menu.js" ;
import InputData from "./input-data.js";
import NewItem from "./new-item.js";
import Btns from "./btns.js";
import service from "../service.js";
import ProductTable from "./products-table.js";
import EnergyValueTable from "./energy-value-table.js";
import Image from "./image.js";
import register from "../register.js";

const createRecipe = () => {
    const win = document.querySelector("[data-win-type='create-recipe']");
    const container = win.querySelector(".container");
    win.style.display = "block";
    const products = [];
    let fileImage = null;
    const JWT = localStorage.getItem('JWT');


    const btns = new Btns("[data-btn-type='accept']", "[data-btn-type='cancel']", "[data-btn-type='add']", "[data-btn-type='create-rec']");
    const newItem = new NewItem(".recipe-modal__new-item");
    const menu = new PopUpMenu(".pop-up-menu", "[data-inputType='productName']", ".pop-up-menu__list", 36, 10, "dark");
    const image = new Image(".recipe-modal__input-img", ".recipe-modal__img-block");
    
    const inputWeight = new InputData("[data-inputType='productWeight']");
    const inputName = new InputData("[data-inputType='recipeName']");
    const inputDescr = new InputData(".input-bigData");
    
    

    const productsTable = new ProductTable("[data-type='productTable'] tbody");
    const energyValueTable = new EnergyValueTable("[data-type='energyValueTable'] tbody", ".table__item.table__item_right");

    btns.btnShow("accept");
    newItem.showAddInput();


    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        image.inputBlock.addEventListener(eventName, event => {
            event.preventDefault();
            event.stopPropagation();
        });
    });

    image.inputBlock.addEventListener("drop", event => {
        fileImage = image.getImage(event);
        image.addImage(fileImage);
    });

    image.input.addEventListener("change", event => {
        image.addImage(image.input.files[0]);
    });

    btns.add.addEventListener("click", () => {
        menu.createMenu();
        inputWeight.createInput();
        btns.btnHide("add");
        btns.btnShow("accept");
        btns.btnShow("cancel");
        newItem.showAddInput();
    });
    btns.cancel.addEventListener("click", () => {
        menu.deleteMenu();
        inputWeight.deleteInput();
        btns.btnShow("add");
        btns.btnHide("accept");
        btns.btnHide("cancel");
        newItem.hideAddInput();
    });
    btns.accept.addEventListener("click", () => {
        console.log(menu.correctInput);
        console.log(inputWeight.correct);
        if (menu.correctInput && inputWeight.correct) {
            btns.btnShow("add");
            btns.btnHide("accept");
            btns.btnHide("cancel");
            newItem.hideAddInput();
            const weight = inputWeight.search.value;
            const ratio = weight / 100;

            const newProd = {
                id: menu.choosedItem.id,
                kcal: menu.choosedItem.kcal * ratio,
                proteins: menu.choosedItem.proteins * ratio,
                fats: menu.choosedItem.fats * ratio,
                carbohydrates: menu.choosedItem.carbohydrates * ratio,
                weight,
                ratio
            };

            products.push(newProd);
            productsTable.addLine(menu.search.value, inputWeight.search.value);
            energyValueTable.renderTable(products);
        }
    });
    btns.save.addEventListener("click", event => {
        event.preventDefault();

        if (inputName.correct && inputDescr.correct && products.length > 1 && menu.correctInput && inputWeight.correct) {
            const formData = new FormData();
            formData.append('fileImage', fileImage);
            formData.append('recipeName', register.toLowerCase(inputName.search.value));
            formData.append('recipeDescr', inputDescr.search.value);

            products.forEach((prod, i) => {
                formData.append("prodID", prod.id);
            });
            products.forEach((prod, i) => {
                formData.append("prodRatio", prod.ratio);
            });

            service.postDataAndfiles(`/recipes/user/createRecipe`, formData, JWT)
            .then(res => {
                console.log(res);
                window.location.href = 'http://localhost:3000/recipes/user/';
            })
            .catch(err => console.log(err.message));
        }
    });

    menu.search.addEventListener("input", event => {
        const isSearch = menu.createList();
        if (isSearch) {
            service.getData(`/products/search/${event.target.value}`)
            .then(products => {
                menu.addItemsInList(products);
            })
            .catch(err => console.log(err.message));
        }
    });
    menu.list.addEventListener("click", event => {
        menu.chooseItem(event.target);
    });

    inputWeight.search.addEventListener("input", event => {
        inputWeight.check(1, "number");
    });

    inputName.search.addEventListener("input", event => {
        inputName.check(5, "text");
    });
    inputDescr.search.addEventListener("input", event => {
        inputDescr.check(10, "text");
    });

    win.addEventListener("click", event => {
        console.log(event.target);
        if (event.target && (event.target === win || event.target === container)) {
            win.style.display = "none";
            document.body.style.overflowY = "scroll";
        }
    });
};

export default createRecipe;