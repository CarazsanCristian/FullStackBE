import Redis, { RedisOptions } from "ioredis";

type setItemData = {
  key: string;
  value: string;
};

class RedisService {
  private client: Redis;

  constructor() {
    const redisUrl =
      `redis://${process.env.REDIS_DOMAIN}:${process.env.REDIS_PORT}` ||
      "redis://localhost:6379";
    const redisDefaultConfig: RedisOptions = {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    };

    this.client = new Redis(redisUrl, redisDefaultConfig);
  }

  async set(data: setItemData) {
    const { key, value } = data;

    await this.client.set(
      key,
      value,
      "EX",
      parseInt(process.env.ACCESS_TOKEN_EXPIRATION || "1800", 10)
    );
  }

  async get(key: string) {
    // await this.client.connect();
    const result = await this.client.get(key);
    // await this.client.disconnect();
    return result;
  }

  async destroy(key: string) {
    // await this.client.connect();
    await this.client.del(key);
    // await this.client.disconnect();
  }
}

export default new RedisService();
