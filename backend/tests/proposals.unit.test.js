"use strict";

const proposalsController = require("../controllers/proposals");

beforeAll(() => {
    jest.clearAllMocks();
});

describe("Proposals Unit Tests", () => {
    test("ERROR 401 | Unauthorized", () => {
        // TODO - this is an example, change it if needed
        const req = {};
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
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
            json: jest.fn()
        };

        proposalsController.getAllProposals(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Internal server error has occurred" });
    });

    test("SUCCESS | Get all proposals", () => {
        // TODO - this is an example, change it if needed
        const req = {};
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        proposalsController.getAllProposals(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ proposals: [
            {
                id: 1,
                title: "Proposal 1",
                description: "Description 1"
            },
            {
                id: 2,
                title: "Proposal 2",
                description: "Description 2"
            }
        ] });
    });
});