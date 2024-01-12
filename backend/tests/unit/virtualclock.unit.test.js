"use strict";

const request = require("supertest");
const { isLoggedIn } = require("../../controllers/authentication");
const app = require("../../app");
const { getVirtualDate, updateVirtualDate } = require("../../service/virtualclock.service");
const dayjs = require("dayjs");

jest.mock("../../service/virtualclock.service");
jest.mock("../../controllers/authentication");

beforeAll(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  jest.clearAllMocks();
  // comment these lines if you want to see console prints during tests
  jest.spyOn(console, "log").mockImplementation(() => { });
  jest.spyOn(console, "info").mockImplementation(() => { });
  jest.spyOn(console, "error").mockImplementation(() => { });
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("T1 - Get virtual date unit tests", () => {
  const formatString = "YYYY-MM-DD";

  test("T1.1 - ERROR 401 | Not authenticated", (done) => {
    isLoggedIn.mockImplementation((req, res, next) => {
      return res.status(401).json({ error: "Not authenticated" });
    });

    request(app)
      .get("/api/virtualclock")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body).toEqual({ error: "Not authenticated" });
        expect(isLoggedIn).toHaveBeenCalled();
        expect(getVirtualDate).not.toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T2.2 - SUCCESS 200 | Get virtual clock", (done) => {
    const mockDate = "2024-02-01";
    const mockVirtualDate = { data: dayjs(mockDate).format(formatString) };
    const mockRes = { date: dayjs(mockDate).format(formatString) };

    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // authenticated
    });

    getVirtualDate.mockResolvedValue(mockVirtualDate);

    request(app)
      .get("/api/virtualclock")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockRes);
        expect(getVirtualDate).toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T2.3 - ERROR 500 | Error while retrieving the virtual date", (done) => {

    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // authenticated
    });

    getVirtualDate.mockResolvedValue({ data: null });

    request(app)
      .get("/api/virtualclock")
      .then((res) => {
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: {} });
        expect(getVirtualDate).toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T2.4 - ERROR 500 | Internal database error", (done) => {
    const error = "Database error";

    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // authenticated
    });

    getVirtualDate.mockRejectedValue(error);

    request(app)
      .get("/api/virtualclock")
      .then((res) => {
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error });
        expect(getVirtualDate).toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });
});

describe("T2 - Update VirtualDate unit tests", () => {
  const formatString = "YYYY-MM-DD";

  test("T2.1 - ERROR 401 | Not authenticated", (done) => {
    isLoggedIn.mockImplementation((req, res, next) => {
      return res.status(401).json({ error: "Not authenticated" });
    });

    request(app)
      .put("/api/virtualclock")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body).toEqual({ error: "Not authenticated" });
        expect(isLoggedIn).toHaveBeenCalled();
        expect(updateVirtualDate).not.toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T2.2 - SUCCESS 200 | Update virtual clock", (done) => {
    const mockDate = "2024-02-01";
    const mockVirtualDate = { data: dayjs(mockDate).format(formatString) };
    const mockRes = { date: dayjs(mockDate).format(formatString) };

    isLoggedIn.mockImplementation((req, res, next) => {
      req.body = { date: mockDate };
      next(); // authenticated
    });

    updateVirtualDate.mockResolvedValue(mockVirtualDate);

    request(app)
      .put("/api/virtualclock")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockRes);
        expect(updateVirtualDate).toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T2.3 - ERROR 400 | Date not valid", (done) => {
    const error = "The date provided in the request body is not a valid date in ISO format 'YYYY-MM-DD'!";
    const mockDate = "date_not_valid";

    isLoggedIn.mockImplementation((req, res, next) => {
      req.body = { date: mockDate };
      next(); // authenticated
    });

    request(app)
      .put("/api/virtualclock")
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error });
        expect(updateVirtualDate).not.toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T2.4 - ERROR 400 | Date not found", (done) => {
    const mockDate = "2024-12-01";

    isLoggedIn.mockImplementation((req, res, next) => {
      req.body = { date: mockDate };
      next(); // authenticated
    });

    const mockVirtualDate = { data: null };
    updateVirtualDate.mockResolvedValue(mockVirtualDate);

    request(app)
      .put("/api/virtualclock")
      .then((res) => {
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: {} });
        expect(updateVirtualDate).toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T2.5 - ERROR 500 | Internal database error", (done) => {
    const error = "Database error";

    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // authenticated
    });

    updateVirtualDate.mockRejectedValue(error);

    request(app)
      .put("/api/virtualclock")
      .then((res) => {
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error });
        expect(updateVirtualDate).toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });
});
