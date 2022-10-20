"use strict";

export default class EnergyValueTable {
    constructor(table, value) {
        this.table = document.querySelector(table);
        this.value = this.table.querySelectorAll(value);

    }
    renderTable(items) {
        let commonKcal = 0;
        let commonProteins = 0;
        let commonFats = 0;
        let commonCarbohydrates = 0;
        let commonWeigt = 0;

        items.forEach(item => {
            commonKcal += +item.kcal;
            commonProteins += +item.proteins;
            commonFats += +item.fats;
            commonCarbohydrates += +item.carbohydrates;
            commonWeigt += +item.weight;
        });

        this.value[0].innerText = `${commonKcal.toFixed(2)} Ккал.`;
        this.value[1].innerText = `${commonProteins.toFixed(2)} г.`;
        this.value[2].innerText = `${commonFats.toFixed(2)} г.`;
        this.value[3].innerText = `${commonCarbohydrates.toFixed(2)} г.`;
        this.value[4].innerText = `${commonWeigt.toFixed(2)} г.`;
    }
}