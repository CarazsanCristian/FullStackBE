import Joi from "joi";
import { NextFunction, Request, Response } from "express";

export const properties = {
  Body: "body",
  Params: "params",
  Query: "query",
};

function JoiMiddleware(schema: Joi.ObjectSchema, property: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[property as keyof Request]);
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");

      res.status(422).json({ error: message });
    }
  };
}

export default JoiMiddleware;
