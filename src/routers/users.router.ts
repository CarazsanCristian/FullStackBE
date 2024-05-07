import express from "express";
import joiMiddleware, { properties } from "../middleware/joi.middleware";
import authMiddleware from "../middleware/auth.middleware";
import UsersController from "../controllers/users.controller";
import UsersValidator from "../validators/users.validator";

const userRouter: express.Router = express.Router();

userRouter.post(
  "/",
  joiMiddleware(UsersValidator.userSchema, properties.Body),
  UsersController.createUser
);

userRouter.use(authMiddleware);

userRouter.get(
  "/:userId",
  joiMiddleware(UsersValidator.userIdSchema, properties.Params),
  UsersController.getUser
);

export default userRouter;
