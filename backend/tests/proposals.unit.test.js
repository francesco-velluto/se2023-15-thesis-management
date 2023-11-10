"use strict";
const request = require("supertest");
const proposalsController = require("../controllers/proposals");
const {
  getMaxProposalIdNumber,
  insertProposal,
} = require("../service/proposals.service");
const app = require("../app");

jest.mock("../service/proposals.service");

beforeAll(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'info').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

beforeEach(() => {
  //jest.clearAllMocks();
    getMaxProposalIdNumber.mockClear();
    insertProposal.mockClear();
});

afterAll(() => {
    jest.restoreAllMocks();
})

/* describe.skip("T1 - Get all proposals Unit Tests", () => {
  test("ERROR 401 | Unauthorized", () => {
    // TODO - this is an example, change it if needed
    const req = {};
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    proposalsController.getAllProposals(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
  });

  test("ERROR 500 | Internal server error", () => {
    // TODO - this is an example, change it if needed
    const req = {};
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    proposalsController.getAllProposals(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Internal server error has occurred",
    });
  });

  test("SUCCESS | Get all proposals", () => {
    // TODO - this is an example, change it if needed
    const req = {};
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    proposalsController.getAllProposals(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      proposals: [
        {
          id: 1,
          title: "Proposal 1",
          description: "Description 1",
        },
        {
          id: 2,
          title: "Proposal 2",
          description: "Description 2",
        },
      ],
    });
  });
}); */

describe("T2 - Insert proposals unit tests", () => {
  test.skip("T2.1 - ERROR 401 | Unauthorized", async () => {
    const req = {};
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await proposalsController.insertProposal(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
  });

  test("T2.2 - SUCCESS 201 | New proposal inserted", async () => {
    const mockProposalReq = {
      title: "Test title",
      supervisor_id: "T002",
      keywords: ["k1", "k2"],
      type: "Master",
      groups: ["Group A", "Group B"],
      description: "Test description",
      required_knowledge: "Node.js, PostgreSQL, React.js",
      notes: "test notes",
      expiration_date: "2024-06-30",
      level: "Undergraduate",
      cds_programmes: ["CD008"],
    };

    const req = {
      body: mockProposalReq,
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    getMaxProposalIdNumber.mockResolvedValue(10);

    const mockProposalRes = { proposal_id: 11, ...mockProposalReq };
    insertProposal.mockResolvedValue(mockProposalRes);

    await proposalsController.insertProposal(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ proposal: mockProposalRes });
  });

  test("T2.2 - ERROR 422 | Empty title field", (done) => {
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
      cds_programmes: ["CD008"],
    };

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

  test("T2.3 - SUCCESS 201 | Undefined notes field", (done) => {
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
      cds_programmes: ["CD008"],
    };

    const mockProposalRes = {...mockProposalReq, proposal_id: "P011"}
    getMaxProposalIdNumber.mockResolvedValue(10);

    insertProposal.mockResolvedValue(mockProposalRes);

    request(app)
      .post("/api/proposals")
      .send(mockProposalReq)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body).toEqual({ proposal: mockProposalRes });
        expect(getMaxProposalIdNumber).toHaveBeenCalled();
        expect(insertProposal).toHaveBeenCalledWith({...mockProposalRes});
        done();
      })
      .catch((err) => done(err));
  });

  test("T2.4 - SUCCESS 201 | Undefined groups field", (done) => {
    const mockProposalReq = {
      title: "TEST",
      supervisor_id: "T002",
      keywords: ["k1", "k2"],
      type: "Master",
      groups: undefined,
      description: "Test description",
      required_knowledge: "Node.js, PostgreSQL, React.js",
      notes: "notes",
      expiration_date: "2024-06-30",
      level: "Undergraduate",
      cds_programmes: ["CD008"],
    };

    const mockProposalRes = {...mockProposalReq, proposal_id: "P011"}
    getMaxProposalIdNumber.mockResolvedValue(10);

    insertProposal.mockResolvedValue(mockProposalRes);

    request(app)
      .post("/api/proposals")
      .send(mockProposalReq)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body).toEqual({ proposal: mockProposalRes });
        expect(getMaxProposalIdNumber).toHaveBeenCalled();
        expect(insertProposal).toHaveBeenCalledWith({...mockProposalRes});
        done();
      })
      .catch((err) => done(err));
  });

  test("T2.5 - ERROR 422 | Missing date field", (done) => {
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
      cds_programmes: ["CD008"],
    };

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

  test("T2.6 - ERROR 422 | Invalid date format", (done) => {
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
      cds_programmes: ["CD008"],
    };

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

  test("T2.7 - ERROR 422 | Invalid date", (done) => {
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
      cds_programmes: ["CD008"],
    };

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

  test("T2.8 - ERROR 422 | Array of strings contains some elements which are not strings", (done) => {
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
      cds_programmes: ["CD008"],
    };

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

  test("T2.9 - ERROR 500 | Database error", (done) => {
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
      cds_programmes: ["CD008"],
    };

    const mockProposalRes = {...mockProposalReq, proposal_id: "P011"}
    getMaxProposalIdNumber.mockResolvedValue(10);

    insertProposal.mockImplementation(() => {
        throw Error("some error");
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
