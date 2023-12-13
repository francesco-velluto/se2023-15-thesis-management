const service = require("../../service/teachers.service");
const db = require("../../service/db");
const Teacher = require("../../model/Teacher");

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

describe("T1 - getTeachers", () => {
  const mockTeachers = [
    new Teacher(
      'T001',
      'Anderson',
      'Sarah',
      'sarah.anderson@example.com',
      'G001',
      'D001'
    ),
    new Teacher(
      'T002',
      'Wilson',
      'Michael',
      'michael.wilson@example.com',
      'G002',
      'D002'
    ),
    new Teacher(
      'T003',
      'Gomez',
      'Ana',
      'ana.gomez@example.com',
      'G001',
      'D001'
    ),
  ];

  test("T1.1 SUCCESS | Get teachers", (done) => {
    db.query.mockResolvedValue({ rows: mockTeachers, rowCount: 3 });

    service.getTeachers()
      .then((result) => {
        expect(result).toEqual(mockTeachers);
        expect(db.query).toHaveBeenCalledWith(
          expect.any(String)
        );
        done();
      })
      .catch((error) => done(error));
  });

  test("T1.2 SUCCESS | There are not teachers", (done) => {
    db.query.mockResolvedValue({ rows: [], rowCount: 0 });

    service.getTeachers()
      .then((result) => {
        expect(result).toEqual([]);
        expect(db.query).toHaveBeenCalledWith(
          expect.any(String)
        );
        done();
      })
      .catch((error) => done(error));
  });

  test("T1.3 ERROR | Throw an Error", (done) => {
    const message = new Error("Database error");
    db.query.mockRejectedValue(message);

    service.getTeachers()
      .catch((error) => {
        expect(error).toEqual(message);
        expect(db.query).toHaveBeenCalled();
        done();
      });
  });
});

describe("T2 - getTeacherById", () => {
  const mockTeacher = {
    id: 'T001',
    surname: 'Anderson',
    name: 'Sarah',
    email: 'sarah.anderson@example.com',
    cod_goup: 'G001',
    cod_department: 'D001'
  };

  test("T2.1 SUCCESS | Get teacher by id", (done) => {
    db.query.mockResolvedValueOnce({ rows: [mockTeacher], rowCount: 1 });

    service.getTeacherById(mockTeacher.id)
      .then((result) => {
        expect(result).toEqual({ data: mockTeacher });
        expect(db.query).toHaveBeenCalledWith(
          expect.any(String),
          expect.arrayContaining([
            mockTeacher.id,
          ])
        );
        done();
      })
      .catch((error) => done(error));
  });

  test("T2.2 SUCCESS | There is not any teacher with this id", (done) => {
    db.query.mockResolvedValue({ rows: [], rowCount: 0 });

    service.getTeacherById(mockTeacher.id)
      .then((result) => {
        expect(result).toEqual({ "data": undefined });
        expect(db.query).toHaveBeenCalled();
        done();
      })
      .catch((error) => done(error));
  });

  test("T2.3 ERROR | Throw an Error", (done) => {
    const message = new Error("Database error");
    db.query.mockRejectedValue(message);

    service.getTeacherById(mockTeacher.id)
      .catch((error) => {
        expect(error).toEqual(message);
        expect(db.query).toHaveBeenCalled();
        done();
      });
  });

  test("T2.4 ERROR | The id is undefined", (done) => {
    const message = new Error("The id cannot be undefined");
    db.query.mockRejectedValue(message);

    service.getTeacherById(undefined)
      .catch((error) => {
        expect(error).toEqual(message);
        expect(db.query).toHaveBeenCalled();
        done();
      });
  });
});

