const studentService = require("../../service/students.service");
const db = require("../../service/db");
const Student = require("../../model/Student");

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

describe("UNIT-SERVICE: getStudentById", () => {
  it("should return undefined data field if student doesn't exist", async () => {
    db.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });

    const res = await studentService.getStudentById("S001");
    expect(res.data).toBeUndefined();
  });

  it("should return the student", async () => {
    const mockStudent = new Student("S001");

    db.query.mockResolvedValueOnce({
      rows: [mockStudent],
      rowCount: 1,
    });

    const res = await studentService.getStudentById("S001");

    expect(res).toEqual({
      data: mockStudent,
    });
  });

  it("should throw error if a generic error occurs on the database", async () => {
    db.query.mockImplementation(async () => {
      throw new Error("Internal error");
    });

    expect(studentService.getStudentById("S001")).rejects.toThrow(
      "Internal error"
    );
  });
});

describe("UNIT-SERVICE: getStudentCareer", () => {
  it("should return the career of a student", async () => {
    const mockCareer = [
      {
        id: "S001",
        cod_degree: "L-31",
        enrollment_year: 2018,
      },
    ];

    db.query.mockResolvedValueOnce({
      rows: mockCareer,
    });

    const res = await studentService.getStudentCareer("S001");

    expect(res).toEqual({
      data: mockCareer,
    });
  });

  it("should throw error if a generic error occurs on the database", async () => {
    db.query.mockImplementation(async () => {
      throw new Error("Internal error");
    });

    expect(studentService.getStudentCareer("S001")).rejects.toThrow(
      "Internal error"
    );
  });
});

describe("UNIT-SERVICE: hasStudentAppliedForTeacher", () => {
  it("should return true if student has applied for teacher", async () => {
    db.query.mockResolvedValueOnce({
      rowCount: 1
    });

    const res = await studentService.hasStudentAppliedForTeacher(
      "S001",
      "T001"
    );

    expect(res).toBeTruthy();
  });

  it("should return false if student has not applied for teacher", async () => {
    db.query.mockResolvedValueOnce({
      rowCount: 0
    });

    const res = await studentService.hasStudentAppliedForTeacher(
      "S001",
      "T001"
    );

    expect(res).toBeFalsy();
  });

  it("should throw error if a generic error occurs on the database", async () => {
    db.query.mockImplementation(async () => {
      throw new Error("Internal error");
    });

    expect(
      studentService.hasStudentAppliedForTeacher("S001", "T001")
    ).rejects.toThrow("Internal error");
  });
});