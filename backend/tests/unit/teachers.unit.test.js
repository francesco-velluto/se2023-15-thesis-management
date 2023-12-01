"use strict";

const request = require("supertest");
const { getTeachers } = require("../../service/teachers.service");
const { isLoggedIn } = require("../../controllers/authentication");
const app = require("../../app");

jest.mock("../../service/teachers.service");
jest.mock("../../controllers/authentication");

beforeAll(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "info").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

beforeEach(() => {
  //jest.clearAllMocks();
  getTeachers.mockClear();
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("T1 - Get teachers unit tests", () => {
  test("T2.1 - ERROR 401 | Not authenticated", (done) => {
    isLoggedIn.mockImplementation((req, res, next) => {
      return res.status(401).json({ error: "Not authenticated" });
    });

    request(app)
      .get("/api/teachers")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body).toEqual({ error: "Not authenticated" });
        expect(getTeachers).not.toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T2.2 - SUCCESS 200 | Get list of teachers", (done) => {
    const mockList = [
      {
        id: "T001",
        surname: "Smith",
        name: "John",
        email: "john.smith@polito.it",
        cod_group: "G001",
        cod_department: "D001",
      },
      {
        id: "T002",
        surname: "Doe",
        name: "John",
        email: "john.doe@polito.it",
        cod_group: "G002",
        cod_department: "D002",
      },
    ];

    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // authenticated
    });

    getTeachers.mockResolvedValue(mockList);

    request(app)
      .get("/api/teachers")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ teachers: mockList });
        expect(getTeachers).toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T2.2 - SUCCESS 200 | Get empty list of teachers", (done) => {
    const mockList = [];

    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // authenticated
    });

    getTeachers.mockResolvedValue(mockList);

    request(app)
      .get("/api/teachers")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ teachers: [] });
        expect(getTeachers).toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });
});
