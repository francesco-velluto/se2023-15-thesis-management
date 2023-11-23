"use strict";

const request = require("supertest");
const {
  isLoggedIn,
  isTeacher,
  isStudent,
} = require("../controllers/authentication");
const {
  getAllApplicationsByStudentId,
  setApplicationStatus,
  setApplicationsStatusCanceledByProposalId,
} = require("../service/applications.service");
const {
  getAllApplicationsByTeacherId,
} = require("../service/applications.service");
const controller = require("../controllers/applications");
const app = require("../app");
const Student = require("../model/Student");
const Teacher = require("../model/Teacher");
const Application = require("../model/Application");
const { setProposalArchived } = require("../service/proposals.service");

jest.mock("../service/applications.service");
jest.mock("../service/proposals.service");
jest.mock("../controllers/authentication");

beforeAll(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  jest.clearAllMocks();
  // jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "info").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("Applications Controller Unit Tests", () => {
  describe("getAllApplicationsByStudentId", () => {
    it("get all application controller", (done) => {
      const req = {
        params: { student_id: "authorizedStudentId" },
        user: { id: "authenticatedStudentId" }, // Simulate authenticated user
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const expectedApplications = {
        1: [
          {
            proposal_id: 1,
            title: "Proposal 1",
            description: "Description 1",
          },
          {
            proposal_id: 1,
            title: "Proposal 1",
            description: "Description 1",
          },
        ],
      };

      isLoggedIn.mockImplementation((req, res, next) => {
        req.user = { id: "authenticatedStudentId" };
        next(); // Authenticated
      });
      isStudent.mockImplementation((req, res, next) => {
        next(); // Authorized
      });

      getAllApplicationsByStudentId.mockResolvedValue({
        data: expectedApplications,
        status: 200,
      });

      controller.getAllApplicationsByStudentId(req, res);

      request(app)
        .get(`/api/applications/${req.user.id}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.error).toBeFalsy();
          expect(getAllApplicationsByStudentId).toHaveBeenCalled();
          expect(res.body).toEqual(expectedApplications);
          expect(isLoggedIn).toHaveBeenCalled();
          done();
        });
    });

    it("should handle unauthorized access", async () => {
      const mockRequest = {
        params: { student_id: "unauthorizedStudentId" },
        user: { id: "authenticatedStudentId" }, // Simulate authenticated user
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.getAllApplicationsByStudentId(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "You cannot get applications of another student",
      });
    });

    it("should handle service layer error", async () => {
      // todo
    });
  });

  describe("getAllApplicationsByTeacherId", () => {
    it("get all applications by teacher id controller", (done) => {
      const req = {
        user: new Teacher(
          "1",
          "Surname 1",
          "Name 1",
          "email 1",
          "group 1",
          "dep 1"
        ), // Simulate authenticated teacher user
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const expectedApplications = {
        1: [
          {
            proposal_id: "1",
            title: "Title 1",
            type: "Type 1",
            description: "Description 1",
            level: "Bachelor",
            application_id: 11,
            application_status: "Pending",
            student_id: "S001",
            surname: "Surname 1",
            name: "Name 1",
            email: "email 1",
            enrollment_year: 2021,
            cod_degree: "1",
          },
          {
            proposal_id: "1",
            title: "Title 1",
            type: "Type 1",
            description: "Description 1",
            level: "Bachelor",
            application_id: 12,
            application_status: "Pending",
            student_id: "S002",
            surname: "Surname 2",
            name: "Name 2",
            email: "email 2",
            enrollment_year: 2021,
            cod_degree: "2",
          },
        ],
      };

      isLoggedIn.mockImplementation((req, res, next) => {
        req.user = new Teacher(
          "1",
          "Surname 1",
          "Name 1",
          "email 1",
          "group 1",
          "dep 1"
        );
        next(); // Authenticated
      });

      isTeacher.mockImplementation((req, res, next) => {
        next(); // Authorized
      });

      getAllApplicationsByTeacherId.mockResolvedValue({
        data: expectedApplications,
        status: 200,
      });

      controller.getAllApplicationsByTeacherId(req, res);

      request(app)
        .get("/api/applications/")
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.error).toBeFalsy();
          expect(getAllApplicationsByTeacherId).toHaveBeenCalled();
          expect(res.body).toEqual(expectedApplications);
          expect(isLoggedIn).toHaveBeenCalled();

          done();
        });
    });

    it("should handle service layer error", (done) => {
      const req = {
        user: new Teacher(
          "1",
          "Surname 1",
          "Name 1",
          "email 1",
          "group 1",
          "dep 1"
        ), // Simulate authenticated teacher user
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      isLoggedIn.mockImplementation((req, res, next) => {
        req.user = new Teacher(
          "1",
          "Surname 1",
          "Name 1",
          "email 1",
          "group 1",
          "dep 1"
        );
        next(); // Authenticated
      });

      isTeacher.mockImplementation((req, res, next) => {
        next(); // Authorized
      });

      getAllApplicationsByTeacherId.mockRejectedValue({
        data: "Internal server error",
        status: 500,
      });

      controller.getAllApplicationsByTeacherId(req, res);

      request(app)
        .get("/api/applications/")
        .then((res) => {
          expect(res.status).toBe(500);
          expect(res.body.errors[0]).toEqual("Internal server error");
          expect(res.body.errors).toBeTruthy();
          expect(getAllApplicationsByTeacherId).toHaveBeenCalled();
          expect(isLoggedIn).toHaveBeenCalled();

          done();
        });
    });

    it("should return 401 if user is not a teacher", (done) => {
      const req = {
        user: new Student("S001", "Name", "Surname", "email", 2021, "1"),
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      isLoggedIn.mockImplementation((req, res, next) => {
        req.user = new Student("S001", "Name", "Surname", "email", 2021, "1");
        next(); // Authenticated
      });

      isTeacher.mockImplementation((req, res, next) => {
        next(); // Unauthorized
      });

      controller.getAllApplicationsByTeacherId(req, res);

      request(app)
        .get("/api/applications/")
        .then((res) => {
          expect(res.status).toBe(401);
          expect(res.body.errors[0]).toEqual(
            "Must be a teacher to make this request!"
          );
          expect(res.body.errors).toBeTruthy();
          expect(isLoggedIn).toHaveBeenCalled();

          done();
        });
    });
  });

  describe("acceptOrRejectApplication", () => {
    it("ERROR 400 | Should return error if status isn't valid", async () => {
      const mockReq = {
        params: { application_id: "A001" },
        body: { status: "asdf" },
        user: { id: "T001" },
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.acceptOrRejectApplication(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it("ERROR 400 | Should return error if the application doesn't exist", async () => {
      const mockReq = {
        params: { application_id: "A001" },
        body: { status: "Accepted" },
        user: { id: "T001" },
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      setApplicationStatus.mockImplementation(
        async (status, teacher_id, application_id) => {
          return new Error("Application not found!");
        }
      );

      await controller.acceptOrRejectApplication(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Application not found!",
      });
    });

    it("ERROR 500 | Should return error if there is an internal server error", async () => {
    });

    it.skip("SUCCESS 200 | Should accept the application, cancel all the other applications and archive the proposal", async () => {
      const mockReq = {
        params: { application_id: "A001" },
        body: { status: "Accepted" },
        user: { id: "T001" },
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      setApplicationStatus.mockResolvedValue(
        new Application("P001", "A001", "Accepted", "2023-11-23")
      );
      setApplicationsStatusCanceledByProposalId.mockResolvedValue(true);
      setProposalArchived.mockResolvedValue(true);

      await controller.acceptOrRejectApplication(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Application not found!",
      });
    });
  });
});
