import pool from "../db.js";
import bcrypt from "bcrypt";
import { sha256 } from 'js-sha256';
import base64url from "base64url";


const secretKey = "SECRET-KEY-RANDOM";

class EnegryValueController {
    async getPage(req, res) {
        try {
            res.render("enegryValue.pug");
        } catch (err) {
            console.log(`При получении страницы с регистрацией с свервера что-то сильно пошло не так...`);
            console.log(`Ошибка: ${err.name}, Сообщение${err.message}`);
        }
    }
    async addEnegryValue(req, res) {
        try {
            await pool.query("UPDATE users SET kcal=$1 WHERE id=$2", [+req.body.result, +req.user.id]);
            res.send(JSON.stringify({message: "ok"}));
        } catch (err) {
            console.log(`При получении страницы с регистрацией с свервера что-то сильно пошло не так...`);
            console.log(`Ошибка: ${err.name}, Сообщение${err.message}`);
        }
    }
    
}

export default new EnegryValueController();