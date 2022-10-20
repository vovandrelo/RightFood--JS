"use strict";

import register from "../register.js";

export default class Card {
    constructor(data, allowDelete = false, allowFav = false) {
        this.recipeId = data.id;
        this.recipeName = data.rec_name;
        this.photoName = data.photo_name;
        this.products = data.products;
        this.sum = data.sum;
        this.userId = data.user_id;
        this.allowDelete = allowDelete;
        this.allowFav = allowFav;
        this.descr = data.recipe_descr;
        this.elem = this.renderCards();
        
    }
    renderCards() {
        const recipesItem = document.createElement("div");
        recipesItem.classList.add('recipes__item', 'd-flex', 'col-5', 'mt-4');
        recipesItem.setAttribute("data-rec-id", this.recipeId);

        const recipesItemImg = document.createElement("div");
        recipesItemImg.classList.add('recipes__item-img');

        if (this.photoName) {
            recipesItemImg.style.backgroundImage = `url(/upload-imgs/${this.photoName})`;
        } else {
            recipesItemImg.innerHTML = "IMG";
        }
        recipesItem.append(recipesItemImg);

        const recipesItemInfo = document.createElement("div");
        recipesItemInfo.classList.add('recipes__item-info');
        recipesItemInfo.innerHTML = `
            <h2 class="title title_size-xs">${register.toFirstCaps(this.recipeName)}</h2>
            <div class="recipes__item-title">Ингридиенты</div>
            <div class="recipes__item-text">${this.products[0].name.slice(0,23)}...</div>
            <div class="recipes__item-text">${this.products[1].name.slice(0,23)}...</div>
            <div class="recipes__item-text">...</div>
            <div class="recipes__item-title">Около ${Math.round(this.sum)} Ккал на 100 г.</div>
        `;
        recipesItem.append(recipesItemInfo);

        const recipesItemActions = document.createElement("div");
        recipesItemActions.classList.add('recipes__item-actions');

        if (this.allowDelete) {
            recipesItemActions.innerHTML += `<span class='icon-delete'></span>`;
        }
        if (this.allowFav) {
            recipesItemActions.innerHTML += `<span class='icon-add'></span>`;
        }

        recipesItem.append(recipesItemActions);

        return recipesItem;
    }
}