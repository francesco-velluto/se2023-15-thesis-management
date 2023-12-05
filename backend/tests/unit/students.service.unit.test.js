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
