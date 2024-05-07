import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../entities/user";
import { checkForDuplicatedUsers } from "../utils/user";

class UsersController {
  async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { username, password } = req.body;

    try {
      await checkForDuplicatedUsers(username);

      const salt: string = await bcrypt.genSalt();
      const hashedPassword: string = await bcrypt.hash(password, salt);

      await User.createUser(username, hashedPassword).then(() =>
        res.status(200).json("User successfully created!")
      );
    } catch (err) {
      next(err);
    }
  }

  async getUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const id = Number(req.params.userId);

    try {
      const responseBody: User = await User.getUserById(id);
      res.status(200).json(responseBody);
    } catch (err) {
      next(err);
    }
  }
}

export default new UsersController();
