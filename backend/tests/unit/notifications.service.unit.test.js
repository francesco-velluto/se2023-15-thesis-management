"use strict";

const db = require("../../service/db");
const studentNotifsService = require('../../service/studentnotifs.service');

jest.mock("../../service/db", () => ({
    query: jest.fn(),
  }));

beforeEach(() => {
jest.resetAllMocks();
// comment these lines if you want to see console prints during tests
jest.spyOn(console, "log").mockImplementation(() => {});
jest.spyOn(console, "info").mockImplementation(() => {});
jest.spyOn(console, "error").mockImplementation(() => {});
});

describe('UNIT-SERVICE: createNewStudentNotification', () => {
    
    it('should insert a new notification with the correct parameters', async () => {
        const studentId = 'S001';
        const campaign = 'Test Campaign';
        const subject = 'Test Subject';
        const content = 'Test Content';

        db.query.mockResolvedValueOnce({
            rows: [{ id: 1 }],
            rowCount: 1,
          });

        // Call the function you're testing
        const result = await studentNotifsService.createNewStudentNotification(studentId, campaign, subject, content);

          expect(result).toEqual({
            notificationId: 1,
          });

    });

    it('should throw error if a generic error occurs on the database', async () => {
        const studentId = 'S001';
        const campaign = 'Test Campaign';
        const subject = 'Test Subject';
        const content = 'Test Content';
        
        db.query.mockImplementation(async () => {
          throw new Error("Internal error");
        });
    
        expect(studentNotifsService.createNewStudentNotification(studentId, campaign, subject, content)).rejects.toThrow(
          "Internal error"
        );
      });
});

describe('UNIT-SERVICE: updateStudentNotificationStatus', () => {
    
    it('should update the notification with the correct parameters', async () => {
        const notificationId = 1;
        const status = 'Test Status';

        db.query.mockResolvedValueOnce({
            rows: [],
            rowCount: 1,
          });

        // Call the function you're testing
        const result = await studentNotifsService.updateStudentNotificationStatus(notificationId, status);

          expect(result).toBeUndefined();

    });

    it('should throw error if a generic error occurs on the database', async () => {
        const notificationId = 1;
        const status = 'Test Status';
        
        db.query.mockImplementation(async () => {
          throw new Error("Internal error");
        });
    
        expect(studentNotifsService.updateStudentNotificationStatus(notificationId, status)).rejects.toThrow(
          "Internal error"
        );
      });
});