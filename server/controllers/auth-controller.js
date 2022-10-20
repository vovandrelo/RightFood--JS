import pool from "../db.js";
import bcrypt from "bcrypt";
import { sha256 } from 'js-sha256';
import base64url from "base64url";


const secretKey = "SECRET-KEY-RANDOM";

class AuthController {
    async getRegistrPage(req, res) {
        try {
            res.render("registr.pug");
        } catch (err) {
            console.log(`При получении страницы с регистрацией с свервера что-то сильно пошло не так...`);
            console.log(`Ошибка: ${err.name}, Сообщение${err.message}`);
        }
    }
    async getLoginPage(req, res) {
        try {
            res.render("login.pug");
        } catch (err) {
            console.log(`При получении страницы со входом с свервера что-то сильно пошло не так...`);
            console.log(`Ошибка: ${err.name}, Сообщение${err.message}`);
        }
    }
    async postRegistr(req, res) {
        try {
            const check = await pool.query('SELECT login FROM users WHERE login = $1', [req.body.login]);
            if (check.rows.length === 0) {
                const {login, name, pass} = req.body;
                const hashPass = bcrypt.hashSync(pass, 10);
                await pool.query('INSERT INTO users(login, password, name, admin) VALUES ($1, $2, $3, $4) RETURNING *', [login, hashPass, name, false]);
                res.send(JSON.stringify({message: "Пользователь успешно зарегистрирован"}));
            } else {
                throw new Error("Пользователь уже существует");
            }
        } catch (err) {
            console.log(`При регистрации пользователя что-то сильно пошло не так...`);
            console.log(`Ошибка: ${err.name}, Сообщение: ${err.message}`);
        }
    }
    async postLogin(req, res) {
        try {
            const {login: clientLogin, pass: clientPass} = req.body;
            const user = await pool.query('SELECT id, login, password, admin, name FROM users WHERE login = $1', [clientLogin]);
            if (user.rows[0]) {
                const {id, login, name, password, admin} = user.rows[0];
                if (bcrypt.compareSync(clientPass, password)) {
                    console.log("Вход успешно выполнен!");

                    // Создание JWT:
                    const header = {
                        "alg": "HS256",
                        "typ": "JWT"
                    };
                    const payload = {
                        id,
                        admin,
                        endTime: Date.now() + 3600000
                    };
                
                    const headerBase64url = base64url(JSON.stringify(header));
                    const payloadBase64url = base64url(JSON.stringify(payload));
                    const signature = sha256.hmac(secretKey, headerBase64url + "." + payloadBase64url);
                
                    const JWT = headerBase64url + "." + payloadBase64url + "." + signature;

                    res.send(JSON.stringify({JWT, id, admin}));
                } else {
                    throw new Error("Неверный пароль!");
                }
            } else {
                throw new Error("Пользователь не найден!");
            }
        } catch (err) {
            console.log(`При авторизации пользователя что-то сильно пошло не так...`);
            console.log(`Ошибка: ${err.name}, Сообщение: ${err.message}`);
        }
    }
}

export default new AuthController();