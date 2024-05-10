import app from "../../app";
import { AppDataSource } from "../../dataSource";
import supertest from "supertest";
import RedisService from "../../services/redis.service";
import authMiddleware from "../../middleware/auth.middleware";
import { getMockReq, getMockRes } from "@jest-mock/express";
import { Request } from "express";

let server: any;
let authToken: string;

jest.setTimeout(10000);

beforeAll(async () => {
  await AppDataSource.initialize();
  server = supertest(app);
});

afterAll(async () => {
  await AppDataSource.destroy();
});

beforeEach(async () => {
  const res = await server.post("/auth/login").send({
    username: "userold",
    password: "Dumb202$",
  });

  authToken = res.body.accessToken;
});

describe("Authenticate token middleware", () => {
  it("should call next if the auth token is valid", async () => {
    const req: Request = getMockReq({
      body: {},
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    });
    const { res } = getMockRes({
      sendStatus: jest.fn(),
    });
    const next = jest.fn();

    await authMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("should return 401 if the token is invalid", async () => {
    const req: Request = getMockReq({
      body: {},
      headers: {
        authorization: `Bearer DSAD${authToken}`,
      },
    });
    const { res } = getMockRes({
      sendStatus: jest.fn(),
    });
    const next = jest.fn();

    const sendResponseSpy: jest.SpyInstance = jest.spyOn(res, "status");
    await authMiddleware(req, res, next);

    expect(sendResponseSpy).toHaveBeenLastCalledWith(401);
  });

  it("should return 401 if the authorization header is not present", async () => {
    const req: Request = getMockReq({
      body: {},
    });
    const { res } = getMockRes({
      sendStatus: jest.fn(),
    });
    const next = jest.fn();

    const sendResponseSpy: jest.SpyInstance = jest.spyOn(res, "status");
    await authMiddleware(req, res, next);

    expect(sendResponseSpy).toHaveBeenLastCalledWith(401);
  });

  it("should return 401 if the authorization header does not contain the Bearer keyword", async () => {
    const req: Request = getMockReq({
      body: {},
      headers: {
        authorization: `${authToken}`,
      },
    });
    const { res } = getMockRes({
      sendStatus: jest.fn(),
    });
    const next = jest.fn();

    const sendResponseSpy: jest.SpyInstance = jest.spyOn(res, "status");
    await authMiddleware(req, res, next);

    expect(sendResponseSpy).toHaveBeenLastCalledWith(401);
  });

  it("should return 401 if the authorization token is not the same with the one in Redis", async () => {
    const req: Request = getMockReq({
      body: {},
      headers: {
        authorization: `Bearer ${authToken}ws`,
      },
    });
    const { res } = getMockRes({
      sendStatus: jest.fn(),
    });
    const next = jest.fn();

    const sendResponseSpy: jest.SpyInstance = jest.spyOn(res, "status");
    await authMiddleware(req, res, next);

    expect(sendResponseSpy).toHaveBeenLastCalledWith(401);
  });
});

describe("Login endpoint", () => {
  it("should return auth token and status 200 if the credentials are correct", async () => {
    const res = await server.post("/auth/login").send({
      username: "userold",
      password: "Dumb202$",
    });
    expect(res.body).toHaveProperty("accessToken");
    expect(res.statusCode).toEqual(200);
  });

  it("if wrong username provided should send status 404", async () => {
    const res = await server.post("/auth/login").send({
      username: "WRONG",
      password: "WRONG",
    });
    expect(res.statusCode).toEqual(404);
  });

  it("if wrong password provided should send status 404", async () => {
    const res = await server.post("/auth/login").send({
      username: "Marti",
      password: "WRONG",
    });
    expect(res.statusCode).toEqual(404);
  });
});

describe("Who Am I endpoint", () => {
  it("should decode the token and return its data", async () => {
    const res = await server
      .get("/auth/who-am-i")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("userId");
  });
});

describe("Logout endpoint", () => {
  it("should delete the auth token from Redis and send status 200", async () => {
    const res = await server
      .post("/auth/logout")
      .set("Authorization", `Bearer ${authToken}`);
    const token = await RedisService.get("1");

    expect(res.statusCode).toEqual(200);
    expect(token).toEqual(null);
  });
});
