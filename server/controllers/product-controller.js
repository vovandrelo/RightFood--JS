import pool from "../db.js";

class ProductController {
    async getPage(req, res) {
        try {
            res.render("products.pug");
        } catch (err) {
            console.log(`При получении страницы с продуктами с свервера что-то сильно пошло не так...`);
            console.log(`Ошибка: ${err.name}, Сообщение${err.message}`);
        }
    }
    async getProducts(req, res) {
        try {
            let products;
            if (req.params.prodType === "random") {
                products = await pool.query("SELECT * FROM products ORDER BY random() LIMIT 50;");
            } else {
                products = await pool.query("SELECT * FROM products WHERE type = $1;", [req.params.prodType]);
            } 
            res.send(JSON.stringify(products.rows));
        } catch (err) {
            console.log(`При получении указанных продуктов с свервера что-то сильно пошло не так...`);
            console.log(`Ошибка: ${err.name}, Сообщение${err.message}`);
        }
    }
    async getProductTypes(req, res) {
        try {
            const productTypes = await pool.query("SELECT DISTINCT(type) FROM products;");
            res.send(JSON.stringify(productTypes.rows));
        } catch(err) {
            console.log(`При получении типов продуктов с сервера что-то сильно пошло не так...`);
            console.log(`Ошибка: ${err.name}, Сообщение${err.message}`);
        }
    }
    async getSpecialProducts(req, res) {
        try {
            console.log("Запрос пришёл");
            const template = req.params.template.replace(/[^a-zA-Zа-яА-я]/g, "%").split(/\*+/g);
            let templateStr = `%${template.join("%")}%`.toLowerCase();
            const products = await pool.query("SELECT * FROM products WHERE name LIKE $1 LIMIT 50", [templateStr]);
            res.send(JSON.stringify(products.rows));
        } catch(err) {
            console.log(`При получении типов продуктов с сервера что-то сильно пошло не так...`);
            console.log(`Ошибка: ${err.name}, Сообщение${err.message}`);
        }
    }
}

export default new ProductController();