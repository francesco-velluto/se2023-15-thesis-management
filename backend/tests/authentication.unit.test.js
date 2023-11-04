"use strict";

const authenticationController = require("../controllers/authentication");

beforeAll(() => {
    jest.clearAllMocks();
});

describe("Authentication Unit Tests", () => {
    test("ERROR 400 | Missing username or password", () => {
        // TODO - this is an example, change it if needed
        const req = {
            body: {}
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        authenticationController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Missing username or password" });
    });

    test("ERROR 401 | Wrong username or password", () => {
        // TODO - this is an example, change it if needed
        const req = {
            body: {
                username: "username",
                password: "wrong-password"
            }
        };

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        }

        authenticationController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "Wrong username or password" });
    });

    test("ERROR 500 | Internal server error", () => {
        // TODO - this is an example, change it if needed
        const req = {
            body: {
                username: "username",
                password: "password"
            }
        };

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        }

        authenticationController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Internal server error has occurred" });
    });

    test("SUCCESS | Login", () => {
        // TODO - this is an example, change it if needed
        const req = {
            body: {
                username: "username",
                password: "password"
            }
        };

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        }

        authenticationController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ token: "token" });
    });
});