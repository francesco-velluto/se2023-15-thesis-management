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
});

beforeEach(() => {
    jest.clearAllMocks();
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

  test.only("T2.2 - SUCCESS | New proposal inserted", async () => {
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

  test.only("T2.2 - ERROR 422 | Empty title field", (done) => {
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
        .catch((err) => done(err))
  });
});
