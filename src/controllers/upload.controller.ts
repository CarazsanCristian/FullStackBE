import { NextFunction, Request, Response } from "express";
import fs from "fs";
import csv from "csv-parser";
import { ShoppingItem } from "../entities/shoppingItem";
import { AppDataSource } from "../dataSource";
var removeBOM = require("remove-bom-stream");

class UploadController {
  async createItem(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    if (!req.file) {
      return res.status(400).send("No files were uploaded.");
    }
    try {
      const file: Express.Multer.File = req.file;
      const results: any = [];

      fs.createReadStream(file.path)
        .pipe(removeBOM("utf-8"))
        .pipe(csv())
        .on("data", (data: any) => results.push(data))
        .on("end", async () => {
          const entries = results.map((shoppingItem: any) => {
            const reskeys = Object.keys(shoppingItem);
            const newRow = new ShoppingItem();

            newRow.productName = shoppingItem[reskeys[0]];
            newRow.category = shoppingItem[reskeys[1]];
            newRow.quantity = shoppingItem[reskeys[2]];
            newRow.price = shoppingItem[reskeys[3]];

            return newRow;
          }, []);

          AppDataSource.manager.save(entries);

          fs.unlinkSync(file.path);
          res.status(200).send(entries);
        });
    } catch (err) {
      next(err);
    }
  }
}

export default new UploadController();
