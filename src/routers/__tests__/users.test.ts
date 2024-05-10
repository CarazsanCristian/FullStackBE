import { AppDataSource } from "../../dataSource";
import request, { Response } from "supertest";
import app from "../../app";
import { User } from "../../entities/user";

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
  await AppDataSource.getRepository(User).delete({
    username: "test3",
  });
  await AppDataSource.destroy();
});

describe("Post user endpoint", () => {
  it("should create a new user", async () => {
    const res: Response = await server.post("/users/").send({
      username: "test3",
      password: "test3",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual("User successfully created!");
  });
});

describe("Get users/:id endpoint", () => {
  it("should get user details for userId", async () => {
    const response: object = {
      userId: 1,
      username: "usernew",
      password: expect.anything(),
    };
    const res: Response = await server
      .get("/users/1")
      .set("Authorization", "Bearer".concat(" ", authToken));
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(response);
  });
});
