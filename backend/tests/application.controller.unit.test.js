"use strict";

const request = require("supertest");

const {
  isLoggedIn,
  isTeacher,
  isStudent,
} = require("../controllers/authentication");

const { getAllApplicationsByStudentId } = require("../service/applications.service");
 const controller = require('../controllers/applications')
const app = require("../app");

jest.mock("../service/applications.service");
jest.mock("../controllers/authentication");

beforeAll(() => {
    jest.clearAllMocks();
    getAllApplicationsByStudentId.mockClear();
    jest.spyOn(console, "log").mockImplementation(() => { });
    jest.spyOn(console, "info").mockImplementation(() => { });
    jest.spyOn(console, "error").mockImplementation(() => { });
  });

beforeEach(() => {
  jest.clearAllMocks();
  isLoggedIn.mockClear();
  isTeacher.mockClear();
});

afterAll(() => {
    jest.restoreAllMocks();
  });

describe('Controller Tests', () => {

  describe('getAllApplicationsByStudentId', () => {

    it('get all application controller', (done) => {
        const req = {
            params: { student_id: 'authorizedStudentId' },
            user: { id: 'authenticatedStudentId' }, // Simulate authenticated user
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        
        const expectedApplications = {
            1: [
              {
                proposal_id: 1,
                title: 'Proposal 1',
                description: 'Description 1',
                
              },
              {
                proposal_id: 1,
                title: 'Proposal 1',
                description: 'Description 1',               
              },
            ],
          };

        isLoggedIn.mockImplementation((req, res, next) => {
            req.user = { id: 'authenticatedStudentId' };
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

    it('should handle unauthorized access', async () => {
        const mockRequest = {
            params: { student_id: 'unauthorizedStudentId' },
            user: { id: 'authenticatedStudentId' }, // Simulate authenticated user
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    
        await controller.getAllApplicationsByStudentId(mockRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: "You cannot get applications of another student" });
        });
    
    it('should handle service layer error', async () => {
    // todo 
    });

    });

    


});
