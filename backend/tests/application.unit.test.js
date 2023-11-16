const applicationService = require('../service/applications.service');
const db = require('../service/db');
const Application = require('../model/Application');

jest.mock('../service/db', () => ({
  query: jest.fn(),
}));


beforeEach(() => {
  jest.resetAllMocks();
});

describe('getAllApplicationsByStudentId function', () => {
  it('should return all applications for a student by its id', async () => {
    db.query.mockResolvedValue({
      rows: [
        { thesis_id: '1', id: 's1', status: 'Pending', application_date: '12-01-2023' },
        { thesis_id: '2', id: 's2', status: 'Pending', application_date: '12-01-2023' },
        { thesis_id: '3', id: 's3', status: 'Pending', application_date: '12-01-2023' },
      ],
    });

    const expectedApplications = [
      new Application('1', 's1', 'Pending', '12-01-2023'),
      new Application('2', 's2', 'Pending', '12-01-2023'),
      new Application('3', 's3', 'Pending', '12-01-2023'),
    ];
    const res = await applicationService.getAllApplicationsByStudentId('studentId')

    expect(res.data).toEqual(expectedApplications);
    expect(res.status).toBe(200);
    expect(db.query).toHaveBeenCalledTimes(2);
  });

  it('should handle error', async () => {
    db.query.mockRejectedValue();
    try {
      await applicationService.getAllApplicationsByStudentId('studentId');
    } catch (err) {
      expect(err.data).toEqual('Internal server error' );
      expect(err.status).toBe(500);
    }
  });
});


describe('getAllApplicationsByTeacherId function', () => {
    it('should return all applications for thesis proposals supervised by a teacher', async () => {
        teacherId='teacher'
        db.query.mockResolvedValue({
            rows: [
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
          });
        
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
        
          const res = await applicationService.getAllApplicationsByTeacherId(teacherId);
        
          expect(res.data).toEqual(expectedApplications);
          expect(res.status).toBe(200);
          expect(db.query).toHaveBeenCalledTimes(1); 
        });
  
    it('should handle no applications found', async () => {
      db.query.mockResolvedValue({ rows: [] });
  
      const res = await applicationService.getAllApplicationsByTeacherId(teacherId);
  
      expect(res.data).toEqual([]);
      expect(res.status).toBe(200);
      expect(db.query).toHaveBeenCalledTimes(1); 
    });
  
    it('should handle internal server error', async () => {
      db.query.mockRejectedValue(new Error('Database error'));
  
      await expect(applicationService.getAllApplicationsByTeacherId(teacherId)).rejects.toEqual({
        status: 500,
        data: 'Internal server error',
      });
  
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });
  



describe('insertNewApplication function', () => {
  it('should insert a new application', async () => {
    const proposalId = 1;
    const studentId = 's1';

    db.query
      .mockResolvedValueOnce({ rows: [{ id: studentId }] }) 
      .mockResolvedValueOnce({ rows: [{ proposal_id: proposalId }] }); 

    db.query.mockResolvedValueOnce({ rows: [] });

    db.query.mockResolvedValueOnce({
      rows: [{ proposal_id: proposalId, id: studentId, status: 'Pending', application_date: '2023-01-01' }],
    });

    const res = await applicationService.insertNewApplication(proposalId, studentId);

    expect(res.rows).toHaveLength(1);
    expect(res.rows[0].proposal_id).toEqual(proposalId);
    expect(res.rows[0].id).toEqual(studentId);
    expect(res.rows[0].status).toEqual('Pending');
    expect(res.rows[0].application_date).toBeDefined();
    expect(db.query).toHaveBeenCalledTimes(4); 
  });

  
  it('should handle error', async () => {
    const proposalId = 1;
    const studentId = 's1';
    const mockError = new Error('Error during insert');
    db.query.mockRejectedValueOnce(mockError);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    try {
      await applicationService.insertNewApplication(proposalId, studentId);
    } catch (err) {
      expect(err).toBe(mockError);
    }
    expect(consoleErrorSpy).toHaveBeenCalledWith('[BACKEND-SERVER] Error in insertNewApplication service:', mockError);
    consoleErrorSpy.mockRestore();
  
  });

});


const controller = require('../controllers/applications');



describe('Controller Tests', () => {

  describe('getAllApplicationsByStudentId', () => {

    it('get all application controller', async () => {
        //todo
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
