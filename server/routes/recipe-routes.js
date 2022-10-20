import recipeController from "../controllers/recipe-controller.js";
import express from 'express';
import multer from "multer";
import { sha256 } from 'js-sha256';
import base64url from "base64url";

const secretKey = "SECRET-KEY-RANDOM";

/* <================================================================================================================> */
/* <=================================================== НАСТРОЙКА MULTER ===========================================> */
/* <================================================================================================================> */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,  'public/upload-imgs/');
    },
    filename: function (req, file, cb) {
        if (file.mimetype === "image/png") {
            cb(null, "img" + '-' + Date.now() + '.png');
        } else if (file.mimetype === "image/jpg") {
            cb(null, "img" + '-' + Date.now() + '.jpg');
        } else if (file.mimetype === "image/jpeg") {
            cb(null, "img" + '-' + Date.now() + '.jpeg');
        }
    }
});
const upload = multer({ storage: storage });

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

/* <================================================================================================================> */
/* <=================================================== ---------------- ===========================================> */
/* <================================================================================================================> */

const recipeRouter = express.Router();

// Получение необходимых страницы с рецептами:
recipeRouter.get("/all", recipeController.getPageAll);
recipeRouter.get("/user", recipeController.getPageUser);
recipeRouter.get("/favourite", recipeController.getPageFav);

// Добавление необходимых рецептов:
recipeRouter.post("/user/createRecipe", upload.single('fileImage'), checkJWT, recipeController.createRecipe);

// Получение необходимых рецептов:
recipeRouter.get("/all/temp/:temp/kcal/:kcal/page/:page", recipeController.getAllRec);
recipeRouter.get("/user/temp/:temp/kcal/:kcal/page/:page", checkJWT, recipeController.getUserRec);
recipeRouter.get("/favourite/temp/:temp/kcal/:kcal/page/:page", checkJWT, recipeController.getFavRec);

// Действия над рецептами:
// Удаление рецептов
recipeRouter.get("/delete/:recipeId", checkJWT, recipeController.deleteUserRec);
// Добавление избранных рецептов
recipeRouter.get("/user/addFavourite/:recipeId", checkJWT, recipeController.addFavUserRec);
// Удаление избранных рецептов
recipeRouter.get("/user/deleteFavourite/:recipeId", checkJWT, recipeController.delFavUserRec);

// Комментарии:
recipeRouter.post("/addComment/:recipeId", checkJWT, recipeController.addComment);      // Добавление комментария
recipeRouter.get("/comments/:recipeId", checkJWT, recipeController.getComments);        // Получение комментариев
recipeRouter.get("/deleteComment/:commentId", checkJWT, recipeController.deleteComment); // Удаление комментария


export default recipeRouter;