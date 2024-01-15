const { getStudentById, getStudentCareer, hasStudentAppliedForTeacher } = require("../../service/students.service");
const controller = require("../../controllers/students");
const Student = require("../../model/Student");

jest.mock("../../service/students.service");

describe("UNIT-CONTROLLER: getStudentById", () => {
  it("ERROR 404 | Should return error if the student doesn't exist", async () => {
    const mockReq = {
      params: { student_id: "S001" },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    getStudentById.mockResolvedValue({ data: undefined });

    await controller.getStudentById(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
  });

  it("ERROR 500 | Should return error if an internal error occurred", async () => {
    const mockReq = {
      params: { student_id: "S001" },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    getStudentById.mockImplementation(async () => {
      throw new Error("Some error");
    });

    await controller.getStudentById(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
  });

  it("SUCCESS 200 | Should return the corresponding student", async () => {
    const mockReq = {
      params: { student_id: "S001" },
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    getStudentById.mockResolvedValue({
      data: new Student("S001"),
    });

    await controller.getStudentById(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      student: new Student("S001"),
    });
  });
});

describe("UNIT-CONTROLLER: getStudentCareer", () => {
  it("ERROR 404 | Student not found", async () => {
    const mockReq = {
      user: {id: "T001"},
      params: {student_id: "S001"}
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    getStudentById.mockResolvedValue({data: null});

    await controller.getStudentCareer(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({error: "Student not found"});
  });

  it("ERROR 403 | Teacher not authorized to see student's career", async () => {
    const mockReq = {
      user: {id: "T001"},
      params: {student_id: "S001"}
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    getStudentById.mockResolvedValue({data: new Student("S001")});
    hasStudentAppliedForTeacher.mockResolvedValue(false);

    await controller.getStudentCareer(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({error: "Teacher not authorized to see student's career"});
  });

  it("ERROR 500 | An internal error occurred", async () => {
    const mockReq = {
      user: {id: "T001"},
      params: {student_id: "S001"}
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    getStudentById.mockImplementation(async () => {
      throw new Error("Some error");
    });

    await controller.getStudentCareer(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
  });

  it("SUCCESS 200 | Should return the corresponding student's career", async () => {
    const mockReq = {
      user: {id: "T001"},
      params: {student_id: "S001"}
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    getStudentById.mockResolvedValue({data: new Student("S001")});
    hasStudentAppliedForTeacher.mockResolvedValue(true);
    getStudentCareer.mockResolvedValue({data: "Computer Science"});

    await controller.getStudentCareer(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({career: "Computer Science"});
  });
});