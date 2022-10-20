"use strict";


export default class PopUpMenu {
    constructor(menuBlock, search, list, itemHeight, listHeight, theme) {
        this.menuBlock = document.querySelector(menuBlock);
        this.search = this.menuBlock.querySelector(search);
        this.choosedItem = null;
        this.list = this.menuBlock.querySelector(list);
        this.itemHeight = itemHeight;
        this.listHeight = listHeight;
        this.theme = theme;
        this.correctInput = false;
    }
    createMenu() {
        this.search.value = "";
        this.correctInput = false;
        this.search.classList.remove('input-data_err');
    }
    deleteMenu() {
        this.search.value = "";
        this.correctInput = true;
        this.search.classList.remove('input-data_err');
    }
    createList() {
        this.correctInput = false;
        this.search.classList.add('input-data_err');
        if (this.search.value.length > 2) {
            this.list.style.height = `${this.itemHeight*10}px`;
            this.list.innerHTML = `
                <svg class="spinner" viewBox="0 0 50 50">
                    <circle class="spinner__path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
                </svg>
            `;
            return true;
        } else {
            this.list.style.height = `${0}px`;
            return false;
        }
    }
    addItemsInList(items) {
        // Отрисовка полученных типов на основе их количества:
        if (items.length > this.listHeight) {
            this.list.style.height = `${this.itemHeight * this.listHeight}px`;
        }
        else {
            this.list.style.height = `${this.itemHeight * items.length}px`;
        }

        items.forEach((product, i) => {
            console.log(product);
            if (i === 0) {
                this.list.innerHTML = "";
            }
            this.list.innerHTML += `<li class="pop-up-menu__list-item pop-up-menu__list-item_${this.theme}" data-prod-id=${product.id} data-energy-value=${+product.kcal}-${+product.proteins}-${+product.fats}-${+product.carbohydrates}>${PopUpMenu.ucFirst(product.name)}</li>`;
        });
    }
    chooseItem(item) {
        this.correctInput = true;
        this.search.classList.remove('input-data_err');
        this.search.value = item.innerText;
        this.list.style.height = `${0}px`;

        this.choosedItem =  {
            id: item.dataset.prodId,
            kcal: item.dataset.energyValue.split("-")[0],
            proteins: item.dataset.energyValue.split("-")[1],
            fats: item.dataset.energyValue.split("-")[2],
            carbohydrates: item.dataset.energyValue.split("-")[3],
        };
    }
    static ucFirst(str) {
        if (!str) {
            return str;
        }
        return str[0].toUpperCase() + str.slice(1);
    }
}