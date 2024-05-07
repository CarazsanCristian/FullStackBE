import { NextFunction, Request, Response } from "express";
import * as dotenv from "dotenv";
import { AppDataSource } from "../dataSource";
import { User } from "../entities/user";
import JwtService from "../services/jwt.service";
import RedisService from "../services/redis.service";
import bcrypt from "bcryptjs";

dotenv.config();

class AuthController {
  async loginUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userFound: User | null = await AppDataSource.getRepository(
      User
    ).findOneBy({
      username: req.body.username,
    });

    if (!userFound) {
      res.status(404).json({
        error: [
          {
            message: "Username or password incorrect!",
          },
        ],
      });
      return;
    }

    const checkPassword = await bcrypt.compare(
      req.body.password,
      userFound.password
    );

    if (checkPassword) {
      const accessToken = await JwtService.generateAuthToken(userFound);
      try {
        await RedisService.set({
          key: String(userFound.userId),
          value: accessToken,
        });
        res.status(200).json({ accessToken });
      } catch (e) {
        next(e);
        return;
      }
    } else {
      res.status(404).json({ error: "Username or password incorrect" });
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    const { user } = res.locals;

    try {
      await RedisService.destroy(String(user.userId));
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }

  async whoAmI(req: Request, res: Response, next: NextFunction) {
    const { user } = res.locals;
    res.status(200).json(user);
  }
}

export default new AuthController();
