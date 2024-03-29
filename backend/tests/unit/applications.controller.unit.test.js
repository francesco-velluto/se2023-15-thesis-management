"use strict";

const request = require("supertest");
const {
  isLoggedIn,
  isTeacher,
  isStudent,
} = require("../../controllers/authentication");
const {
  getAllApplicationsByStudentId,
  setApplicationStatus,
  getApplicationById,
  insertNewApplication,
  cancelPendingApplicationsByProposalId,
  getAllPendingApplicationsByProposalId,
  uploadFileServer,
  getUploadedFile,
  getApplicationFile,
  getAllApplicationsByProposalId,
  getAllApplicationsByTeacherId
} = require("../../service/applications.service");

const {
  sendUpdateApplicationStatusEmail,
  sendNewApplicationEmail
} = require("../../controllers/email.notifier");

const controller = require("../../controllers/applications");
const app = require("../../app");
const Student = require("../../model/Student");
const Teacher = require("../../model/Teacher");
const Application = require("../../model/Application");
const { setProposalArchived, getProposalById } = require("../../service/proposals.service");
const Proposal = require("../../model/Proposal");
const { is } = require("date-fns/locale");
const multer = require('multer');
const fs = require('fs');

jest.mock("../../service/applications.service");
jest.mock("../../service/proposals.service");
jest.mock("../../controllers/authentication");
jest.mock("../../controllers/email.notifier");
jest.mock("multer");
jest.mock("fs");

beforeAll(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  jest.clearAllMocks();
  // comment these lines if you want to see console prints during tests
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "info").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("T1 - getAllApplicationsByStudentId", () => {
  test("T1.1 SUCCESS 200 | Get all applications by student ID", (done) => {

    const student_id = "authenticatedStudentId";

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

    request(app)
      .get(`/api/applications/${student_id}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.error).toBeFalsy();
        expect(getAllApplicationsByStudentId).toHaveBeenCalled();
        expect(res.body).toEqual(expectedApplications);
        expect(isLoggedIn).toHaveBeenCalled();
        expect(isStudent).toHaveBeenCalled();
        done();
      });
  });

  test("T1.2 ERROR 401 | Not authorized", (done) => {

    const student_id = "authenticatedStudentId";

    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = { id: "differentStudentId" };
      next(); // Authenticated
    });
    isStudent.mockImplementation((req, res, next) => {
      next(); // Authorized
    });

    request(app)
      .get(`/api/applications/${student_id}`)
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.error).toEqual(
          "You cannot get applications of another student"
        );
        expect(res.body.error).toBeTruthy();
        expect(isLoggedIn).toHaveBeenCalled();
        expect(isStudent).toHaveBeenCalled();
        done();
      });

  });

  test("T1.3 ERROR 500 | Internal server error", (done) => {
    const student_id = "authenticatedStudentId";

    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = { id: student_id };
      next(); // Authenticated
    });

    isStudent.mockImplementation((req, res, next) => {
      next(); // Authorized
    });

    // Mock the getAllApplicationsByStudentId to simulate a server error
    getAllApplicationsByStudentId.mockRejectedValue({
      status: 500,
      data: "Internal server error",
    });

    request(app)
      .get(`/api/applications/${student_id}`)
      .then((res) => {

        expect(isLoggedIn).toHaveBeenCalled();
        expect(isStudent).toHaveBeenCalled();

        expect(res.status).toBe(500);
        expect(res.body.error).toEqual("Internal server error");
        expect(getAllApplicationsByStudentId).toHaveBeenCalled();
        done();
      });

  });
});

describe("T2 - getAllApplicationsByTeacherId", () => {
  test("T2.1 SUCCESS 200 | Get all applications by teacher ID", (done) => {
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

  test("T2.2 ERROR 500 | Internal server error", (done) => {
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

  test("T2.3 ERROR 401 | Not Authorized", (done) => {
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = new Student("S001", "Name", "Surname", "email", 2021, "1");
      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      next(); // Unauthorized
    });

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

describe("T3 - acceptOrRejectApplication", () => {
  test("T3.1.1 ERROR 400 | Should return error if status isn't valid", async () => {
    const mockReq = {
      params: { application_id: "A001" },
      body: { status: "invalid status" },
      user: { id: "T001" },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await controller.acceptOrRejectApplication(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  test("T3.1.2 ERROR 400 | Should return error if application_id parameter is not defined", async () => {
    const mockReq = {
      params: { application_id: "" },
      body: { status: "Accepted" },
      user: { id: "T001" },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await controller.acceptOrRejectApplication(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  test("T3.2 ERROR 404 | Page not Found", async () => {
    const mockReq = {
      params: { application_id: "A001" },
      body: { status: "Accepted" },
      user: { id: "T001" },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    getApplicationById.mockResolvedValue({ data: undefined });

    await controller.acceptOrRejectApplication(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Application not found!",
    });
  });

  test("T3.3 ERROR 403 | Should return error if the proposal doesn't belong to the teacher making the request", async () => {
    const mockReq = {
      params: { application_id: "A001" },
      body: { status: "Accepted" },
      user: { id: "T001" },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    getApplicationById.mockResolvedValue({
      data: {
        id: "A001",
        student_id: "S001",
        status: "Pending",
        proposal: {
          proposal_id: "P001",
          supervisor_id: "T002",
        },
      },
    });

    await controller.acceptOrRejectApplication(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Not authorized!",
    });
  });

  test("T3.4.1 ERROR 500 | Should return error if there is a database error during set application status", async () => {
    const mockReq = {
      params: { application_id: "A001" },
      body: { status: "Accepted" },
      user: { id: "T001" },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    getApplicationById.mockResolvedValue({
      data: {
        id: "A001",
        student_id: "S001",
        status: "Pending",
        proposal: {
          proposal_id: "P001",
          supervisor_id: "T001",
        },
      },
    });

    setApplicationStatus.mockResolvedValue({ data: undefined });

    await controller.acceptOrRejectApplication(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Internal server error",
    });
  });

  test("T3.4.2 ERROR 500 | Should return error if the proposal to archive is not found while updating the status", async () => {
    const mockReq = {
      params: { application_id: "A001" },
      body: { status: "Accepted" },
      user: { id: "T001" },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    getApplicationById.mockResolvedValue({
      data: {
        id: "A001",
        student_id: "S001",
        status: "Pending",
        proposal: {
          proposal_id: "P001",
          supervisor_id: "T001",
        },
      },
    });

    const updatedApplication = new Application(
      "A001",
      "P001",
      "S001",
      "Accepted"
    );
    setApplicationStatus.mockResolvedValue({
      data: updatedApplication,
    });

    cancelPendingApplicationsByProposalId.mockResolvedValue({ data: 2 });
    setProposalArchived.mockResolvedValue({ data: undefined });

    await controller.acceptOrRejectApplication(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Internal server error",
    });
  });

  test(" T3.4.3 ERROR 500 | Should return error if the proposal archived status is not udpated", async () => {
    const mockReq = {
      params: { application_id: "A001" },
      body: { status: "Accepted" },
      user: { id: "T001" },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    getApplicationById.mockResolvedValue({
      data: {
        id: "A001",
        student_id: "S001",
        status: "Pending",
        proposal: {
          proposal_id: "P001",
          supervisor_id: "T001",
        },
      },
    });

    const updatedApplication = new Application(
      "A001",
      "P001",
      "S001",
      "Accepted"
    );

    setApplicationStatus.mockResolvedValue({
      data: updatedApplication,
    });

    cancelPendingApplicationsByProposalId.mockResolvedValue({ data: 2 });
    setProposalArchived.mockResolvedValue({
      data: new Proposal(
        "P001",
        "title",
        "T001",
        [],
        "Research",
        [],
        "Descr",
        "req. knowledge",
        "notes",
        "2024-01-01",
        "Bachelor",
        [],
        false
      ),
    });

    await controller.acceptOrRejectApplication(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Internal server error",
    });
  });

  test("T3.5.1 SUCCESS 200 | Should set application status to rejected", async () => {
    const mockReq = {
      params: { application_id: "A001" },
      body: { status: "Rejected" },
      user: { id: "T001" },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    getApplicationById.mockResolvedValue({
      data: {
        id: "A001",
        student_id: "S001",
        status: "Pending",
        proposal: {
          proposal_id: "P001",
          supervisor_id: "T001",
        },
      },
    });

    const updatedApplication = new Application(
      "A001",
      "P001",
      "S001",
      "Rejected"
    );

    setApplicationStatus.mockResolvedValue({
      data: updatedApplication,
    });

    sendUpdateApplicationStatusEmail.mockResolvedValue({ data: [] });

    await controller.acceptOrRejectApplication(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      application: updatedApplication, emailNotificationSent: true
    });
  });

  test("T3.5.2 SUCCESS 200 | Should accept the application, cancel all the other applications and archive the proposal", async () => {
    const mockReq = {
      params: { application_id: "A001" },
      body: { status: "Accepted" },
      user: { id: "T001" },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    getApplicationById.mockResolvedValue({
      data: {
        id: "A001",
        student_id: "S001",
        status: "Pending",
        proposal: {
          proposal_id: "P001",
          supervisor_id: "T001",
        },
      },
    });

    const updatedApplication = new Application(
      "A001",
      "P001",
      "S001",
      "Accepted"
    );
    setApplicationStatus.mockResolvedValue({
      data: updatedApplication,
    });

    cancelPendingApplicationsByProposalId.mockResolvedValue({ data: 2 });
    setProposalArchived.mockResolvedValue({
      data: new Proposal(
        "P001",
        "title",
        "T001",
        [],
        "Research",
        [],
        "Descr",
        "req. knowledge",
        "notes",
        "2024-01-01",
        "Bachelor",
        [],
        true
      ),
    });

    getAllPendingApplicationsByProposalId.mockResolvedValue({ data: [] });
    sendUpdateApplicationStatusEmail.mockResolvedValue({ data: [] });

    await controller.acceptOrRejectApplication(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ application: updatedApplication, emailNotificationSent: true });
  });
});

describe("T4 - getApplicationById", () => {
  test("T4.1 ERROR 400 | Invalid status", async () => {
    const mockReq = {
      params: { application_id: "" },
      user: { id: "T001" },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await controller.getApplicationById(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Invalid application id parameter",
    });
  });

  test("T4.2 ERROR 404 | Page Not Found", async () => {
    const mockReq = {
      params: { application_id: "A001" },
      user: { id: "T001" },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    getApplicationById.mockResolvedValue({ data: undefined });

    await controller.getApplicationById(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
  });

  test("T4.3 ERROR 403 | Should return error if the application doesn't belong to the teacher logged in", async () => {
    const mockReq = {
      params: { application_id: "A001" },
      user: { id: "T001" },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    getApplicationById.mockResolvedValue({
      data: { id: "A001", proposal: { supervisor_id: "T002" } },
    });

    await controller.getApplicationById(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(403);
  });

  test("T4.5 ERROR 500 | Internal Server Error", async () => {
    const mockReq = {
      params: { application_id: "A001" },
      user: { id: "T001" },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    getApplicationById.mockImplementation(async () => {
      throw new Error("Some error");
    });

    await controller.getApplicationById(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
  });

  test("T4.6 SUCCESS 200 | Should return the corresponding application", async () => {
    const mockReq = {
      params: { application_id: "A001" },
      user: { id: "T001" },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    getApplicationById.mockResolvedValue({
      data: { id: "A001", proposal: { supervisor_id: "T001" } },
    });

    await controller.getApplicationById(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      application: { id: "A001", proposal: { supervisor_id: "T001" } },
    });
  });
});

describe("T5 - insertNewApplication", () => {
  test("T5.1 SUCCESS 200 | Insert New Application", (done) => {
    const mockReq = {
      proposal_id: "P011",
    };

    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = { id: "S001" };
      next();
    });

    const mockRes = {
      rows: [
        {
          id: "A001",
          proposal_id: mockReq.proposal_id,
          student_id: "S001",
          application_date: "2023-21-12",
          fileSent: false,
        }
      ]
    };

    insertNewApplication.mockResolvedValue(mockRes);
    sendNewApplicationEmail.mockResolvedValue(true);

    request(app)
      .post("/api/applications")
      .send(mockReq)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual({...mockRes.rows[0], emailNotificationSent: true});
        expect(insertNewApplication).toHaveBeenCalledWith(
          mockReq.proposal_id,
          "S001"
        );
        done();
      })
      .catch((err) => done(err));
  });


  test("T5.2 ERROR 500 | Internal Server Error", (done) => {
    const mockApplicationReq = {
      proposal_id: "P011",
    };

    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = { id: "S001" };
      next();
    });

    const errorMessage = "An error occurred during application insertion";
    insertNewApplication.mockRejectedValue(new Error(errorMessage));

    request(app)
      .post("/api/applications")
      .send(mockApplicationReq)
      .then((res) => {
        expect(res.status).toBe(500);
        expect(res.body.errors).toBeDefined();
        expect(insertNewApplication).toHaveBeenCalledWith(
          mockApplicationReq.proposal_id,
          "S001"
        );
        done();
      })
      .catch((err) => done(err));
  });

  test("T5.3 - ERROR 400 | Missing parameters in insert new application controller", (done) => {
    const mockApplicationReq = {}; // Empty request body

    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = { id: "S001" };
      next();
    });

    request(app)
      .post("/api/applications")
      .send(mockApplicationReq)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.text).toBe("Parameters not found in insert new application controller");
        expect(insertNewApplication).not.toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });


});

describe("T6 - uploadFileServer", (done) => {
  test("T6.1 - SUCCESS 201 | Uploaded file to server", async () => {
    const mockReq = {
      file: {
        filename: "file.pdf"
      },
      user: {
        id: "S001"
      }
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    isLoggedIn.mockImplementation((req, res, next) => {
      next();
    });

    isStudent.mockImplementation((req, res, next) => {
      next();
    });

    multer.mockImplementation(() => ({
      single: (name) => (req, res, next) => {
        next();
      },
    }));

    uploadFileServer.mockResolvedValue({rows: [{upload_id: "1234"}]});

    await controller.uploadFileServer(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({upload_id: "1234"});
  });

  test("T6.2 - ERROR 500 | Internal server error", async () => {
    const mockReq = {
      file: {
        filename: "file.pdf"
      },
      user: {
        id: "S001"
      }
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    isLoggedIn.mockImplementation((req, res, next) => {
      next();
    });

    isStudent.mockImplementation((req, res, next) => {
      next();
    });

    multer.mockImplementation(() => ({
      single: (name) => (req, res, next) => {
        next("Internal Server Error");
      },
    }));

    uploadFileServer.mockRejectedValue({data: "Internal Server Error"});

    await controller.uploadFileServer(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({error: "Internal Server Error"});
  });
});

describe("T7 - previewFile", () => {
  test("T7.1 SUCCESS 200 | Preview file (upload_id case)", async () => {
    const mockReq = {
      params: {
        filename: "Resume_S001.pdf",
        upload_id: 1
      },
      user: {
        id: "S001"
      }
    };

    const mockRes = {
      sendFile: jest.fn(),
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    isLoggedIn.mockImplementation((req, res, next) => {
      next();
    });

    isStudent.mockImplementation((req, res, next) => {
      next();
    });

    getUploadedFile.mockResolvedValue({success: true, data: {filename: "Resume_S001.pdf"}});

    fs.existsSync.mockReturnValue(true);

    fs.createReadStream.mockReturnValue({
      pipe: jest.fn()
    });

    await controller.previewFile(mockReq, mockRes);

    expect(mockRes.setHeader).toHaveBeenCalledWith("Content-Type", "application/pdf");
    expect(mockRes.setHeader).toHaveBeenCalledWith("Content-Disposition", "inline; filename=Resume_S001.pdf");
  });

  test("T7.2 SUCCESS 200 | Preview file (application_id case)", async () => {
    const mockReq = {
      params: {
        filename: "Resume_S001.pdf",
        application_id: 1
      },
      user: {
        id: "S001"
      }
    };

    const mockRes = {
      sendFile: jest.fn(),
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    isLoggedIn.mockImplementation((req, res, next) => {
      next();
    });

    isStudent.mockImplementation((req, res, next) => {
      next();
    });

    getApplicationFile.mockResolvedValue({success: true, data: {filename: "Resume_S001.pdf"}});

    fs.existsSync.mockReturnValue(true);

    fs.createReadStream.mockReturnValue({
      pipe: jest.fn()
    });

    await controller.previewFile(mockReq, mockRes);

    expect(mockRes.setHeader).toHaveBeenCalledWith("Content-Type", "application/pdf");
    expect(mockRes.setHeader).toHaveBeenCalledWith("Content-Disposition", "inline; filename=Resume_S001.pdf");
  });

  test("T7.3 - 404 | File not found", async () => {
    const mockReq = {
      params: {
        filename: "Resume_S001.pdf",
        application_id: 1
      },
      user: {
        id: "S001"
      }
    };

    const mockRes = {
      sendFile: jest.fn(),
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    isLoggedIn.mockImplementation((req, res, next) => {
      next();
    });

    isStudent.mockImplementation((req, res, next) => {
      next();
    });

    getApplicationFile.mockResolvedValue({success: true, data: {filename: "Resume_S001.pdf"}});

    fs.existsSync.mockReturnValue(false);

    await controller.previewFile(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({error: "File not found"});
  });

  test("T7.4 - 404 | Resume not found for the specified student", async () => {
    const mockReq = {
      params: {
        filename: "Resume_S001.pdf",
        application_id: 1
      },
      user: {
        id: "S001"
      }
    };

    const mockRes = {
      sendFile: jest.fn(),
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    isLoggedIn.mockImplementation((req, res, next) => {
      next();
    });

    isStudent.mockImplementation((req, res, next) => {
      next();
    });

    getApplicationFile.mockResolvedValue({success: false, data: {filename: "Resume_S001.pdf"}});

    await controller.previewFile(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({error: "Resume not found for the specified student"});
  });

  test("T7.5 - 500 | Internal server error", async () => {
    const mockReq = {
      params: {
        filename: "Resume_S001.pdf",
        application_id: 1
      },
      user: {
        id: "S001"
      }
    };

    const mockRes = {
      sendFile: jest.fn(),
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    isLoggedIn.mockImplementation((req, res, next) => {
      next();
    });

    isStudent.mockImplementation((req, res, next) => {
      next();
    });

    getApplicationFile.mockRejectedValue({success: false, data: {filename: "Resume_S001.pdf"}});

    await controller.previewFile(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({error: "Internal server error"});
  });
});

describe("T8 - getFileInfo", () => {
  test("T8.1 SUCCESS 200 | Get file info (upload_id case)", async () => {
    const mockReq = {
      params: {
        filename: "Resume_S001.pdf",
        upload_id: 1
      },
      user: {
        id: "S001"
      }
    };

    const mockRes = {
      sendFile: jest.fn(),
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    isLoggedIn.mockImplementation((req, res, next) => {
      next();
    });

    isStudent.mockImplementation((req, res, next) => {
      next();
    });

    getUploadedFile.mockResolvedValue({success: true, data: {filename: "Resume_S001.pdf"}});

    await controller.getFileInfo(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({data: {filename: "Resume_S001.pdf"}});
  });

  test("T8.2 SUCCESS 200 | Get file info (application_id case)", async () => {
    const mockReq = {
      params: {
        filename: "Resume_S001.pdf",
        application_id: 1
      },
      user: {
        id: "S001"
      }
    };

    const mockRes = {
      sendFile: jest.fn(),
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    isLoggedIn.mockImplementation((req, res, next) => {
      next();
    });

    isStudent.mockImplementation((req, res, next) => {
      next();
    });

    getApplicationFile.mockResolvedValue({success: true, data: {filename: "Resume_S001.pdf"}});

    await controller.getFileInfo(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({data: {filename: "Resume_S001.pdf"}});
  });

  test("T8.3 - 404 | File not found", async () => {
    const mockReq = {
      params: {
        filename: "Resume_S001.pdf",
        application_id: 1
      },
      user: {
        id: "S001"
      }
    };

    const mockRes = {
      sendFile: jest.fn(),
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    isLoggedIn.mockImplementation((req, res, next) => {
      next();
    });

    isStudent.mockImplementation((req, res, next) => {
      next();
    });

    getApplicationFile.mockResolvedValue({success: false, data: {filename: "Resume_S001.pdf"}});

    fs.existsSync.mockReturnValue(false);

    await controller.getFileInfo(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({message: "No file found"});
  });

  test("T8.4 - 500 | Internal server error", async () => {
    const mockReq = {
      params: {
        filename: "Resume_S001.pdf",
        application_id: 1
      },
      user: {
        id: "S001"
      }
    };

    const mockRes = {
      sendFile: jest.fn(),
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    isLoggedIn.mockImplementation((req, res, next) => {
      next();
    });

    isStudent.mockImplementation((req, res, next) => {
      next();
    });

    getApplicationFile.mockRejectedValue({success: false, data: {filename: "Resume_S001.pdf"}});

    await controller.getFileInfo(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({error: "Internal server error"});
  });
});

describe("T9 - getAllApplicationsByProposalId", () => {
  test("T9.1 SUCCESS 200 | Get all applications by proposal ID", async () => {
    const expectedApplications = [
        {
          proposal_id: "2",
          title: "Title 1",
          description: "Description 1",
          level: "Bachelor",
          application_date:"19-01-2023",
          status: "Pending"
        }
      ];

    const expectedProposal = { supervisor_id: "T001"};

    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = { id: "T001" };
      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      next(); // Authorized
    });

    getProposalById.mockResolvedValueOnce({
      data: expectedProposal,
      status: 200,
    });
    getAllApplicationsByProposalId.mockResolvedValue({
      data: expectedApplications,
      status: 200,
    });

    const res = await request(app).get("/api/applications/proposals/2");

    expect(res.status).toBe(200);
    expect(res.body.error).toBeFalsy();
    expect(getProposalById).toHaveBeenCalled();
    expect(getAllApplicationsByProposalId).toHaveBeenCalled();
    expect(res.body).toEqual(expectedApplications);
    expect(isLoggedIn).toHaveBeenCalled();

  });

    test("T9.2 ERROR 401 | User not allowed to see details of applications", async () => {
      const expectedProposal = { supervisor_id: "T002" }; // Different supervisor_id
      const expectedError = { status: 401, error: "You are not allowed to see details of applications of this proposal" };

      isLoggedIn.mockImplementation((req, res, next) => {
        req.user = { id: "T001" };
        next(); // Authenticated
      });

      isTeacher.mockImplementation((req, res, next) => {
        next(); // Authorized
      });

      getProposalById.mockResolvedValueOnce({
        data: expectedProposal,
        status: 200,
      });

      const res = await request(app).get(`/api/applications/proposals/2`);

      expect(res.status).toBe(401);
      expect(res.body.error).toEqual(expectedError.error);
      expect(getProposalById).toHaveBeenCalled();
      expect(getAllApplicationsByProposalId).not.toHaveBeenCalled();
      expect(isLoggedIn).toHaveBeenCalled();
    });

    test("T9.3 ERROR 500 | Error fetching applications", async () => {
      const expectedProposal = { supervisor_id: "T001" };
      const expectedError = { status: 500, data: "Error fetching applications" };

      isLoggedIn.mockImplementation((req, res, next) => {
        req.user = { id: "T001" };
        next(); // Authenticated
      });

      isTeacher.mockImplementation((req, res, next) => {
        next(); // Authorized
      });

      getProposalById.mockResolvedValueOnce({
        data: expectedProposal,
        status: 200,
      });

      getAllApplicationsByProposalId.mockRejectedValueOnce(expectedError);

      const res = await request(app).get("/api/applications/proposals/2");

      expect(res.status).toBe(500);
      expect(res.body.error).toEqual(expectedError.error);
      expect(getProposalById).toHaveBeenCalled();
      expect(getAllApplicationsByProposalId).toHaveBeenCalled();
      expect(isLoggedIn).toHaveBeenCalled();
    });


});
