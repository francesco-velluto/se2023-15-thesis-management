"use strict";

const request = require("supertest");
const { getDegrees } = require("../service/degrees.service");
const { isLoggedIn } = require("../controllers/authentication");
const app = require("../app");

jest.mock("../service/degrees.service");
jest.mock("../controllers/authentication");

beforeAll(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "info").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

beforeEach(() => {
  //jest.clearAllMocks();
  getDegrees.mockClear();
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("T1 - Get degrees unit tests", () => {
  test("T2.1 - ERROR 401 | Not authenticated", (done) => {
    isLoggedIn.mockImplementation((req, res, next) => {
      return res.status(401).json({ error: "Not authenticated" });
    });

    request(app)
      .get("/api/degrees")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body).toEqual({ error: "Not authenticated" });
        expect(getDegrees).not.toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T2.2 - SUCCESS 200 | Get list of degrees", (done) => {
    const mockList = [
      {
        cod_degree: "D001",
        title_degree: "Computer Engineering"
      },
      {
        cod_degree: "D002",
        title_degree: "Some other Engineering"
      },
    ];

    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // authenticated
    });

    getDegrees.mockResolvedValue(mockList);

    request(app)
      .get("/api/degrees")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ degrees: mockList });
        expect(getDegrees).toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T2.2 - SUCCESS 200 | Get empty list of degrees", (done) => {
    const mockList = [];

    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // authenticated
    });

    getDegrees.mockResolvedValue(mockList);

    request(app)
      .get("/api/degrees")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ degrees: [] });
        expect(getDegrees).toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });
});
