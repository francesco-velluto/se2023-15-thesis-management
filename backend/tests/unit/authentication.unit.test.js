"use strict";

const request = require("supertest");
const app = require("../../app");

const { getUserById, authUser } = require("../../service/authentication");
const Teacher = require("../../model/Teacher");

jest.mock("../../service/authentication");

beforeAll(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "log").mockImplementation(() => { });
  jest.spyOn(console, "info").mockImplementation(() => { });
  jest.spyOn(console, "error").mockImplementation(() => { });
});

beforeEach(() => {
  //jest.clearAllMocks();
  getUserById.mockClear();
  authUser.mockClear();
});

describe.skip("Authentication Unit Tests", () => {
  test("ERROR 400 | Missing username", async () => {
    const mockCredentials = { username: "", password: "asd" };

    const res = await request(app)
      .post("/api/authentication/login")
      .send(mockCredentials);

    expect(res.status).toBe(400);
    expect(res.body.errors).not.toBeFalsy();
  });

  test("ERROR 400 | Invalid email", async () => {
    const mockCredentials = { username: "notanemail", password: "asd" };

    const res = await request(app)
      .post("/api/authentication/login")
      .send(mockCredentials);

    expect(res.status).toBe(400);
    expect(res.body.errors).not.toBeFalsy();
  });

  test("ERROR 400 | Missing password", async () => {
    const mockCredentials = {
      username: "valid.email@example.com",
      password: "",
    };

    const res = await request(app)
      .post("/api/authentication/login")
      .send(mockCredentials);

    expect(res.status).toBe(400);
    expect(res.body.errors).not.toBeFalsy();
  });

  test("ERROR 401 | Wrong username or password", async () => {
    authUser.mockResolvedValue(undefined);

    const mockCredentials = {
      username: "valid.email@example.com",
      password: "wrongpassword",
    };

    const res = await request(app)
      .post("/api/authentication/login")
      .send(mockCredentials);

    expect(res.status).toBe(401);
    expect(res.body.errors).not.toBeFalsy();
  });

  test("ERROR 500 | Internal server error", async () => {
    authUser.mockImplementation(async (username, password) => {
      throw new Error("error");
    });

    const mockCredentials = {
      username: "valid.email@example.com",
      password: "password",
    };

    const res = await request(app)
      .post("/api/authentication/login")
      .send(mockCredentials);

    expect(res.status).toBe(500);
    expect(res.body.errors).not.toBeFalsy();
  });

  test("SUCCESS | Login", async () => {
    const user = new Teacher(
      "T001",
      "Smith",
      "John",
      "john.smith@example.com",
      "G001",
      "D001"
    );
    authUser.mockResolvedValue(user);

    const mockCredentials = {
      username: "john.smith@example.com",
      password: "T001",
    };

    const res = await request(app)
      .post("/api/authentication/login")
      .send(mockCredentials);

    expect(res.status).toBe(200);
    expect(res.body.errors).toBeFalsy();
    expect(res.body).toEqual(user);
  });
});
