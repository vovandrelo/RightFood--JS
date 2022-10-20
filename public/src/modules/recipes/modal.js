"use strict";

export default class Modal {
    constructor(winSel, titleSel, photoSel, tableInfoSel, tableProdsSel, inputWeightSel, descrSel, btnAddSel, commSel, commBlockSel) {
        this.win = document.querySelector(winSel);
        this.cont = this.win.querySelector(".container");
        this.name = this.win.querySelector(titleSel);
        this.photoBlock = this.win.querySelector(photoSel);
        this.tableInfo = this.win.querySelector(tableInfoSel);
        this.tableProducts = this.win.querySelector(tableProdsSel);
        this.inputWeight = this.win.querySelector(inputWeightSel);
        this.descr = this.win.querySelector(descrSel);
        this.btnAddComm = this.win.querySelector(btnAddSel);
        this.comment = this.win.querySelector(commSel);
        this.commentsBlock = this.win.querySelector(commBlockSel);
    }
    open() {
        this.win.style.display = "block";
    }
    close() {
        this.win.style.display = "none";
    }
    renderRecipe(recipe, weight = 100) {
        this.name.innerHTML = recipe.recipeName;
        this.inputWeight.value = weight;

        if (recipe.photoName) {
            this.photoBlock.innerHTML = "";
            this.photoBlock.style.backgroundImage = `url(/upload-imgs/${recipe.photoName})`;
        } else {
            this.photoBlock.innerHTML = "IMG";
            this.photoBlock.style.backgroundImage = "none";
        }

        let totalWeight = 0;
        let totalKcal = 0;
        let totalProteins = 0;
        let totalFats = 0;
        let totalCarb = 0;
        recipe.products.forEach(product => {
            totalWeight += 100 * product.ratio;
            totalKcal += product.kcal * product.ratio;
            totalProteins += product.proteins * product.ratio;
            totalFats += product.fats * product.ratio;
            totalCarb += product.carbohydrates * product.ratio;
        });

        const ratio = totalWeight / weight;

        this.tableInfo.children[0].children[1].innerHTML = `${Math.round(totalKcal / ratio)} Ккал.`;
        this.tableInfo.children[1].children[1].innerHTML = `${Math.round(totalProteins / ratio)} г.`;
        this.tableInfo.children[2].children[1].innerHTML = `${Math.round(totalFats / ratio)} г.`;
        this.tableInfo.children[3].children[1].innerHTML = `${Math.round(totalCarb / ratio)} г.`;
        this.tableInfo.children[4].children[1].innerHTML = `${Math.round(weight)} г.`;

        this.tableProducts.innerHTML = ``;
        recipe.products.forEach(product => {
            this.tableProducts.innerHTML += `
                <tr class="table__line">
                    <td class="table__item">${product.name}</td>
                    <td class="table__item table__item_right">${Math.round(100 * product.ratio / ratio)} г.</td>
                </tr>`;
        });

        this.descr.innerHTML = recipe.descr.split("\r\n").join("<br/>");
    }
    renderComments(comments, allowDelete = false) {
        console.log(comments);
        this.commentsBlock.innerHTML = "";
        if (comments.length === 0) {
            const item = document.createElement('div');
            item.innerHTML += `<h2 class="title recipe-modal__comments-title title_size-xs">Комментариев ещё нет(</h2>`;
            this.commentsBlock.append(item);
        } else {
            comments.forEach(comment => {
                const item = document.createElement('div');
                item.dataset.commentId = comment.id;
                item.classList.add('recipe-modal__comments-item');
                item.innerHTML += `<h2 class="title recipe-modal__comments-title title_size-xs">${comment.name}</h2>`;
                item.innerHTML += `<div class="recipe-modal__comments-date">${comment.date.slice(0, 10)}</div>`;
                item.innerHTML += `<div class="recipe-modal__comments-descr">${comment.content}</div>`;
                if (allowDelete) {
                    item.innerHTML += `<div class="recipe-modal__comments-delete" data-btn-type="delete-comment"><span class="icon-delete"></span></div>`;
                }
                this.commentsBlock.append(item);
            });
        }
    }
}