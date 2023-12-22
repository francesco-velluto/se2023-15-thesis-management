"use strict";

const db = require("../../service/db");
const studentNotifsService = require('../../service/studentnotifs.service');
const teacherNotifsService = require('../../service/teachernotifs.service');

jest.mock("../../service/db", () => ({
  query: jest.fn(),
}));

beforeEach(() => {
  jest.resetAllMocks();
  // comment these lines if you want to see console prints during tests
  jest.spyOn(console, "log").mockImplementation(() => { });
  jest.spyOn(console, "info").mockImplementation(() => { });
  jest.spyOn(console, "error").mockImplementation(() => { });
});

describe('T1 - createNewStudentNotification', () => {
  const studentId = 'S001';
  const campaign = 'Test Campaign';
  const subject = 'Test Subject';
  const content = 'Test Content';

  it('T1.1 SUCCESS | Should insert a new notification with the correct parameters', async () => {
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

  it('T1.2 ERROR   | Should throw error if the query returns an empty rows', (done) => {
    db.query.mockResolvedValueOnce({
      rows: [],
      rowCount: 0,
    });

    studentNotifsService.createNewStudentNotification(studentId, campaign, subject, content)
      .catch((error) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe("Insert query returned no rows");
        expect(db.query).toHaveBeenCalled();
        done();
      });
  });

  it('T1.3 ERROR   | Should throw error if a generic error occurs on the database', async () => {
    db.query.mockImplementation(async () => {
      throw new Error("Internal error");
    });

    expect(studentNotifsService.createNewStudentNotification(studentId, campaign, subject, content)).rejects.toThrow(
      "Internal error"
    );
  });
});

describe('T2 - updateStudentNotificationStatus', () => {

  it('T2.1 SUCCESS | Should update the notification with the correct parameters', async () => {
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

  it('T2.2 ERROR   | Should throw error if a generic error occurs on the database', async () => {
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

describe('T3 - createNewTeacherNotification', () => {
  const teacherId = 'T001';
  const campaign = 'Test Campaign';
  const subject = 'Test Subject';
  const content = 'Test Content';

  it('T3.1 SUCCESS | Should insert a new notification with the correct parameters', async () => {
    db.query.mockResolvedValueOnce({
      rows: [{ id: 1 }],
      rowCount: 1,
    });

    const result = await teacherNotifsService.createNewTeacherNotification(teacherId, campaign, subject, content);

    expect(result).toEqual({ notificationId: 1 });
  });

  it('T3.2 ERROR   | Should throw error if the query returns an empty rows', (done) => {
    db.query.mockResolvedValueOnce({
      rows: [],
      rowCount: 0,
    });

    teacherNotifsService.createNewTeacherNotification(teacherId, campaign, subject, content)
      .catch((error) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe("Insert query returned no rows");
        expect(db.query).toHaveBeenCalled();
        done();
      });
  });

  it('T3.3 ERROR   | Should throw error if a generic error occurs on the database', async () => {
    db.query.mockImplementation(async () => {
      throw new Error("Internal error");
    });

    expect(teacherNotifsService.createNewTeacherNotification(teacherId, campaign, subject, content)).rejects.toThrow("Internal error");
  });
});

describe('T4 - updateTeacherNotificationStatus', () => {
  it('T4.1 SUCCESS | Should update the notification with the correct parameters', async () => {
    const notificationId = 1;
    const status = 'Test Status';

    db.query.mockResolvedValueOnce({
      rows: [],
      rowCount: 1,
    });

    const result = await teacherNotifsService.updateTeacherNotificationStatus(notificationId, status);

    expect(result).toBeUndefined();
  });

  it('T4.2 ERROR   | Should throw error if a generic error occurs on the database', async () => {
    const notificationId = 1;
    const status = 'Test Status';

    db.query.mockImplementation(async () => {
      throw new Error("Internal error");
    });

    expect(teacherNotifsService.updateTeacherNotificationStatus(notificationId, status)).rejects.toThrow("Internal error");
  });
});