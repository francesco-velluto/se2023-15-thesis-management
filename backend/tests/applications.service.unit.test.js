const applicationService = require("../service/applications.service");
const db = require("../service/db");
const Application = require("../model/Application");

jest.mock("../service/db", () => ({
  query: jest.fn(),
}));

beforeEach(() => {
  jest.resetAllMocks();
});

describe("UNIT-SERVICE: getAllApplicationsByStudentId", () => {
  it("should return all applications for a student by its id", async () => {
    db.query.mockResolvedValue({
      rows: [
        {
          proposal_id: "1",
          id: "s1",
          status: "Pending",
          application_date: "12-01-2023",
        },
        {
          proposal_id: "2",
          id: "s2",
          status: "Pending",
          application_date: "12-01-2023",
        },
        {
          proposal_id: "3",
          id: "s3",
          status: "Pending",
          application_date: "12-01-2023",
        },
      ],
    });

    const expectedApplications = [
      new Application("1", "s1", "Pending", "12-01-2023"),
      new Application("2", "s2", "Pending", "12-01-2023"),
      new Application("3", "s3", "Pending", "12-01-2023"),
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
      await applicationService.getAllApplicationsByStudentId("studentId");
    } catch (err) {
      expect(err.data).toEqual("Internal server error");
      expect(err.status).toBe(500);
    }
  });
});

describe("UNIT-SERVICE: getAllApplicationsByTeacherId", () => {
  it("should return all applications for thesis proposals supervised by a teacher", async () => {
    teacherId = "teacher";
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
    db.query.mockResolvedValue({ rows: [] });

    const res = await applicationService.getAllApplicationsByTeacherId(
      teacherId
    );

    expect(res.data).toEqual([]);
    expect(res.status).toBe(200);
    expect(db.query).toHaveBeenCalledTimes(1);
  });

  it("should handle internal server error", async () => {
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
      .mockImplementation(() => {});

    try {
      await applicationService.insertNewApplication(proposalId, studentId);
    } catch (err) {
      expect(err).toBe(mockError);
    }
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[BACKEND-SERVER] Error in insertNewApplication service:",
      mockError
    );
    consoleErrorSpy.mockRestore();
  });
});

describe.only("UNIT-SERVICE: setApplicationStatus", () => {
  it("should throw error if status field is invalid", async () => {
    try {
      await applicationService.setApplicationStatus("sdf", "T001", "A001");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual("Invalid status value.");
    }
  });

  it("should throw error if application doesn't exist", async () => {
    db.query.mockResolvedValue({ rows: [] });

    try {
      await applicationService.setApplicationStatus("Accepted", "T001", "A001");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual(
        "This application doesn't exist or doesn't belong to the teacher"
      );
    }
  });

  it("should throw error if application doesn't exist when trying to update the status", async () => {
    db.query.mockResolvedValueOnce({ rows: [{ application_id: "A001" }] });
    db.query.mockResolvedValueOnce({ rows: [] });

    try {
      await applicationService.setApplicationStatus("Accepted", "T001", "A001");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual(
        "No application found with application_id: A001"
      );
    }
  });

  it("should throw error if application doesn't exist when trying to update the status", async () => {
    const mockApplication = new Application(
      "P001",
      "A001",
      "Accepted",
      "2023-11-23"
    );

    db.query.mockResolvedValueOnce({ rows: [{ application_id: "A001" }] });
    db.query.mockResolvedValueOnce({ rows: [mockApplication] });

    const res = await applicationService.setApplicationStatus(
      "Accepted",
      "T001",
      "A001"
    );

    expect(res).toEqual(mockApplication);
  });
});

describe("UNIT-SERVICE: setApplicationsStatusCanceledByProposalId", () => {});

describe("UNIT-SERVICE: getApplicationById", () => {});
