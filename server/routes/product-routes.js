import productController from "../controllers/product-controller.js";
import express from 'express';

const productRouter = express.Router();

productRouter.get("/", productController.getPage);
productRouter.get("/type/:prodType", productController.getProducts);
productRouter.get("/types", productController.getProductTypes);
productRouter.get("/search/:template", productController.getSpecialProducts);

export default productRouter;