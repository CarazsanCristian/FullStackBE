import express from 'express';
import authMiddleware from '../middleware/auth.middleware';
import joiMiddleware, { properties } from '../middleware/joi.middleware';
import AuthController from '../controllers/auth.controller';
import AuthValidator from '../validators/auth.validator';

const authRouter = express.Router();

authRouter.post(
  '/login',
  joiMiddleware(AuthValidator.loginSchema, properties.Body),
  AuthController.loginUser,
);

authRouter.use(authMiddleware);

authRouter.post(
  '/logout',
  AuthController.logout,
);


authRouter.get(
  '/who-am-i',
  AuthController.whoAmI,
);

export default authRouter;
