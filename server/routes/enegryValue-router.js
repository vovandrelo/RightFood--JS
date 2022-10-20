import EnegryValueController from "../controllers/enegryValue-controller.js";
import express from 'express';


import { sha256 } from 'js-sha256';
import base64url from "base64url";

const secretKey = "SECRET-KEY-RANDOM";
const enegryValueRouter = express.Router();

/* <================================================================================================================> */
/* <================================================== ПРОВЕРКА JWT-токена =========================================> */
/* <================================================================================================================> */

const checkJWT = (req, res, next) => {
    try {
        // Получение JWT токена из заголовка запроса:
        const JWT = req.headers.authorization.split(' ')[1];

        // Декодируем фрагменты полученного JWT-токена:
        const [header, payload, signature] = JWT.split(".");
        const decodedHeader = JSON.parse(base64url.decode(header));
        const decodedPayload = JSON.parse(base64url.decode(payload));

        // На основе секретного ключа формируем новую подпись:
        const headerBase64url = base64url(JSON.stringify(decodedHeader));
        const payloadBase64url = base64url(JSON.stringify(decodedPayload));
        const newSignature = sha256.hmac(secretKey, headerBase64url + "." + payloadBase64url);

        // Если JWT-токен корректен(пришедшая и созданная подписи совпадают) и время действия токена не истекло, то:
        if (signature === newSignature && +decodedPayload.endTime > Date.now()) {
            // Добавляем к объекту запроса данные и пользователе из JWT-токена:
            req.user = {...decodedPayload};
            // Переходим к выполнению следующей Middleware:
            next();
        // В противном случае выдаём ошибку:
        } else {
            throw new Error("JWT-токен некорректен!");
        }
    // Если в процессе проверки JWT-токена произошла ошибка, то:
    } catch (err) {
        // Выводим сообщение об ошибке и высылаем соответствующий ответ сервера:
        console.log(`При проверке JWT-токена что-то сильно пошло не так...`);
        console.log(`Ошибка: ${err.name}, Сообщение: ${err.message}`);
        res.status(401).send(JSON.stringify({message: "JWT is incorrect"}));
    }
};


enegryValueRouter.get("/", EnegryValueController.getPage);
enegryValueRouter.post("/add", checkJWT, EnegryValueController.addEnegryValue);

export default enegryValueRouter;