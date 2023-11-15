"use strict";

const request = require("supertest");
const { isLoggedIn, isTeacher, isStudent } = require("../controllers/authentication");
const {
    getMaxProposalIdNumber,
    insertProposal,
    getProposalById,
    getAllProposals
} = require("../service/proposals.service");
const app = require("../app");

jest.mock("../service/proposals.service");
jest.mock("../controllers/authentication");

beforeAll(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "log").mockImplementation(() => { });
  jest.spyOn(console, "info").mockImplementation(() => { });
  jest.spyOn(console, "error").mockImplementation(() => { });
});

beforeEach(() => {
  //jest.clearAllMocks();
  getMaxProposalIdNumber.mockClear();
  insertProposal.mockClear();
  getAllProposals.mockClear();
  isLoggedIn.mockClear();
  isTeacher.mockClear();
  getProposalById.mockClear();
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
      return res.status(401).json({ error: "Not authorized, must be a Student" })
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
      })
  });


  test("T1.3 ERROR 500 | Internal server error", (done) => {

    isLoggedIn.mockImplementation((req, res, next) => {
      req.user.cod_degree = "MC001"
      next(); // Authenticated
    });

    isStudent.mockImplementation((req, res, next) => {
      console.log(req.user.cod_degree);
      next(); // Authorized
    });

    getAllProposals.mockImplementation((mockedStudentDegree) => {
      throw Error("some error");
    })

    request(app)
      .get("/api/proposals")
      .then((res) => {
        expect(res.status).toBe(500);
        done();
      });
  });

  test("T1.4 SUCCESS | Get all proposals", (done) => {
    const mockedStudentDegree = "MSC001";

    const mockedProposalsList =
    {
      proposals: [
        {
          proposal_id: "P002",
          title: "Machine Learning",
          supervisor_surname: "Wilson",
          supervisor_name: "Michael",
          keywords: [
            "Machine Learning",
            "AI"
          ],
          type: "Master",
          groups: [
            "Group B"
          ],
          description: "A machine learning thesis description.",
          required_knowledge: "Python, TensorFlow",
          notes: "N/A",
          expiration_date: "2024-06-29T22:00:00.000Z",
          level: "Graduate",
          degrees: [
            "Master of Science"
          ]
        },
        {
          proposal_id: "P003",
          title: "Artificial Intelligence",
          supervisor_surname: "Gomez",
          supervisor_name: "Ana",
          keywords: [
            "AI",
            "Machine Learning"
          ],
          type: "Master",
          groups: [
            "Group A"
          ],
          description: "An AI research thesis description.",
          required_knowledge: "Python, TensorFlow",
          notes: "N/A",
          expiration_date: "2024-05-14T22:00:00.000Z",
          level: "Graduate",
          degrees: [
            "Master of Science"
          ]
        }
      ]
    };

    isLoggedIn.mockImplementation((req, res, next) => {
      req.user.cod_degree = mockedStudentDegree;
      next(); // Authenticated
    });

    isStudent.mockImplementation((req, res, next) => {
      req.user.cod_degree = mockedStudentDegree;
      next(); // Authorized
    });

    getAllProposals.mockResolvedValue(mockedProposalsList);

    request(app)
      .get("/api/proposals")
      .then((res) => {
        expect(isLoggedIn).toHaveBeenCalled();
        expect(isStudent).toHaveBeenCalled();
        expect(getAllProposals).toHaveBeenCalled();
        expect(res.body).toEqual("sometihng");
        expect(res.body.proposals).toEqual(mockedProposalsList);
        expect(res.status).toBe(200);
        expect(res.body.error).toBeFalsy();
        done();
      })
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
      supervisor_id: "T002",
      keywords: ["k1", "k2"],
      type: "Master",
      groups: ["Group A", "Group B"],
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
      next(); // Authenticated
    });

    const mockProposalRes = { ...mockProposalReq, proposal_id: "P011" };
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
      supervisor_id: "T002",
      keywords: ["k1", "k2"],
      type: "Master",
      groups: ["Group A", "Group B"],
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
      supervisor_id: "T002",
      keywords: ["k1", "k2"],
      type: "Master",
      groups: ["Group A", "Group B"],
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
      next(); // Authenticated
    });

    const mockProposalRes = { ...mockProposalReq, proposal_id: "P011" };
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
      supervisor_id: "T002",
      keywords: ["k1", "k2"],
      type: "Master",
      groups: ["Group A"],
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
      next(); // Authenticated
    });

    const mockProposalRes = { ...mockProposalReq, proposal_id: "P011" };
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
      supervisor_id: "T002",
      keywords: ["k1", "k2"],
      type: "Master",
      groups: ["Group A", "Group B"],
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
      groups: ["Group A", "Group B"],
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
      groups: ["Group A", "Group B"],
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
      groups: ["Group A", "Group B"],
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

  test("T2.11 - ERROR 422 | Empty groups array", (done) => {
    const mockProposalReq = {
      title: "test",
      supervisor_id: "T002",
      keywords: ["k1", "k2"],
      type: "Master",
      groups: [],
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

  test("T2.12 - ERROR 500 | Database error", (done) => {
    const mockProposalReq = {
      title: "TEST",
      supervisor_id: "T002",
      keywords: ["k1", "k2"],
      type: "Master",
      groups: ["Group A", "Group B"],
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

describe("T3 - Get proposal by Id unit test", () => {
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

        getProposalById.mockRejectedValue({ status: 404, data: "Proposal not found" });

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
            next(); // Authenticated
        });

        const mockProposalRes = {
            proposal_id: "P001",
            title: "Test proposal",
            supervisor_id: "T001",
            keywords: ["k1", "k2"],
            type: "Master",
            groups: ["Group A", "Group B"],
            description: "Test description",
            required_knowledge: "Node.js, PostgreSQL, React.js",
            notes: "some notes",
            expiration_date: "2024-06-30",
            level: "Undergraduate",
            programmes: [
                {
                    cod_degree: "MSC001",
                    name: "Master in Computer Science"
                }
            ],
        };

        getProposalById.mockResolvedValue({status: 200, data: mockProposalRes});

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
