import authController from "../controllers/auth-controller.js";
import express from 'express';

const authRouter = express.Router();

authRouter.get("/registr", authController.getRegistrPage);
authRouter.post("/registr", authController.postRegistr);
authRouter.get("/login", authController.getLoginPage);
authRouter.post("/login", authController.postLogin);

//authRouter.get("/login", authController.getLoginProducts);

export default authRouter;