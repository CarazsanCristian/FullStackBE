import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../entities/user";

dotenv.config();

interface tokenData {
  userId: number;
  username: string;
}
class JwtService {
  async generateAuthToken(user: User) {
    const tokenContent: tokenData = {
      userId: user.userId,
      username: user.username,
    };

    return jwt.sign(
      { ...tokenContent },
      process.env.ACCESS_TOKEN_SECRET || "ACCESS_TOKEN"
    );
  }

  decodeAuthToken(token: string): tokenData | null {
    try {
      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      );
      return decodedToken as tokenData;
    } catch (e) {
      return null;
    }
  }
}

export default new JwtService();
