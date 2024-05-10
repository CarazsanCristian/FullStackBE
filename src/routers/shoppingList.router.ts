import express from "express";
import authMiddleware from "../middleware/auth.middleware";
import ShoppingListController from "../controllers/shoppingList.controller";

const shoppingListRouter = express.Router();

shoppingListRouter.use(authMiddleware);

shoppingListRouter.get("/", ShoppingListController.getShoppingItems);

export default shoppingListRouter;
