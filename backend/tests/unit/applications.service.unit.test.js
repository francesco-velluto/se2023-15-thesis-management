const applicationService = require("../../service/applications.service");
const db = require("../../service/db");
const Application = require("../../model/Application");
const Proposal = require("../../model/Proposal");
const virtualClockService = require("../../service/virtualclock.service");

jest.mock("../../service/db", () => ({
  query: jest.fn(),
}));
jest.mock("../../service/virtualclock.service");

beforeEach(() => {
  jest.resetAllMocks();
  // comment these lines if you want to see console prints during tests
  jest.spyOn(console, "log").mockImplementation(() => { });
  jest.spyOn(console, "info").mockImplementation(() => { });
  jest.spyOn(console, "error").mockImplementation(() => { });
});

describe("UNIT-SERVICE: getAllApplicationsByStudentId", () => {
  it("should return all applications for a student by its id", async () => {
    db.query.mockResolvedValue({
      rows: [
        {
          id: "A001",
          proposal_id: "1",
          student_id: "s1",
          status: "Pending",
          application_date: "12-01-2023",
        },
        {
          id: "A002",
          proposal_id: "2",
          student_id: "s2",
          status: "Pending",
          application_date: "12-01-2023",
        },
        {
          id: "A003",
          proposal_id: "3",
          student_id: "s3",
          status: "Pending",
          application_date: "12-01-2023",
        },
      ],
    });

    const expectedApplications = [
      new Application("A001", "1", "s1", "Pending", "12-01-2023"),
      new Application("A002", "2", "s2", "Pending", "12-01-2023"),
      new Application("A003", "3", "s3", "Pending", "12-01-2023"),
    ];
    const res = await applicationService.getAllApplicationsByStudentId(
      "studentId"
    );

    expect(res.data).toEqual(expectedApplications);
    expect(res.status).toBe(200);
    expect(db.query).toHaveBeenCalledTimes(2);
  });

  it("should handle error", async () => {
    db.query.mockRejectedValue();
    try {
      await applicationService.getAllApplicationsByStudentId("S001");
    } catch (err) {
      expect(err.data).toEqual("Internal server error");
      expect(err.status).toBe(500);
    }
  });

  it("error if student not found", async () => {
    db.query.mockResolvedValue({
      rows: [],
      rowCount: 0,

    });
    try {
      await applicationService.getAllApplicationsByStudentId("S001");
    } catch (err) {
      expect(err.status).toBe(404);
      expect(err.data).toEqual('Student not found');
      expect(db.query).toHaveBeenCalled();
    }
  });
});

describe("UNIT-SERVICE: getAllApplicationsByTeacherId", () => {
  it("should return all applications for thesis proposals supervised by a teacher", async () => {
    const teacherId = "teacher";
    db.query.mockResolvedValue({
      rows: [
        {
          proposal_id: "P015",
          title: "Mobile App Development",
          type: "Research",
          description: "A mobile app development project description.",
          expiration_date: "2024-02-19",
          level: "Bachelor",
          application_id: 11,
          application_status: "Pending",
          application_date: "2023-11-21T23:00:00.000Z",
          student_id: "S001",
          surname: "Smith",
          name: "John",
          email: "john.smith@example.com",
          enrollment_year: 2021,
          cod_degree: "BSC001",
        },
        {
          proposal_id: "P015",
          title: "Mobile App Development",
          type: "Research",
          description: "A mobile app development project description.",
          expiration_date: "2024-02-19",
          level: "Bachelor",
          application_id: 13,
          application_status: "Pending",
          application_date: "2023-11-21T23:00:00.000Z",
          student_id: "S002",
          surname: "Johnson",
          name: "Emily",
          email: "emily.johnson@example.com",
          enrollment_year: 2022,
          cod_degree: "BSC001",
        },
      ],
    });

    const expectedApplications = [
      {
        proposal_id: "P015",
        title: "Mobile App Development",
        type: "Research",
        description: "A mobile app development project description.",
        expiration_date: "2024-02-19",
        level: "Bachelor",
        applications: [
          {
            application_id: 11,
            status: "Pending",
            application_date: "2023-11-21T23:00:00.000Z",
            student_id: "S001",
            surname: "Smith",
            name: "John",
            email: "john.smith@example.com",
            enrollment_year: 2021,
            cod_degree: "BSC001",
          },
          {
            application_id: 13,
            status: "Pending",
            application_date: "2023-11-21T23:00:00.000Z",
            student_id: "S002",
            surname: "Johnson",
            name: "Emily",
            email: "emily.johnson@example.com",
            enrollment_year: 2022,
            cod_degree: "BSC001",
          },
        ],
      },
    ];

    const res = await applicationService.getAllApplicationsByTeacherId(
      teacherId
    );

    expect(res.status).toBe(200);
    expect(res.data).toEqual(expectedApplications);
    expect(db.query).toHaveBeenCalledTimes(1);
  });

  it("should handle no applications found", async () => {
    db.query.mockResolvedValue({
      rows: [],
      rowCount: 0,
    });

    applicationService.getAllApplicationsByTeacherId('T001')
      .then((result) => {
        expect(result.status).toBe(200);
        expect(result.data).toEqual([]);
        expect(db.query).toHaveBeenCalledTimes(1);
      })

  });

  it("should handle internal server error", async () => {
    const teacherId = "teacher";

    db.query.mockRejectedValue(new Error("Database error"));

    await expect(
      applicationService.getAllApplicationsByTeacherId(teacherId)
    ).rejects.toEqual({
      status: 500,
      data: "Internal server error",
    });

    expect(db.query).toHaveBeenCalledTimes(1);
  });
});

describe("UNIT-SERVICE: insertNewApplication", () => {
  it("should insert a new application", async () => {
    const proposalId = 1;
    const studentId = "s1";

    db.query
      .mockResolvedValueOnce({ rows: [{ id: studentId }] })
      .mockResolvedValueOnce({ rows: [{ proposal_id: proposalId }] });

    db.query.mockResolvedValueOnce({ rows: [] });

    db.query.mockResolvedValueOnce({
      rows: [
        {
          proposal_id: proposalId,
          id: studentId,
          status: "Pending",
          application_date: "2023-01-01",
        },
      ],
    });

    virtualClockService.getVirtualDate.mockResolvedValue("2023-01-01");

    const res = await applicationService.insertNewApplication(
      proposalId,
      studentId
    );

    expect(res.rows).toHaveLength(1);
    expect(res.rows[0].proposal_id).toEqual(proposalId);
    expect(res.rows[0].id).toEqual(studentId);
    expect(res.rows[0].status).toEqual("Pending");
    expect(res.rows[0].application_date).toBeDefined();
    expect(db.query).toHaveBeenCalledTimes(4);
  });

  it("should handle error", async () => {
    const proposalId = 1;
    const studentId = "s1";
    const mockError = new Error("Error during insert");
    db.query.mockRejectedValueOnce(mockError);

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => { });

    try {
      await applicationService.insertNewApplication(proposalId, studentId);
    } catch (err) {
      expect(err).toBe("Error during insert");
    }
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[BACKEND-SERVER] Error in insertNewApplication service:",
      mockError
    );
    consoleErrorSpy.mockRestore();
  });

  it("should handle error when the student or the proposal is not found", async () => {
    const proposal_id = 1;
    const student_id = "s1";
    const message = `Student with id ${student_id} not found or Proposal with id ${proposal_id} not found.`;

    db.query.mockResolvedValueOnce({ rows: [] });
    db.query.mockResolvedValueOnce({ rows: [] });
    db.query.mockResolvedValueOnce({ rows: [] });

    try {
      await applicationService.insertNewApplication(proposal_id, student_id);
    } catch (error) {
      expect(error).toBe(message);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM student WHERE id = $1', [student_id]);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM proposals WHERE proposal_id = $1', [proposal_id]);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM applications WHERE student_id = $1 AND status NOT IN ($2, $3)', [student_id, "Rejected", "Canceled"]);
    }
  });

  it("should handle error when the student has already pending or accepted applications", async () => {
    const proposal_id = 1;
    const student_id = "s1";
    const message = `Student with id ${student_id} currently already has pending or accepted applications.`;

    db.query.mockResolvedValueOnce({ rows: ["student"] });
    db.query.mockResolvedValueOnce({ rows: ["proposal"] });
    db.query.mockResolvedValueOnce({ rows: ["application"] });

    try {
      await applicationService.insertNewApplication(proposal_id, student_id);
    } catch (error) {
      expect(error).toBe(message);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM student WHERE id = $1', [student_id]);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM proposals WHERE proposal_id = $1', [proposal_id]);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM applications WHERE student_id = $1 AND status NOT IN ($2, $3)', [student_id, "Rejected", "Canceled"]);
    }
  });
});

describe("UNIT-SERVICE: setApplicationStatus", () => {
  it("should return undefined data if the application doesn't exist", async () => {
    db.query.mockResolvedValue({ rowCount: 0 });

    const res = await applicationService.setApplicationStatus(
      "A001",
      "Accepted"
    );
    expect(res.data).toBeUndefined();
  });

  it("should throw error if a generic error occurs on the database", async () => {
    db.query.mockImplementation(async () => {
      throw new Error("Internal error");
    });

    expect(
      applicationService.setApplicationStatus("Accepted", "T001", "A001")
    ).rejects.toThrow("Internal error");
  });

  it("should set the new application status successfully", async () => {
    const mockApplication = new Application(
      "A001",
      "P001",
      "S001",
      "Accepted",
      "2023-11-23"
    );

    db.query.mockResolvedValueOnce({ rows: [mockApplication], rowCount: 1 });

    const res = await applicationService.setApplicationStatus(
      "A001",
      "Accepted"
    );

    expect(res).toEqual({ data: mockApplication });
  });
});

describe("UNIT-SERVICE: cancelPendingApplicationsByProposalId", () => {
  it("should throw error if a generic error occurs on the database", async () => {
    db.query.mockImplementation(async () => {
      throw new Error("Internal error");
    });

    expect(
      applicationService.cancelPendingApplicationsByProposalId("P001")
    ).rejects.toThrow("Internal error");
  });

  it("should return the number of canceled applications", async () => {
    db.query.mockResolvedValueOnce({ rowCount: 4 });

    const res = await applicationService.cancelPendingApplicationsByProposalId(
      "P001"
    );

    expect(res).toEqual({ data: 4 });
  });
});

describe("UNIT-SERVICE: getApplicationById", () => {
  it("should return undefined data field if application doesn't exist", async () => {
    db.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });

    const res = await applicationService.getApplicationById("A001");
    expect(res.data).toBeUndefined();
  });

  it("should return the application", async () => {
    const mockProposal = new Proposal("P001");

    const queryResult = {
      id: "A001",
      student_id: "S001",
      status: "Pending",
      application_date: "2023-11-23",
      ...mockProposal,
    };

    const expectedResult = {
      id: "A001",
      student_id: "S001",
      status: "Pending",
      application_date: "2023-11-23",
      proposal: mockProposal,
    };

    db.query.mockResolvedValueOnce({
      rows: [queryResult],
      rowCount: 1,
    });

    const res = await applicationService.getApplicationById("A001");

    expect(res).toEqual({
      data: expectedResult,
    });
  });

  it("should throw error if a generic error occurs on the database", async () => {
    db.query.mockImplementation(async () => {
      throw new Error("Internal error");
    });

    expect(applicationService.getApplicationById("A001")).rejects.toThrow(
      "Internal error"
    );
  });
});


describe("UNIT-SERVICE: getAllPendingApplicationsByProposalId", () => {
  it("should get all applications for a given proposal whose status is Pending", async () => {

    const queryResult = {
      id: "A001",
      student_id: "S001",
      status: "Pending",
      application_date: "2023-11-23",
      proposal_id: 'P001'
    };

    db.query.mockResolvedValueOnce({
      rows: [queryResult]
    });

    const res = await applicationService.getAllPendingApplicationsByProposalId('P001');

    expect(res.data).toEqual([queryResult]);
  });

  it("should throw error if a generic error occurs on the database", async () => {
    db.query.mockImplementation(async () => {
      throw new Error("Internal error");
    });

    expect(applicationService.getAllPendingApplicationsByProposalId("P001")).rejects.toThrow(
      "Internal error"
    );
  });
});


describe("UNIT-SERVICE: getAllApplicationsByProposalId", () => {
  it("should return undefined data field if application doesn't exist", async () => {
    db.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });

    const res = await applicationService.getAllApplicationsByProposalId("A001");
    expect(res.data).toBeUndefined();
  });

  it("should return all the applications related to a proposal", async () => {

    const queryResult = {
      id: "A001",
      student_id: "S001",
      status: "Pending",
      application_date: "2023-11-23",
      proposal_id: "P001"
    };

    db.query.mockResolvedValueOnce({
      rows: [queryResult],
      rowCount: 1,
    });

    const res = await applicationService.getAllApplicationsByProposalId("P001");

    expect(res.data[0]).toEqual(queryResult);
    expect(db.query).toHaveBeenCalled();
  });

  it("should throw error if a generic error occurs on the database", async () => {
    db.query.mockImplementation(async () => {
      throw new Error("Internal error");
    });

    expect(applicationService.getAllApplicationsByProposalId("P001")).rejects.toThrow(
      "Internal error"
    );
  });
});
