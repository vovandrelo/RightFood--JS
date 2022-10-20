import pool from "../db.js";





class RecipeController {
    async getPageUser(req, res) {
        try {
            res.render("userRecipes.pug");
        } catch (err) {
            console.log(`При получении страницы с продуктами с свервера что-то сильно пошло не так...`);
            console.log(`Ошибка: ${err.name}, Сообщение${err.message}`);
        }
    }

    async getPageAll(req, res) {
        try {
            res.render("allRecipes.pug");
        } catch (err) {
            console.log(`При получении страницы с продуктами с свервера что-то сильно пошло не так...`);
            console.log(`Ошибка: ${err.name}, Сообщение${err.message}`);
        }
    }

    async getPageFav(req, res) {
        try {
            res.render("favRecipes.pug");
        } catch (err) {
            console.log(`При получении страницы с продуктами с свервера что-то сильно пошло не так...`);
            console.log(`Ошибка: ${err.name}, Сообщение${err.message}`);
        }
    }


    // Функция создания рецепта:
    async createRecipe(req, res) {
        try {
            // Формирование запроса
            const reqAddRec = "INSERT INTO recipes(type, rec_name, recipe_descr, user_id, photo_name) VALUES ($1, $2, $3, $4, $5) RETURNING *";
            let reqAddRecData = null;

            // Если в запросе содержатся файлы(изображения), то:
            if (req.file) {
                // Формируем массив отправляемых в БД данных для создания рецепта:
                reqAddRecData = ["", req.body.recipeName, req.body.recipeDescr, +req.user.id, req.file.filename];
            // В Противном случае:
            } else {
                // Формируем массив отправляемых в БД данных для создания рецепта:
                reqAddRecData = ["", req.body.recipeName, req.body.recipeDescr, +req.user.id, ""];
            }

            // Выполнение запроса на создание нового рецепта:
            let idRecipe = await pool.query(reqAddRec, reqAddRecData);
            // Получение id только что созданного рецепта:
            idRecipe = idRecipe.rows[0].id;

            // Если с клиента пришли корректные данные (Кол-во id рецептов совпадает с кол-вом коэффициентов), то:
            if (req.body.prodID.length === req.body.prodRatio.length) {
                // Получаем количество продуктов в рецепте:
                const numProd = req.body.prodID.length;
                // Перебираем все продукты:
                for(let i = 0; i < numProd; i++) {
                    // Выполняем запрос для каждого продукта на присоединение к созданному рецептыу:
                    const reqAddProd = "INSERT INTO recipe_products(recipes_id, products_id, ratio) VALUES ($1, $2, $3)";
                    const reqAddProdData = [+idRecipe, +req.body.prodID[i], +req.body.prodRatio[i]];
                    await pool.query(reqAddProd, reqAddProdData);
                }
                // Если в процессе создания рецепта не произошло ошибок, отправляем соответствующее уведомление:
                res.send(JSON.stringify({message: "ok"}));
            // Если с клиента пришли некорректные данные, то:
            } else {
                // Выкидываем ошибку с соответствующим сообщением:
                throw new Error("Количество id продуктов не совпадает с количеством коэффициентов");
            }
        // Если в процессе создание рецепта произошла ошибка, то:
        } catch (err) {
            // Выводим соответствующие сообщения:
            console.log(`При добавлении рецепта что-то сильно пошло не так...`);
            console.log(`Ошибка: ${err.name}, Сообщение: ${err.message}`);
        }
    }

    async deleteUserRec(req, res) {
        try {
            const userRecipes = await pool.query("SELECT id FROM recipes WHERE user_id = $1", [+req.user.id]);
            if (userRecipes.rows.some(elem => elem.id === +req.params.recipeId) || req.user.admin) {
                let reqDelProds = "DELETE FROM recipe_products WHERE recipes_id = $1";
                let reqDelFav = "DELETE FROM favourite_recipes WHERE id_recipe = $1";
                let reqDelRec = "DELETE FROM recipes WHERE id = $1";
                let reqDataRecipes = [req.params.recipeId];

                await pool.query(reqDelProds, reqDataRecipes);
                await pool.query(reqDelFav, reqDataRecipes);
                await pool.query(reqDelRec, reqDataRecipes);

                res.send(JSON.stringify({message: "ok"}));
            } else {
                throw new Error("Ошибка удаления рецепта!");
            }
        } catch (err) {
            console.log(`При попытке удаления рецепта что-то сильно пошло не так...`);
            console.log(`Ошибка: ${err.name}, Сообщение: ${err.message}`);
        }
    }

    async getUserRec(req, res) {
        try {
            let reqGetRecipes = "";
            let reqDataRecipes = [];

            const userID = +req.user.id;
            const temp = ((req.params.temp === 'none') ? false : `%${req.params.temp}%`);
            const kcal = ((req.params.kcal === 'none') ? false : +req.params.kcal);
            const page = +req.params.page;

            reqGetRecipes = `
                SELECT recipes.id, recipes.recipe_descr, recipes.photo_name, recipes.rec_name, recipes.user_id,
                    (SUM(products.kcal * recipe_products.ratio) * 100)/(SUM(100 * recipe_products.ratio)) AS sum
                FROM recipes
                    JOIN recipe_products ON recipes.id = recipe_products.recipes_id
                    JOIN products ON recipe_products.products_id = products.id
            `;

            let i = 0;
            
            reqGetRecipes += `WHERE recipes.user_id = $${++i}`;
            reqDataRecipes.push(userID);
            console.log("Вывод рецептов юзера с id", userID);


            if (temp) {
                reqGetRecipes += ` AND rec_name LIKE $${++i}`;
                reqDataRecipes.push(temp);
                console.log("Вывод рецептов с шаблоном:", temp);
            }

            reqGetRecipes += `
                GROUP BY recipes.id
            `;

            if (kcal) {
                ++i;
                reqGetRecipes += `
                    HAVING (SUM(products.kcal * recipe_products.ratio) * 100)/(SUM(100 * recipe_products.ratio))
                    BETWEEN $${i}-100 AND $${i}+100
                `;
                reqDataRecipes.push(kcal);
                console.log("Вывод рецептов с приближенной калорийностью:", kcal);
            }

            reqGetRecipes += `
                ORDER BY recipes.rec_name
            `;


            reqGetRecipes += ` LIMIT 10 OFFSET $${++i} * 10;`;
            reqDataRecipes.push(page);
            console.log("Вывод рецептов со страницы:", page);

            const recipes = await pool.query(reqGetRecipes, reqDataRecipes);

            const createResponse = async () => {
                const prodCard = [];
                for (let i = 0; i < recipes.rows.length; i++) {
                    const products = await pool.query(`
                        SELECT
                            products.id, products.name, recipe_products.ratio, products.kcal, products.proteins, products.fats, products.carbohydrates
                        FROM recipes
                            JOIN recipe_products ON recipes.id = recipe_products.recipes_id
                            JOIN products ON recipe_products.products_id = products.id
                        WHERE recipes.id = $1`, [recipes.rows[i].id]);
                    prodCard.push(recipes.rows[i]);
                    prodCard[i].products = products.rows;
                }
                return prodCard;

            };

            const prodCard = await createResponse();
            res.send(JSON.stringify({message: "ok", prodCard}));

        } catch (err) {
            console.log(`При получении рецептов пользователя что-то сильно пошло не так...`);
            console.log(`Ошибка: ${err.name}, Сообщение: ${err.message}`);
        }
    }

    async addFavUserRec(req, res) {
        try {
            const check = await pool.query("SELECT * FROM favourite_recipes WHERE id_recipe = $1 AND id_user = $2", [+req.params.recipeId, +req.user.id]);
            console.log(check.rows);
            if (check.rows.length === 0) {
                await pool.query("INSERT INTO favourite_recipes(id_recipe, id_user) VALUES ($1, $2)", [+req.params.recipeId, +req.user.id]);
            }
            res.send(JSON.stringify({message: "ok"}));
        } catch (err) {
            console.log(`При попытке удаления рецепта что-то сильно пошло не так...`);
            console.log(`Ошибка: ${err.name}, Сообщение: ${err.message}`);
        }
    }

    async delFavUserRec(req, res) {
        try {
            await pool.query("DELETE FROM favourite_recipes WHERE id_user = $1 AND id_recipe = $2", [+req.user.id, req.params.recipeId]);
            res.send(JSON.stringify({message: "ok"}));
        } catch (err) {
            console.log(`При попытке удаления рецепта что-то сильно пошло не так...`);
            console.log(`Ошибка: ${err.name}, Сообщение: ${err.message}`);
        }
    }

    async getAllRec(req, res) {
        try {
            let reqGetRecipes = "";
            let reqDataRecipes = [];

            const temp = ((req.params.temp === 'none') ? false : `%${req.params.temp}%`);
            const kcal = ((req.params.kcal === 'none') ? false : +req.params.kcal);
            const page = +req.params.page;


            reqGetRecipes = `
                SELECT recipes.id, recipes.recipe_descr, recipes.photo_name, recipes.rec_name, recipes.user_id,
                    (SUM(products.kcal * recipe_products.ratio) * 100)/(SUM(100 * recipe_products.ratio)) AS sum
                FROM recipes
                    JOIN recipe_products ON recipes.id = recipe_products.recipes_id
                    JOIN products ON recipe_products.products_id = products.id
            `;

            let i = 0;

            if (temp) {
                reqGetRecipes += `WHERE rec_name LIKE $${++i}`;
                reqDataRecipes.push(temp);
                console.log("Вывод рецептов с шаблоном:", temp);
            }

            reqGetRecipes += `
                GROUP BY recipes.id
            `;

            if (kcal) {
                ++i;
                reqGetRecipes += `
                    HAVING (SUM(products.kcal * recipe_products.ratio) * 100)/(SUM(100 * recipe_products.ratio))
                    BETWEEN $${i}-100 AND $${i}+100
                `;
                reqDataRecipes.push(kcal);
                console.log("Вывод рецептов с приближенной калорийностью:", kcal);
            }

            reqGetRecipes += `
                ORDER BY recipes.rec_name
            `;


            reqGetRecipes += ` LIMIT 10 OFFSET $${++i} * 10;`;
            reqDataRecipes.push(page);
            console.log("Вывод рецептов со страницы:", page);

            const recipes = await pool.query(reqGetRecipes, reqDataRecipes);

            const createResponse = async () => {
                const prodCard = [];
                for (let i = 0; i < recipes.rows.length; i++) {
                    const products = await pool.query(`SELECT
                        products.id, products.name, recipe_products.ratio, products.kcal, products.proteins, products.fats, products.carbohydrates
                        FROM recipes
                            JOIN recipe_products ON recipes.id = recipe_products.recipes_id
                            JOIN products ON recipe_products.products_id = products.id
                        WHERE recipes.id = $1`, [recipes.rows[i].id]);
                    prodCard.push(recipes.rows[i]);
                    prodCard[i].products = products.rows;
                }
                return prodCard;
            };

            const prodCard = await createResponse();
            res.send(JSON.stringify({message: "ok", prodCard}));

        } catch (err) {
            console.log(`При получении рецептов пользователя что-то сильно пошло не так...`);
            console.log(`Ошибка: ${err.name}, Сообщение: ${err.message}`);
        }
    }

    async getFavRec(req, res) {
        try {
            let reqGetRecipes = "";
            let reqDataRecipes = [];

            const temp = ((req.params.temp === 'none') ? false : `%${req.params.temp}%`);
            const kcal = ((req.params.kcal === 'none') ? false : +req.params.kcal);
            const page = +req.params.page;


            reqGetRecipes = `
                SELECT recipes.id, recipes.recipe_descr, recipes.photo_name, recipes.rec_name, recipes.user_id,
                    (SUM(products.kcal * recipe_products.ratio) * 100)/(SUM(100 * recipe_products.ratio)) AS sum
                FROM recipes
                    JOIN recipe_products ON recipes.id = recipe_products.recipes_id
                    JOIN products ON recipe_products.products_id = products.id
            `;

            let i = 0;

            reqGetRecipes += `WHERE recipes.id IN (SELECT id_recipe FROM favourite_recipes WHERE id_user = $${++i})`;
            reqDataRecipes.push(+req.user.id);
            console.log("Вывод любимых рецептов пользователя:", +req.user.id);

            if (temp) {
                reqGetRecipes += ` AND rec_name LIKE $${++i}`;
                reqDataRecipes.push(temp);
                console.log("Вывод рецептов с шаблоном:", temp);
            }

            reqGetRecipes += `
                GROUP BY recipes.id
            `;

            if (kcal) {
                ++i;
                reqGetRecipes += `
                    HAVING (SUM(products.kcal * recipe_products.ratio) * 100)/(SUM(100 * recipe_products.ratio))
                    BETWEEN $${i}-100 AND $${i}+100
                `;
                reqDataRecipes.push(kcal);
                console.log("Вывод рецептов с приближенной калорийностью:", kcal);
            }

            reqGetRecipes += `
                ORDER BY recipes.rec_name
            `;


            reqGetRecipes += ` LIMIT 10 OFFSET $${++i} * 10;`;
            reqDataRecipes.push(page);
            console.log("Вывод рецептов со страницы:", page);

            console.log(reqGetRecipes);

            const recipes = await pool.query(reqGetRecipes, reqDataRecipes);

            const createResponse = async () => {
                const prodCard = [];
                for (let i = 0; i < recipes.rows.length; i++) {
                    const products = await pool.query(`SELECT
                        products.id, products.name, recipe_products.ratio, products.kcal, products.proteins, products.fats, products.carbohydrates
                        FROM recipes
                            JOIN recipe_products ON recipes.id = recipe_products.recipes_id
                            JOIN products ON recipe_products.products_id = products.id
                        WHERE recipes.id = $1`, [recipes.rows[i].id]);
                    prodCard.push(recipes.rows[i]);
                    prodCard[i].products = products.rows;
                }
                return prodCard;
            };

            const prodCard = await createResponse();
            res.send(JSON.stringify({message: "ok", prodCard}));
        } catch (err) {
            console.log(`При попытке удаления рецепта что-то сильно пошло не так...`);
            console.log(`Ошибка: ${err.name}, Сообщение: ${err.message}`);
        }
    }
    async addComment(req, res) {
        try {
            console.log(req.params);
            console.log(req.body);
            console.log("Кинули запрос");
            await pool.query("INSERT INTO comments(date, content, user_id, recipe_id) VALUES (CURRENT_DATE, $1, $2, $3)", [req.body.value, +req.user.id, +req.params.recipeId]);
            res.send(JSON.stringify({message: "ok"}));
        } catch (err) {
            console.log(`При попытке удаления рецепта что-то сильно пошло не так...`);
            console.log(`Ошибка: ${err.name}, Сообщение: ${err.message}`);
        }
    }
    async getComments(req, res) {
        try {
            const comments = await pool.query("SELECT comments.id, comments.date, comments.content, comments.recipe_id, comments.user_id, users.name FROM comments JOIN users ON comments.user_id = users.id WHERE comments.recipe_id = $1", [+req.params.recipeId]);
            res.send(JSON.stringify({message: "ok", comments: comments.rows}));
        } catch (err) {
            console.log(`При попытке удаления рецепта что-то сильно пошло не так...`);
            console.log(`Ошибка: ${err.name}, Сообщение: ${err.message}`);
        }
    }
    async deleteComment(req, res) {
        try {
            if (req.user.admin) {
                await pool.query("DELETE FROM comments WHERE id = $1", [+req.params.commentId]);
            }
            
            res.send(JSON.stringify({message: "ok"}));
        } catch (err) {
            console.log(`При попытке удаления рецепта что-то сильно пошло не так...`);
            console.log(`Ошибка: ${err.name}, Сообщение: ${err.message}`);
        }
    }
}

export default new RecipeController();