"use strict";

const navBar = () => {
    const navBar = document.querySelector(".navBar");
    const menuItems = navBar.querySelectorAll(".navBar__menu-item");
    const authBtn = navBar.querySelector(".navBar__login");

    if (localStorage.getItem('auth')) {
        if (localStorage.getItem('admin') !== "true") {
            const newItem1 = document.createElement("li");
            newItem1.classList.add('navBar__menu-item');
            const newLink1 = document.createElement("a");
            newLink1.classList.add('navBar__link');
            newLink1.textContent = "Избранное";
            newLink1.href = `/recipes/favourite`;
            newItem1.append(newLink1);
            menuItems[2].after(newItem1);
        }

        const newItem2 = document.createElement("li");
        newItem2.classList.add('navBar__menu-item');
        const newLink2 = document.createElement("a");
        newLink2.classList.add('navBar__link');
        newLink2.textContent = "Мои рецепты";
        newLink2.href = `/recipes/user`;
        newItem2.append(newLink2);
        menuItems[2].after(newItem2);
        
        authBtn.textContent = "Выйти";
        authBtn.addEventListener("click", event => {
            event.preventDefault();
            localStorage.clear();
            window.location.href = 'http://localhost:3000/auth/login';
        });
    }
};

export default navBar;