"use strict";

const request = require("supertest");
const {
  isLoggedIn,
  isTeacher,
  isStudent,
} = require("../../controllers/authentication");
const {
  getMaxProposalIdNumber,
  insertProposal,
  getProposalById,
  getAllProposals,
  getAllProfessorProposals,
  deleteProposal,
  updateProposal,
} = require("../../service/proposals.service");

const { getAllApplicationsByProposalId } = require("../../service/applications.service");

const app = require("../../app");

jest.mock("../../service/proposals.service");
jest.mock("../../service/applications.service");
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

describe("T1 - Get all proposals Unit Tests", () => {
  test("T1.1 ERROR 401 | Not authenticated", (done) => {
    isLoggedIn.mockImplementation((req, res, next) => {
      return res.status(401).json({ error: "Not authenticated" });
    });

    request(app)
      .get("/api/proposals")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body).toEqual({ error: "Not authenticated" });
        expect(isLoggedIn).toHaveBeenCalled();
        expect(isStudent).not.toHaveBeenCalled();
        expect(getAllProposals).not.toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T1.2 ERROR 401 | Not authorized", (done) => {
    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    isStudent.mockImplementation((req, res, next) => {
      return res
        .status(401)
        .json({ error: "Not authorized, must be a Student" });
    });

    request(app)
      .get("/api/proposals")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.error).toEqual("Not authorized, must be a Student");
        expect(getAllProposals).not.toHaveBeenCalled();
        expect(isLoggedIn).toHaveBeenCalled();
        expect(isStudent).toHaveBeenCalled();
        done();
      });
  });

  test("T1.3 ERROR 500 | Internal server error", (done) => {
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user.cod_degree = "MC001";
      next(); // Authenticated
    });

    isStudent.mockImplementation((req, res, next) => {
      next(); // Authorized
    });

    getAllProposals.mockImplementation((mockedStudentDegree) => {
      throw Error("some error");
    });

    request(app)
      .get("/api/proposals")
      .then((res) => {
        expect(res.status).toBe(500);
        done();
      });
  });

  test("T1.4 SUCCESS | Get all proposals", (done) => {
    const mockedStudentDegree = "MC001";

    const mockedProposalsList = [
      {
        proposal_id: "P002",
        title: "Machine Learning",
        supervisor_surname: "Wilson",
        supervisor_name: "Michael",
        keywords: ["Machine Learning", "AI"],
        type: "Master",
        groups: ["Group B"],
        description: "A machine learning thesis description.",
        required_knowledge: "Python, TensorFlow",
        notes: "N/A",
        expiration_date: "2024-06-29T22:00:00.000Z",
        level: "Graduate",
        degrees: ["Master of Science"],
      },
      {
        proposal_id: "P003",
        title: "Artificial Intelligence",
        supervisor_surname: "Gomez",
        supervisor_name: "Ana",
        keywords: ["AI", "Machine Learning"],
        type: "Master",
        groups: ["Group A"],
        description: "An AI research thesis description.",
        required_knowledge: "Python, TensorFlow",
        notes: "N/A",
        expiration_date: "2024-05-14T22:00:00.000Z",
        level: "Graduate",
        degrees: ["Master of Science"],
      },
    ];

    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = { cod_degree: mockedStudentDegree };
      next(); // Authenticated
    });

    isStudent.mockImplementation((req, res, next) => {
      next(); // Authorized
    });

    getAllProposals.mockResolvedValue({
      data: mockedProposalsList,
      status: 200,
    });

    request(app)
      .get("/api/proposals")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.error).toBeFalsy();
        expect(getAllProposals).toHaveBeenCalled();
        expect(res.body).toEqual({ proposals: mockedProposalsList });
        expect(isLoggedIn).toHaveBeenCalled();
        expect(isStudent).toHaveBeenCalled();
        done();
      });
  });
});

describe("T2 - Insert proposals unit tests", () => {
  test("T2.1 - ERROR 401 | Not authenticated", (done) => {
    const mockProposalReq = {};

    isLoggedIn.mockImplementation((req, res, next) => {
      return res.status(401).json({ error: "Not authenticated" });
    });

    request(app)
      .post("/api/proposals")
      .send(mockProposalReq)
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body).toEqual({ error: "Not authenticated" });
        expect(isLoggedIn).toHaveBeenCalled();
        expect(isTeacher).not.toHaveBeenCalled();
        expect(insertProposal).not.toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T2.2 - ERROR 401 | Not authorized", (done) => {
    const mockProposalReq = {};

    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      return res.status(401).json({ error: "Not authorized" });
    });

    request(app)
      .post("/api/proposals")
      .send(mockProposalReq)
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body).toEqual({ error: "Not authorized" });
        expect(isLoggedIn).toHaveBeenCalled();
        expect(isTeacher).toHaveBeenCalled();
        expect(insertProposal).not.toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T2.3 - SUCCESS 201 | New proposal inserted", (done) => {
    const mockProposalReq = {
      title: "test proposal",
      keywords: ["k1", "k2"],
      type: "Master",
      groups: ["G001"],
      description: "Test description",
      required_knowledge: "Node.js, PostgreSQL, React.js",
      notes: "some notes",
      expiration_date: "2024-06-30",
      level: "Undergraduate",
      programmes: ["CD008"],
    };

    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      req.user = { id: "T001", cod_group: "G001" };
      next(); // Authenticated
    });

    const mockProposalRes = {
      ...mockProposalReq,
      proposal_id: "P011",
      supervisor_id: "T001"
    };

    getMaxProposalIdNumber.mockResolvedValue(10);

    insertProposal.mockResolvedValue(mockProposalRes);

    request(app)
      .post("/api/proposals")
      .send(mockProposalReq)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body).toEqual({ proposal: mockProposalRes });
        expect(getMaxProposalIdNumber).toHaveBeenCalled();
        expect(insertProposal).toHaveBeenCalledWith({ ...mockProposalRes });
        done();
      })
      .catch((err) => done(err));
  });

  test("T2.4 - ERROR 422 | Empty title field", (done) => {
    const mockProposalReq = {
      title: "",
      keywords: ["k1", "k2"],
      type: "Master",
      groups: ["G001", "G002"],
      description: "Test description",
      required_knowledge: "Node.js, PostgreSQL, React.js",
      notes: "test notes",
      expiration_date: "2024-06-30",
      level: "Undergraduate",
      programmes: ["CD008"],
    };

    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    request(app)
      .post("/api/proposals")
      .send(mockProposalReq)
      .then((res) => {
        expect(res.status).toBe(422);
        expect(res.body.error).not.toBeFalsy();
        expect(getMaxProposalIdNumber).not.toHaveBeenCalled();
        expect(insertProposal).not.toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T2.5 - SUCCESS 201 | Undefined notes field", (done) => {
    const mockProposalReq = {
      title: "TEST",
      keywords: ["k1", "k2"],
      type: "Master",
      groups: ["G001"],
      description: "Test description",
      required_knowledge: "Node.js, PostgreSQL, React.js",
      notes: undefined,
      expiration_date: "2024-06-30",
      level: "Undergraduate",
      programmes: ["CD008"],
    };

    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      req.user = { id: "T001", cod_group: "G001" };
      next(); // Authenticated
    });

    const mockProposalRes = {
      ...mockProposalReq,
      proposal_id: "P011",
      supervisor_id: "T001"
    };
    getMaxProposalIdNumber.mockResolvedValue(10);

    insertProposal.mockResolvedValue(mockProposalRes);

    request(app)
      .post("/api/proposals")
      .send(mockProposalReq)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body).toEqual({ proposal: mockProposalRes });
        expect(getMaxProposalIdNumber).toHaveBeenCalled();
        expect(insertProposal).toHaveBeenCalledWith({ ...mockProposalRes });
        done();
      })
      .catch((err) => done(err));
  });

  test("T2.6 - SUCCESS 201 | Undefined required knowledge field", (done) => {
    const mockProposalReq = {
      title: "TEST",
      keywords: ["k1", "k2"],
      type: "Master",
      groups: ["G001"],
      description: "Test description",
      required_knowledge: undefined,
      notes: "notes",
      expiration_date: "2024-06-30",
      level: "Undergraduate",
      programmes: ["CD008"],
    };

    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      req.user = { id: "T001", cod_group: "G001" };
      next(); // Authenticated
    });

    const mockProposalRes = {
      ...mockProposalReq,
      proposal_id: "P011",
      supervisor_id: "T001"
    };
    getMaxProposalIdNumber.mockResolvedValue(10);

    insertProposal.mockResolvedValue(mockProposalRes);

    request(app)
      .post("/api/proposals")
      .send(mockProposalReq)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body).toEqual({ proposal: mockProposalRes });
        expect(getMaxProposalIdNumber).toHaveBeenCalled();
        expect(insertProposal).toHaveBeenCalledWith({ ...mockProposalRes });
        done();
      })
      .catch((err) => done(err));
  });

  test("T2.7 - ERROR 422 | Missing date field", (done) => {
    const mockProposalReq = {
      title: "TEST",
      keywords: ["k1", "k2"],
      type: "Master",
      groups: ["G001", "G002"],
      description: "Test description",
      required_knowledge: "Node.js, PostgreSQL, React.js",
      notes: "notes",
      expiration_date: undefined,
      level: "Undergraduate",
      programmes: ["CD008"],
    };

    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    request(app)
      .post("/api/proposals")
      .send(mockProposalReq)
      .then((res) => {
        expect(res.status).toBe(422);
        expect(res.body.error).not.toBeFalsy();
        expect(getMaxProposalIdNumber).not.toHaveBeenCalled();
        expect(insertProposal).not.toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T2.8 - ERROR 422 | Invalid date format", (done) => {
    const mockProposalReq = {
      title: "TEST",
      supervisor_id: "T002",
      keywords: ["k1", "k2"],
      type: "Master",
      groups: ["G001", "G002"],
      description: "Test description",
      required_knowledge: "Node.js, PostgreSQL, React.js",
      notes: "notes",
      expiration_date: "20-10-2023",
      level: "Undergraduate",
      programmes: ["CD008"],
    };

    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    request(app)
      .post("/api/proposals")
      .send(mockProposalReq)
      .then((res) => {
        expect(res.status).toBe(422);
        expect(res.body.error).not.toBeFalsy();
        expect(getMaxProposalIdNumber).not.toHaveBeenCalled();
        expect(insertProposal).not.toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T2.9 - ERROR 422 | Invalid date", (done) => {
    const mockProposalReq = {
      title: "TEST",
      supervisor_id: "T002",
      keywords: ["k1", "k2"],
      type: "Master",
      groups: ["G001", "G002"],
      description: "Test description",
      required_knowledge: "Node.js, PostgreSQL, React.js",
      notes: "notes",
      expiration_date: "2023-02-29",
      level: "Undergraduate",
      programmes: ["CD008"],
    };

    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    request(app)
      .post("/api/proposals")
      .send(mockProposalReq)
      .then((res) => {
        expect(res.status).toBe(422);
        expect(res.body.error).not.toBeFalsy();
        expect(getMaxProposalIdNumber).not.toHaveBeenCalled();
        expect(insertProposal).not.toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T2.10 - ERROR 422 | Array of strings contains some elements which are not strings", (done) => {
    const mockProposalReq = {
      title: "TEST",
      supervisor_id: "T002",
      keywords: ["k1", 123],
      type: "Master",
      groups: ["G001", "G002"],
      description: "Test description",
      required_knowledge: "Node.js, PostgreSQL, React.js",
      notes: "notes",
      expiration_date: "2024-06-30",
      level: "Undergraduate",
      programmes: ["CD008"],
    };

    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    request(app)
      .post("/api/proposals")
      .send(mockProposalReq)
      .then((res) => {
        expect(res.status).toBe(422);
        expect(res.body.error).not.toBeFalsy();
        expect(getMaxProposalIdNumber).not.toHaveBeenCalled();
        expect(insertProposal).not.toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T2.11 - ERROR 500 | Database error", (done) => {
    const mockProposalReq = {
      title: "TEST",
      keywords: ["k1", "k2"],
      type: "Master",
      groups: ["G001", "G002"],
      description: "Test description",
      required_knowledge: "Node.js, PostgreSQL, React.js",
      notes: "notes",
      expiration_date: "2024-06-30",
      level: "Undergraduate",
      programmes: ["CD008"],
    };

    getMaxProposalIdNumber.mockResolvedValue(10);

    insertProposal.mockImplementation(() => {
      throw Error("some error");
    });

    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      req.user = { id: "T001", cod_group: "G001" };
      next(); // Authenticated
    });

    request(app)
      .post("/api/proposals")
      .send(mockProposalReq)
      .then((res) => {
        expect(res.status).toBe(500);
        expect(res.body.error).not.toBeFalsy();
        expect(getMaxProposalIdNumber).toHaveBeenCalled();
        expect(insertProposal).toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });
});

describe("T3 - Get proposal by Id unit tests", () => {
  test("T3.1 - ERROR 401 | Not autenthicated", (done) => {
    isLoggedIn.mockImplementation((req, res, next) => {
      return res.status(401).json({ error: "Not authenticated" });
    });

    request(app)
      .get("/api/proposals/P001")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body).toEqual({ error: "Not authenticated" });
        expect(isLoggedIn).toHaveBeenCalled();
        expect(getProposalById).not.toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T3.2 - ERROR 404 | Proposal not found", (done) => {
    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    getProposalById.mockRejectedValue({
      status: 404,
      data: "Proposal not found",
    });

    request(app)
      .get("/api/proposals/P001")
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: "Proposal not found" });
        expect(isLoggedIn).toHaveBeenCalled();
        expect(getProposalById).toHaveBeenCalledWith("P001");
        done();
      })
      .catch((err) => done(err));
  });

  test("T3.3 - SUCCESS 200 | Proposal found", (done) => {
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = { id: "S001" };
      next(); // Authenticated
    });

    const mockProposalRes = {
      proposal_id: "P001",
      title: "Test proposal",
      supervisor_id: "T001", cod_group: "G001",
      keywords: ["k1", "k2"],
      type: "Master",
      groups: ["G001", "G002"],
      description: "Test description",
      required_knowledge: "Node.js, PostgreSQL, React.js",
      notes: "some notes",
      expiration_date: "2024-06-30",
      level: "Undergraduate",
      programmes: [
        {
          cod_degree: "MSC001",
          name: "Master in Computer Science",
        },
      ],
    };

    getProposalById.mockResolvedValue({ status: 200, data: mockProposalRes });

    request(app)
      .get("/api/proposals/P001")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockProposalRes);
        expect(isLoggedIn).toHaveBeenCalled();
        expect(getProposalById).toHaveBeenCalledWith("P001");
        done();
      })
      .catch((err) => done(err));
  });
});

describe("T4 - Get proposals by professor unit tests", () => {
  test("T4.1 - ERROR 401 | Not authenticated", (done) => {
    isLoggedIn.mockImplementation((req, res, next) => {
      return res.status(401).json({ error: "Not authenticated" });
    });

    request(app)
      .get("/api/proposals/professor")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body).toEqual({ error: "Not authenticated" });
        expect(isLoggedIn).toHaveBeenCalled();
        expect(getAllProfessorProposals).not.toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T4.2 ERROR 401 | Not authorized", (done) => {
    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      return res
        .status(401)
        .json({ error: "Not authorized, must be a Teacher" });
    });

    request(app)
      .get("/api/proposals/professor")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body.error).toEqual("Not authorized, must be a Teacher");
        expect(getAllProfessorProposals).not.toHaveBeenCalled();
        expect(isLoggedIn).toHaveBeenCalled();
        expect(isTeacher).toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T4.3 SUCCESS 200 | List of proposals", (done) => {

    const mockProposals = [
      {
        proposal_id: "P003",
        title: "Artificial Intelligence",
        supervisor_surname: "Gomez",
        supervisor_name: "Ana",
        keywords: [
          "AI", "Machine Learning"
        ],
        type: "Experimental",
        groups: [
          "Group A"
        ],
        description: "An AI research thesis description",
        required_knowledge: "Python, TensoFlow",
        notes: "N/A",
        expiration_date: "2024-05-14T22:00:00.000Z",
        level: "Master",
        degrees: [
          "Master of Science"
        ]
      }
    ];

    const mockedTeacherId = "T000";

    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = { id: mockedTeacherId };

      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      next();   // Authorized
    });

    getAllProfessorProposals.mockResolvedValue({
      status: 200,
      data: mockProposals
    });


    request(app)
      .get("/api/proposals/professor")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ proposals: mockProposals });
        expect(getAllProfessorProposals).toHaveBeenCalled();
        expect(isLoggedIn).toHaveBeenCalled();
        expect(isTeacher).toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T4.4 ERROR 404 | Proposals not found", (done) => {
    const mockedTeacherId = "T000";

    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = { id: mockedTeacherId };

      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      next();   // Authorized
    });

    getAllProfessorProposals.mockRejectedValue({
      status: 404,
      data: "Proposals not found"
    });


    request(app)
      .get("/api/proposals/professor")
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: "Proposals not found" });
        expect(getAllProfessorProposals).toHaveBeenCalled();
        expect(isLoggedIn).toHaveBeenCalled();
        expect(isTeacher).toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T4.5 ERROR 500 | Internal Server Error", (done) => {
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user.id = "T002";
      next(); // Authenticated
    });

    isStudent.mockImplementation((req, res, next) => {
      next(); // Authorized
    });

    getAllProposals.mockImplementation((mockedStudentDegree) => {
      throw Error("some error");
    });

    request(app)
      .get("/api/proposals")
      .then((res) => {
        expect(res.status).toBe(500);
        done();
      });
  });

});

describe("T5 - Delete a proposal unit tests", () => {
  test("T5.1 SUCCESS 204 | deleteProposal", (done) => {

    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = { id: "T001" };
      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      next();   // Authorized
    });

    const mockProposal = {
      data: {
        supervisor_id: 'T001',
        expiration_date: '2024-05-14',
        archived: false,
        deleted: false,
      },
    };

    getProposalById.mockResolvedValue(mockProposal);
    getAllApplicationsByProposalId.mockResolvedValueOnce({
      data: [
        {
          id: 'A001',
          proposal_id: 'P001',
          student_id: 'S012',
          status: 'Pending',
          application_date: '2023-05-14',
        },
      ]
    });
    deleteProposal.mockResolvedValue({ data: true });


    request(app)
      .delete("/api/proposals/P001")
      .then((res) => {
        expect(res.status).toBe(204);
        expect(res.body).toEqual({});
        expect(getAllApplicationsByProposalId).toHaveBeenCalled();
        expect(getProposalById).toHaveBeenCalled();
        expect(deleteProposal).toHaveBeenCalled();
        expect(isLoggedIn).toHaveBeenCalled();
        expect(isTeacher).toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));

  });


  test("T5.2 ERROR 401 | Unauthorized access (Proposal does not belong to the teacher)", (done) => {
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = { id: "T002" };
      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      next();   // Authorized
    });

    const mockProposal = {
      data: {
        supervisor_id: 'T001',
        expiration_date: '2024-05-14',
        archived: false,
        deleted: false,
      },
    };

    getProposalById.mockResolvedValue(mockProposal);

    request(app)
      .delete("/api/proposals/P001")
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body).toEqual({ error: "Access to this thesis proposal is unauthorized. Please ensure you have the necessary permissions to view this content." });
        expect(getProposalById).toHaveBeenCalled();
        expect(isLoggedIn).toHaveBeenCalled();
        expect(isTeacher).toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T5.3.1 ERROR 403 | Expired proposal", (done) => {
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = { id: "T001" };
      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      next();   // Authorized
    });

    const mockProposal = {
      data: {
        supervisor_id: 'T001',
        expiration_date: '2023-01-01', // Past date
        archived: false,
        deleted: false,
      },
    };

    getProposalById.mockResolvedValue(mockProposal);

    request(app)
      .delete("/api/proposals/P001")
      .then((res) => {
        expect(res.status).toBe(403);
        expect(res.body).toEqual({ error: "Cannot delete an expired proposal" });
        expect(getProposalById).toHaveBeenCalled();
        expect(isLoggedIn).toHaveBeenCalled();
        expect(isTeacher).toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });


  test("T5.3.2 ERROR 403 | Archived proposal", (done) => {
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = { id: "T001" };
      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      next();   // Authorized
    });

    const mockProposal = {
      data: {
        supervisor_id: 'T001',
        expiration_date: '2024-01-01',
        archived: true, //True
        deleted: false,
      },
    };

    getProposalById.mockResolvedValue(mockProposal);

    request(app)
      .delete("/api/proposals/P001")
      .then((res) => {
        expect(res.status).toBe(403);
        expect(res.body).toEqual({ error: "Cannot delete an archived proposal" });
        expect(getProposalById).toHaveBeenCalled();
        expect(isLoggedIn).toHaveBeenCalled();
        expect(isTeacher).toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T5.3.3 ERROR 403 | Already deleted proposal", (done) => {
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = { id: "T001" };
      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      next();   // Authorized
    });

    const mockProposal = {
      data: {
        supervisor_id: 'T001',
        expiration_date: '2024-01-01',
        archived: false,
        deleted: true,
      },
    };

    getProposalById.mockResolvedValue(mockProposal);

    request(app)
      .delete("/api/proposals/P001")
      .then((res) => {
        expect(res.status).toBe(403);
        expect(res.body).toEqual({ error: "Cannot delete an already deleted proposal" });
        expect(getProposalById).toHaveBeenCalled();
        expect(isLoggedIn).toHaveBeenCalled();
        expect(isTeacher).toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T5.3.4 ERROR 403 | Cannot delete if there is an accepted application related to the proposal", (done) => {

    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = { id: "T001" };
      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      next();   // Authorized
    });

    const mockProposal = {
      data: {
        supervisor_id: 'T001',
        expiration_date: '2024-05-14',
        archived: false,
        deleted: false,
      },
    };

    getProposalById.mockResolvedValue(mockProposal);
    getAllApplicationsByProposalId.mockResolvedValueOnce({
      data: [
        {
          id: 'A001',
          proposal_id: 'P001',
          student_id: 'S012',
          status: 'Accepted',
          application_date: '2023-05-14',
        },
      ]
    });
    deleteProposal.mockResolvedValue({ data: true });


    request(app)
      .delete("/api/proposals/P001")
      .then((res) => {
        expect(res.status).toBe(403);
        expect(res.body).toEqual({ error: "Cannot delete a proposal with an accepted application" });
        expect(getAllApplicationsByProposalId).toHaveBeenCalled();
        expect(getProposalById).toHaveBeenCalled();
        expect(isLoggedIn).toHaveBeenCalled();
        expect(isTeacher).toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));

  });

  test("T5.4 ERROR 500 | Internal server error", (done) => {
    isLoggedIn.mockImplementation((req, res, next) => {
      req.user = { id: "T001" };
      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      next();   // Authorized
    });

    getProposalById.mockRejectedValue(new Error('Some internal error'));

    request(app)
      .delete("/api/proposals/P001")
      .then((res) => {
        expect(res.status).toBe(500);
        expect(getProposalById).toHaveBeenCalled();
        expect(isLoggedIn).toHaveBeenCalled();
        expect(isTeacher).toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

});






describe("T6 - Update proposals unit tests", () => {
  const mockProposalReq = {
    proposal_id: "P001",
    title: "Update Proposal",
    keywords: ["Keyword1", "Keyword2"],
    type: "Experimental",
    description: "Test description",
    required_knowledge: "Node.js, PostgreSQL",
    notes: "Test notes",
    expiration_date: '2026-10-31',
    level: "Master",
    programmes: ["Master of Science", "Master of Business"],
  };

  test("T6.1 - ERROR 401    | Not authenticated", (done) => {
    const mockProposalReq = {};
    const message = "Not authenticated";

    isLoggedIn.mockImplementation((req, res, next) => {
      return res.status(401).json({ error: message });
    });

    request(app)
      .put("/api/proposals/" + "P001")
      .send(mockProposalReq)
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body).toEqual({ error: message });
        expect(isLoggedIn).toHaveBeenCalled();
        expect(isTeacher).not.toHaveBeenCalled();
        expect(getProposalById).not.toHaveBeenCalled();
        expect(updateProposal).not.toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T6.2 - ERROR 401    | Not authorized", (done) => {
    const mockProposalReq = {};
    const message = "Not authorized";

    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      return res.status(401).json({ error: message });
    });

    request(app)
      .put("/api/proposals/" + "P001")
      .send(mockProposalReq)
      .then((res) => {
        expect(res.status).toBe(401);
        expect(res.body).toEqual({ error: message });
        expect(isLoggedIn).toHaveBeenCalled();
        expect(isTeacher).toHaveBeenCalled();
        expect(getProposalById).not.toHaveBeenCalled();
        expect(updateProposal).not.toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T6.3 - ERORR 403    | Not authorized", (done) => {
    const message = "Not authorized!";

    const mockProposalRes = {
      ...mockProposalReq,
    };

    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      req.user = { id: "T002" };
      next(); // Authenticated with another professor
    });

    const mockProposalInDb = {
      data: {
        supervisor_id: 'T001'
      },
    };

    getProposalById.mockResolvedValue(mockProposalInDb);
    updateProposal.mockResolvedValue(mockProposalRes);

    request(app)
      .put("/api/proposals/" + "P001")
      .send(mockProposalReq)
      .then((res) => {
        expect(res.status).toBe(403);
        expect(res.body).toEqual({ error: message });
        expect(isLoggedIn).toHaveBeenCalled();
        expect(isTeacher).toHaveBeenCalled();
        expect(getProposalById).toHaveBeenCalled();
        expect(updateProposal).not.toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T6.4 - ERROR 404    | Proposal not found", (done) => {
    const message = { error: "Proposal not found!" };

    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      req.user = { id: "T001" };
      next(); // Authenticated
    });

    const mockProposalInDb = {
      status: 404,
      data: "The proposal has not been found!"
    };

    getProposalById.mockRejectedValue(mockProposalInDb);

    request(app)
      .put("/api/proposals/" + "P001")
      .send(mockProposalReq)
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.body).toEqual(message);
        expect(isLoggedIn).toHaveBeenCalled();
        expect(isTeacher).toHaveBeenCalled();
        expect(getProposalById).toHaveBeenCalled();
        expect(updateProposal).not.toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T6.5 - ERROR 422    | Empty title field", (done) => {
    let mockProposal = {
      ...mockProposalReq,
      title: ""
    };

    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    request(app)
      .put("/api/proposals/" + "P001")
      .send(mockProposal)
      .then((res) => {
        expect(res.status).toBe(422);
        expect(res.body).not.toBeFalsy();
        expect(isLoggedIn).toHaveBeenCalled();
        expect(isTeacher).toHaveBeenCalled();
        expect(getProposalById).not.toHaveBeenCalled();
        expect(updateProposal).not.toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T6.6 - ERROR 422    | Missing date field", (done) => {
    let mockProposal = {
      ...mockProposalReq,
    };
    delete mockProposal.expiration_date;

    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    request(app)
      .put("/api/proposals/" + "P001")
      .send(mockProposal)
      .then((res) => {
        expect(res.status).toBe(422);
        expect(res.body).not.toBeFalsy();
        expect(isLoggedIn).toHaveBeenCalled();
        expect(isTeacher).toHaveBeenCalled();
        expect(getProposalById).not.toHaveBeenCalled();
        expect(updateProposal).not.toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T6.7 - ERROR 422    | Invalid date format", (done) => {
    let mockProposal = {
      ...mockProposalReq,
    };
    mockProposal.expiration_date = "20-10-2023";

    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    request(app)
      .put("/api/proposals/" + "P001")
      .send(mockProposal)
      .then((res) => {
        expect(res.status).toBe(422);
        expect(res.body).not.toBeFalsy();
        expect(isLoggedIn).toHaveBeenCalled();
        expect(isTeacher).toHaveBeenCalled();
        expect(getProposalById).not.toHaveBeenCalled();
        expect(updateProposal).not.toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T6.8 - ERROR 422    | Invalid date", (done) => {
    let mockProposal = {
      ...mockProposalReq,
    };
    mockProposal.expiration_date = "2023-02-29";

    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    request(app)
      .put("/api/proposals/" + "P001")
      .send(mockProposal)
      .then((res) => {
        expect(res.status).toBe(422);
        expect(res.body).not.toBeFalsy();
        expect(isLoggedIn).toHaveBeenCalled();
        expect(isTeacher).toHaveBeenCalled();
        expect(getProposalById).not.toHaveBeenCalled();
        expect(updateProposal).not.toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T6.9 - ERROR 422    | Array of strings contains some elements which are not strings", (done) => {
    let mockProposal = {
      ...mockProposalReq,
    };
    mockProposal.keywords = ["k1", 123];

    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    request(app)
      .put("/api/proposals/" + "P001")
      .send(mockProposal)
      .then((res) => {
        expect(res.status).toBe(422);
        expect(res.body).not.toBeFalsy();
        expect(isLoggedIn).toHaveBeenCalled();
        expect(isTeacher).toHaveBeenCalled();
        expect(getProposalById).not.toHaveBeenCalled();
        expect(updateProposal).not.toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T6.10 - ERROR 400   | Bad request", (done) => {
    let mockProposal = {
      ...mockProposalReq,
    };
    mockProposal.proposal_id = "-1";
    const message = "Bad request!";

    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      req.user = { id: "T001" };
      next(); // Authenticated
    });

    const mockProposalInDb = {
      data: {
        supervisor_id: 'T001'
      },
    };

    getProposalById.mockResolvedValue(mockProposalInDb);

    request(app)
      .put("/api/proposals/" + "P001")
      .send(mockProposal)
      .then((res) => {
        expect(res.body).toEqual({ error: message });
        expect(res.status).toBe(400);
        expect(isLoggedIn).toHaveBeenCalled();
        expect(isTeacher).toHaveBeenCalled();
        expect(getProposalById).toHaveBeenCalled();
        expect(updateProposal).not.toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T6.11 - SUCCESS 200 | Proposal updated", (done) => {
    const mockProposalRes = {
      ...mockProposalReq,
    };

    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      req.user = { id: "T001" };
      next(); // Authenticated
    });

    const mockProposalInDb = {
      data: {
        supervisor_id: 'T001'
      },
    };

    getProposalById.mockResolvedValue(mockProposalInDb);
    updateProposal.mockResolvedValue(mockProposalRes);

    request(app)
      .put("/api/proposals/" + "P001")
      .send(mockProposalReq)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual({});
        expect(isLoggedIn).toHaveBeenCalled();
        expect(isTeacher).toHaveBeenCalled();
        expect(getProposalById).toHaveBeenCalled();
        expect(updateProposal).toHaveBeenCalledWith({ ...mockProposalReq });
        done();
      })
      .catch((err) => done(err));
  });

  test("T6.12 - SUCCESS 200 | Undefined required knowledge field", (done) => {
    let mockProposal = {
      ...mockProposalReq,
      required_knowledge: undefined
    };

    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      req.user = { id: "T001" };
      next(); // Authenticated
    });

    const mockProposalInDb = {
      data: {
        supervisor_id: 'T001'
      },
    };

    const mockProposalRes = {
      ...mockProposal,
      proposal_id: "P001",
      supervisor_id: "T001",
      cod_group: "G001"
    };

    getProposalById.mockResolvedValue(mockProposalInDb);
    updateProposal.mockResolvedValue(mockProposalRes);

    request(app)
      .put("/api/proposals/" + "P001")
      .send(mockProposal)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual({});
        expect(isLoggedIn).toHaveBeenCalled();
        expect(isTeacher).toHaveBeenCalled();
        expect(getProposalById).toHaveBeenCalled();
        expect(updateProposal).toHaveBeenCalledWith({ ...mockProposal });
        done();
      })
      .catch((err) => done(err));
  });

  test("T6.13 - SUCCESS 200 | Undefined notes field", (done) => {
    let mockProposal = {
      ...mockProposalReq,
      notes: undefined
    };

    const mockProposalRes = {
      ...mockProposal,
      proposal_id: "P001",
      supervisor_id: "T001",
      cod_group: "G001"
    };

    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      req.user = { id: "T001" };
      next(); // Authenticated
    });

    const mockProposalInDb = {
      data: {
        supervisor_id: 'T001'
      },
    };

    getProposalById.mockResolvedValue(mockProposalInDb);
    updateProposal.mockResolvedValue(mockProposalRes);

    request(app)
      .put("/api/proposals/" + "P001")
      .send(mockProposal)
      .then((res) => {
        expect(res.body).toEqual({});
        expect(res.status).toBe(200);
        expect(isLoggedIn).toHaveBeenCalled();
        expect(isTeacher).toHaveBeenCalled();
        expect(getProposalById).toHaveBeenCalled();
        expect(updateProposal).toHaveBeenCalledWith({ ...mockProposal });
        done();
      })
      .catch((err) => done(err));
  });

  test("T6.14 - ERROR 500   | Database error", (done) => {
    isLoggedIn.mockImplementation((req, res, next) => {
      next(); // Authenticated
    });

    isTeacher.mockImplementation((req, res, next) => {
      req.user = { id: "T001" };
      next(); // Authenticated
    });

    const mockProposalInDb = {
      data: {
        supervisor_id: 'T001'
      },
    };

    getProposalById.mockResolvedValue(mockProposalInDb);
    updateProposal.mockImplementation(() => {
      throw Error("Internal Database Error");
    });

    const message = { "error": "Internal server error has occurred" };

    request(app)
      .put("/api/proposals/" + "P001")
      .send(mockProposalReq)
      .then((res) => {
        expect(res.status).toBe(500);
        expect(res.body).toEqual(message);
        expect(isLoggedIn).toHaveBeenCalled();
        expect(isTeacher).toHaveBeenCalled();
        expect(getProposalById).toHaveBeenCalled();
        expect(updateProposal).toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });
});
