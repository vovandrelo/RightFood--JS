import products from "../modules/products/1_products.js";
import registr from "../modules/auth/registr.js";
import login from "../modules/auth/login.js";
import navBar from "../modules/navBar.js";
import recipeUser from "../modules/recipes/recipes-user.js";
import recipeAll from "../modules/recipes/recipes-all.js";
import recipeFav from "../modules/recipes/recipes-fav.js";
import enegryValue from "../modules/energy-value.js";


document.addEventListener('DOMContentLoaded', async () => {
    const section = document.querySelector("[data-recipes-type");

    try {
        navBar();
    } catch (error) {}
    try {
        products();
    } catch (error) {}
    try {
        login();
    } catch (error) {}
    try {
        registr();
    } catch (error) {}
    try {
        if (section.dataset.recipesType === "user") {
            recipeUser();
        } else if (section.dataset.recipesType === "all") {
            recipeAll();
        } else if (section.dataset.recipesType === "favourite") {
            recipeFav();
        }
    } catch (error) {}
    try {
        enegryValue();
    } catch (err) {}
});