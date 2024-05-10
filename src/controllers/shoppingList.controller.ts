import { NextFunction, Request, Response } from "express";
import { ShoppingItem } from "../entities/shoppingItem";

class ShoppingListController {
  async getShoppingItems(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const responseBody = await ShoppingItem.getShoppingItems();

      res.status(200).json(responseBody);
    } catch (err) {
      next(err);
    }
  }
}

export default new ShoppingListController();
