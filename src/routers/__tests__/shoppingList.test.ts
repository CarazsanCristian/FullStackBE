import { AppDataSource } from "../../dataSource";
import request, { Response } from "supertest";
import app from "../../app";
import { ShoppingItem } from "../../entities/shoppingItem";

let server: any;
let authToken: string;

beforeAll(async () => {
  server = request(app);
  await AppDataSource.initialize();
});

beforeEach(async () => {
  const res: Response = await server.post("/auth/login").send({
    username: "userold",
    password: "Dumb202$",
  });
  authToken = res.body.accessToken;
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe("Shopping list items", () => {
  it("should get all shopping items", async () => {
    const res: Response = await server
      .get("/shopping-list/")
      .set("Authorization", "Bearer".concat(" ", authToken));
    expect(res.statusCode).toEqual(200);
    expect(Object.keys(res.body[0])).toEqual([
      "itemId",
      "productName",
      "category",
      "quantity",
      "price",
    ]);
  });
});
