import { NextFunction, Request, Response } from "express";
import JwtService from "../services/jwt.service";
import RedisService from "../services/redis.service";

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const bearerHeader: string | undefined = req.headers.authorization;

  if (bearerHeader === null || bearerHeader === undefined) {
    res.status(401).json({ error: "Unauthorised" });
    return;
  }

  const headerStructure: string[] = bearerHeader.split(" ");
  const bearer: string = headerStructure[0];

  if (bearer !== "Bearer") {
    res.status(401).json({ error: "Unauthorised" });
    return;
  }

  const token: string = headerStructure[1];

  const verifiedToken = JwtService.decodeAuthToken(token);

  if (!verifiedToken) {
    res.status(401).json({ error: "The token is invalid" });
    return;
  }

  const redisToken = await RedisService.get(String(verifiedToken.userId));

  if (token !== redisToken) {
    res.status(401).json({ error: "The token is invalid" });
    return;
  }

  res.locals.user = verifiedToken;
  next();
}

export default authMiddleware;
