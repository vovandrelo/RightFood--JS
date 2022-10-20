"use strict";

//<==================================================================================================================>\\
//<============================================ ИМПОРТ НЕОБХОДИМЫХ МОДУЛЕЙ ==========================================>\\
//<==================================================================================================================>\\

import Card from "./card.js";
import service from "../service.js";
import Modal from "./modal.js";

//<==================================================================================================================>\\
//<============================= РЕАЛИЗАЦИЯ ЛОГИКИ РАБОТЫ СТРАНИЦЫ С ЛЮБИМЫМИ РЕЦЕПТАМИ =============================>\\
//<==================================================================================================================>\\

const recipeFav = () => {

    //<=========================================== ПРОВЕРКА НА АВТОРИЗАЦИЮ ==========================================>\\
    // Получаем id пользователя из localstorage:
    const userID = localStorage.getItem('userID');
    // Получаем роль пользователя:
    const admin = localStorage.getItem('admin');
    // Если id не было считано, значит пользователь не авторизован, поэтому:
    if (!userID) {
        // Перенаправляем пользователя на страницу с авторизацией:
        window.location.href = 'http://localhost:3000/auth/login';
        return;
    }
    // У роли "Администратор" нет избранных рецептов:
    if (admin === "true") {
        // Перенаправляем пользователя на страницу со всеми рецептами:
        window.location.href = 'http://localhost:3000/recipes/all';
        return;
    }

    //<======================================= ОПРЕДЕЛЕНИЕ НЕОБХОДИМЫХ ДАННЫХ =======================================>\\

    // Конфигурация страницы:
    const pageConfig = {
        numPage: 0,     // Текущая страница с рецептами
        kcal: "none",   // Фильтр на количество калорий
        temp: "none",   // Фильтр на шаблон
    };

    // Необходимые элементы:
    const JWT = localStorage.getItem('JWT');                                        // JWT-токен
    const cardsBlock = document.querySelector(".recipes__items");                   // Блок с рецептами
    const filterPanel = document.querySelector(".recipes__filter-panel");           // Панель с фильтрами
    const btnSearch = filterPanel.querySelector(".button");                         // Кнопка поиска рецептов
    const inputKcal = filterPanel.querySelector("[data-inputtype='searchKcal']");   // Поле ввода калорий рецепта
    const searchPanel = document.querySelector(".recipes__search-panel");           // Панель с поиском рецепта
    const search = searchPanel.querySelector(".input-data");                        // Поле ввода названия рецепта

    // Объекта модального окна с данными о рецепте:
    const modal = new Modal("[data-win-type='open-recipe']", ".title", ".recipe-modal__img-recipe",
        "[data-type='energyValueTable'] tbody", "[data-type='productTable'] tbody",
        "[data-inputtype='recipeWeight']", ".recipe-modal__descr", "[data-btn-type='create-comment']",
        ".input-bigData", ".recipe-modal__comments-items");

    // Необходимые переменные:
    let curCard = null;                                                             // Текущий открытый рецепт
    const cardsItems = [];                                                          // Данные о каждом рецепте


    // Первоначальное получение данных:
    service.getData(`/recipes/favourite/temp/${pageConfig.temp}/kcal/${pageConfig.kcal}/page/${pageConfig.numPage}`, JWT)
    .then(res => {
        res.prodCard.forEach(dataCard => {
            let newCard = null;
            newCard = new Card(dataCard, true, false);
            cardsItems.push(newCard);
            bindModal(newCard);
            cardsBlock.append(newCard.elem);
        });
    })
    .catch(err => {
        console.log(err);
        localStorage.clear();
        window.location.href = 'http://localhost:3000/auth/login';
    });

    // Реализация подгрузки элементов:
    const loadRecipes = () => {
        if (document.documentElement.clientHeight + window.pageYOffset >= document.documentElement.scrollHeight - 300) {
            pageConfig.numPage++;
            service.getData(`/recipes/favourite/temp/${pageConfig.temp}/kcal/${pageConfig.kcal}/page/${pageConfig.numPage}`, JWT)
            .then(res => {
                if (res.prodCard.length === 0) {
                    document.removeEventListener("scroll", loadRecipes);
                } else {
                    res.prodCard.forEach(dataCard => {
                        let newCard = null;
                        newCard = new Card(dataCard, false, false);
                        cardsItems.push(newCard);
                        bindModal(newCard);
                        cardsBlock.append(newCard.elem);
                    });
                }
            })
            .catch(err => {
                console.log(err);
                localStorage.clear();
                window.location.href = 'http://localhost:3000/auth/login';
            });
        }
    };
    document.addEventListener("scroll", loadRecipes);


    const bindModal = newCard => {
        newCard.elem.addEventListener("click", event => {
            console.log(event.target.classList.contains('icon-delete'));
            if (event.target.classList.contains('icon-delete')) {
                service.getData(`/recipes/user/deleteFavourite/${newCard.recipeId}`, JWT)
                .then(res => {
                    console.log("Рецепт успешно удалён");
                    newCard.elem.remove();
                })
                .catch(err => {
                    console.log(err);
                });
            } else {
                curCard = newCard;
                modal.open();
                modal.renderRecipe(newCard);
                modal.inputWeight.addEventListener("input", bindInputWeight);
                modal.btnAddComm.addEventListener("click", bindAddComm);
                modal.comment.addEventListener("input", bindInputComm);
                document.body.style.overflowY = "hidden";
                service.getData(`/recipes/comments/${newCard.recipeId}`, JWT)
                .then(res => {
                    console.log(res.comments);
                    if (admin === "true") {
                        modal.renderComments(res.comments, true);
                    } else {
                        modal.renderComments(res.comments);
                    }
                    
                })
                .catch(err => {
                    console.log(err);
                });
            }
        });
    };
    const bindInputWeight = event => {
        event.target.value = event.target.value.replace(/\D/g, '');
        if (event.target.value.length === 0) {
            modal.renderRecipe(curCard, event.target.value);
        } else {
            modal.renderRecipe(curCard, event.target.value);
        }
    };
    const bindInputComm = () => {
        if (modal.comment.value.length <= 5) {
            modal.comment.classList.add('input-data_err');
        } else {
            modal.comment.classList.remove('input-data_err');
        }
    };
    const bindAddComm = event => {
        if (modal.comment.value.length > 5) {
            const comment = {
                value: modal.comment.value
            };
            service.postData(`/recipes/addComment/${curCard.recipeId}`, JSON.stringify(comment), JWT)
            .then(res => {
                modal.comment.value = "";
                console.log("Комментарий успешно добавлен");
                service.getData(`/recipes/comments/${curCard.recipeId}`, JWT)
                .then(res => {
                    console.log(res);
                    if (admin === "true") {
                        modal.renderComments(res.comments, true);
                    } else {
                        modal.renderComments(res.comments);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
            })
            .catch(err => {
                console.log(err);
            });
        }
    };

    modal.win.addEventListener("click", event => {
        if (event.target && (event.target === modal.win || event.target === modal.cont)) {
            //modal.inputWeight.addEventListener("input", bindInput);
            modal.inputWeight.removeEventListener("input", bindInputWeight);
            modal.btnAddComm.removeEventListener("click", bindAddComm);
            modal.comment.removeEventListener("input", bindInputComm);
            modal.comment.classList.remove('input-data_err');
            modal.close();
            curCard = null;
            document.body.style.overflowY = "scroll";
        } else if (event.target.classList.contains("icon-delete")) {
            const commentId = event.target.parentElement.parentElement.dataset.commentId;
            service.getData(`/recipes/deleteComment/${commentId}`, JWT)
            .then(res => {
                console.log("Комментарий успешно удалён");
                service.getData(`/recipes/comments/${curCard.recipeId}`, JWT)
                .then(res => {
                    console.log(res);
                    if (admin === "true") {
                        modal.renderComments(res.comments, true);
                    } else {
                        modal.renderComments(res.comments);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
            })
            .catch(err => {
                console.log(err);
            });
        }
    });

    ["change", "input", "cut", "copy", "paste"].forEach(event => {
        inputKcal.addEventListener(event, event => {
            inputKcal.value = inputKcal.value.replace(/\D/g, "");
            if (inputKcal.value.length === 0) {
                pageConfig.kcal = "none";
            } else {
                pageConfig.kcal = +inputKcal.value;
            }
            
        });
    });

    ["change", "input", "cut", "copy", "paste"].forEach(event => {
        search.addEventListener(event, event => {
            if (search.value.length === 0) {
                pageConfig.temp = "none";
            } else {
                pageConfig.temp = search.value;
            }
            
        });
    });

    btnSearch.addEventListener("click", event => {
        event.preventDefault();
        pageConfig.numPage = 0;

        cardsItems.length = 0;
        cardsBlock.innerHTML = "";

        document.removeEventListener("scroll", loadRecipes);
        service.getData(`/recipes/favourite/temp/${pageConfig.temp}/kcal/${pageConfig.kcal}/page/${pageConfig.numPage}`, JWT)
        .then(res => {
            res.prodCard.forEach(dataCard => {
                let newCard = new Card(dataCard, false, false);
                cardsItems.push(newCard);
                bindModal(newCard);
                cardsBlock.append(newCard.elem);
                document.addEventListener("scroll", loadRecipes);
            });
        })
        .catch(err => {
            console.log(err);
        });
    });
};

export default recipeFav;