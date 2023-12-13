const service = require("../../service/proposals.service");
const db = require("../../service/db");
const Proposal = require("../../model/Proposal");

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


describe("T1 - getAllProposals", () => {
  test("T1.1 SUCESS 200 | Get all proposals", (done) => {
    const mockDegreeCode = "CD008"
    const mockDbRows = [
      {
        proposal_id: "P012",
        title: "New Proposal",
        supervisor_id: "T001",
        keywords: ["Keyword1", "Keyword2"],
        type: "Experimental",
        groups: ["GroupA"],
        description: "Test description",
        required_knowledge: "Node.js, PostgreSQL",
        notes: "Test notes",
        expiration_date: "2024-12-31",
        level: "Master",
        programmes: ["Master of science"],
      },
      {
        proposal_id: "P004",
        title: "Intelligence Artificial",
        supervisor_surname: "Gomez",
        supervisor_name: "Ana",
        keywords: [
          "AI", "Machine Learning"
        ],
        type: "Experimental",
        groups: [
          "Group A"
        ],
        description: "An AI research thesis description",
        required_knowledge: "Python, TensoFlow",
        notes: "N/A",
        expiration_date: "2024-05-14T22:00:00.000Z",
        level: "Master",
        degrees: [
          "Master of Science"
        ]
      }
    ];

    db.query.mockResolvedValue({
      rows: mockDbRows,
    });

    service.getAllProposals(mockDegreeCode)
      .then((result) => {
        expect(result.status).toBe(200);
        expect(result.data).toEqual(mockDbRows);
        expect(db.query).toHaveBeenCalled();
        done();
      })
      .catch((err) => done(err));
  });

  test("T1.2 ERROR 404 | No proposals found", (done) => {

    db.query.mockResolvedValue([]);

    service.getAllProposals("CD008")
      .catch((error) => {
        expect(error.status).toBe(404);
        expect(error.data).toBe("proposals not found");
        expect(db.query).toHaveBeenCalled();
        done()
      });
  });

  test("T1.3 ERROR 500 | Internal server error - database", (done) => {

    db.query.mockRejectedValue(new Error("Database error"));

    service.getAllProposals("CD008")
      .catch((error) => {
        expect(error.status).toBe(500);
        expect(error.data).toBe("Internal server error");
        expect(db.query).toHaveBeenCalled();
        done();
      });
  });

});

describe("T2 - insertProposal", () => {

  test("T2.1 SUCCESS | Insert new proposal", (done) => {
    const mockProposal = {
      proposal_id: "P012",
      title: "New Proposal",
      supervisor_id: "T001",
      keywords: ["Keyword1", "Keyword2"],
      type: "Experimental",
      groups: ["GroupA"],
      description: "Test description",
      required_knowledge: "Node.js, PostgreSQL",
      notes: "Test notes",
      expiration_date: "2024-12-31",
      level: "Master",
      programmes: ["Master of science"],
    };

    const newProposal = new Proposal(
      mockProposal.proposal_id,
      mockProposal.title,
      mockProposal.supervisor_id,
      mockProposal.keywords,
      mockProposal.type,
      mockProposal.groups,
      mockProposal.description,
      mockProposal.required_knowledge,
      mockProposal.notes,
      mockProposal.expiration_date,
      mockProposal.level,
      mockProposal.programmes
    );


    db.query.mockResolvedValue({ rows: [mockProposal] });

    service.insertProposal(mockProposal)
      .then((result) => {
        expect(result).toEqual(newProposal);
        expect(db.query).toHaveBeenCalledWith(
          expect.any(String),
          expect.arrayContaining([
            mockProposal.proposal_id,
            mockProposal.title,
            mockProposal.supervisor_id,
            expect.arrayContaining(mockProposal.keywords),
            mockProposal.type,
            expect.arrayContaining(mockProposal.groups),
            mockProposal.description,
            mockProposal.required_knowledge,
            mockProposal.notes,
            mockProposal.expiration_date,
            mockProposal.level,
            expect.arrayContaining(mockProposal.programmes),
            false,
          ])
        );
        done();
      })
      .catch((error) => done(error));
  });

  test("T2.2 ERROR | Throw Error", (done) => {
    const mockProposal = new Proposal(
      "P012",
      "New Proposal",
      "T001",
      ["Keyword1", "Keyword2"],
      "Experimental",
      ["GroupA"],
      "Test description",
      "Node.js, PostgreSQL",
      "Test notes",
      "2024-12-31",
      "Master",
      ["Master of Science"]
    );

    db.query.mockRejectedValueOnce(new Error("Database error"));

    service.insertProposal(mockProposal)
      .catch((error) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe("Database error");
        expect(db.query).toHaveBeenCalled();
        done();
      });
  });
});

describe("T3 - getMaxProposalIdNumber", () => {
  test("T3.1 - Successfull case", (done) => {

    db.query.mockResolvedValue({ rows: [{ max: "P005" }], });

    service.getMaxProposalIdNumber()
      .then((result) => {
        expect(result).toBe(5);
        expect(db.query).toHaveBeenCalled();
        done();
      })
      .catch((error) => done(error));

  });

  test("T3.2 NULL | No proposals ", (done) => {
    db.query.mockResolvedValue({
      rows: [{ max: null }],
    });

    service.getMaxProposalIdNumber()
      .then((result) => {
        expect(result).toBe(0);
        expect(db.query).toHaveBeenCalled();
        done();
      });

  });

  test("T3.3 ERROR | Throw Error ", (done) => {
    db.query.mockRejectedValueOnce(new Error("Database error"));

    service.getMaxProposalIdNumber()
      .catch((error) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe("Database error");
        expect(db.query).toHaveBeenCalled();
        done();
      });
  });

});

describe("T4 - getAllProfessorProposals", () => {
  test("T4.1 SUCCESS 200 | Get all professor proposals", (done) => {
    const mockDbRows = [
      {
        proposal_id: "P012",
        title: "New Proposal",
        supervisor_id: "T001",
        keywords: ["Keyword1", "Keyword2"],
        type: "Experimental",
        groups: ["GroupA"],
        description: "Test description",
        required_knowledge: "Node.js, PostgreSQL",
        notes: "Test notes",
        expiration_date: "2024-12-31",
        level: "Master",
        programmes: ["Master of science"],
      },
    ];

    db.query.mockResolvedValue({
      rows: mockDbRows,
    });

    service.getAllProfessorProposals("T001")
      .then((result) => {
        expect(result.status).toBe(200);
        expect(result.data).toEqual(mockDbRows);
        expect(db.query).toHaveBeenCalledWith(expect.any(String), ["T001"]);
        done();
      })
      .catch((err) => done(err));
  });

  test("T4.2 ERROR 404 | No professor proposals found", (done) => {
    const mockProfessorId = "T002";

    db.query.mockResolvedValue([]);

    service.getAllProfessorProposals(mockProfessorId)
      .catch((error) => {
        expect(error.status).toBe(404);
        expect(error.data).toBe("proposals not found");
        expect(db.query).toHaveBeenCalledWith(expect.any(String), [mockProfessorId]);
        done();
      });
  });

  test("T4.3 ERROR 500 | Internal server error - database", (done) => {
    const mockProfessorId = "T003";

    db.query.mockRejectedValue(new Error("Database error"));

    service.getAllProfessorProposals(mockProfessorId)
      .catch((error) => {
        expect(error.status).toBe(500);
        expect(error.data).toBe("Internal server error");
        expect(db.query).toHaveBeenCalledWith(expect.any(String), [mockProfessorId]);
        done();
      });
  });
});

  describe("T5 - getProposalById", () => {
    // test("T5.1 SUCCESS 200 | Get proposal by ID", (done) => {

    // });

    test("T5.2 ERROR 404 | Proposal not found", (done) => {

      db.query.mockResolvedValue({
        rows: [],
      });

      service.getProposalById("P999")
        .catch((error) => {
          expect(error.status).toBe(404);
          expect(error.data).toBe("The proposal has not been found!");
          expect(db.query).toHaveBeenCalledWith(expect.any(String), ["P999"]);
          done();
        });
    });

    test("T5.3 ERROR 500 | Internal server error - database", (done) => {
      const mockProposalId = "P003";

      db.query.mockRejectedValue(new Error("Database error"));

      service.getProposalById("P999")
        .catch((error) => {
          expect(error.status).toBe(500);
          expect(error.data).toBe("Internal Server Error");
          expect(db.query).toHaveBeenCalledWith(expect.any(String), ["P999"]);
          done();
        });
    });
  });

  describe("T6 - setProposalArchived", () => {
    test("T6.1 SUCCESS | Set proposal as archived", (done) => {
      const mockProposalId = "P012";

    const mockDbRows = [
      {
        proposal_id: mockProposalId,
        title: "New Proposal",
        supervisor_id: "T001",
        keywords: ["Keyword1", "Keyword2"],
        type: "Experimental",
        groups: ["GroupA"],
        description: "Test description",
        required_knowledge: "Node.js, PostgreSQL",
        notes: "Test notes",
        expiration_date: "2024-12-31",
        level: "Master",
        programmes: [{ title_degree: "Master of Science" }],
        supervisor_name: "John",
        supervisor_surname: "Doe",
        archived: true,
      },
    ];

      const expectedProposal = new Proposal(
        mockDbRows[0].proposal_id,
        mockDbRows[0].title,
        mockDbRows[0].supervisor_id,
        mockDbRows[0].keywords,
        mockDbRows[0].type,
        mockDbRows[0].groups,
        mockDbRows[0].description,
        mockDbRows[0].required_knowledge,
        mockDbRows[0].notes,
        mockDbRows[0].expiration_date,
        mockDbRows[0].level,
        mockDbRows[0].programmes,
        true
      );

      db.query.mockResolvedValue({
        rows: mockDbRows,
      });

      service.setProposalArchived(mockProposalId)
        .then((result) => {
          expect(result.data).toBeDefined();
          expect(result.data).toEqual(expectedProposal);
          expect(db.query).toHaveBeenCalledWith(expect.any(String), [mockProposalId]);
          done();
        })
        .catch((err) => done(err));
    });

    test("T6.2 Return undefined - rowCount: 0", (done) => {
      const mockProposalId = "P012";
      const mockDbRows = [
        {
          proposal_id: mockProposalId,
          archived: true,
        },
      ];

      db.query.mockResolvedValue({
        rows: mockDbRows,
        rowCount: 0,
      });

      service.setProposalArchived(mockProposalId)
        .then((result) => {
          expect(result.data).toBeUndefined();
          expect(db.query).toHaveBeenCalledWith(expect.any(String), [mockProposalId]);
          done();
        })
        .catch((err) => done(err));
    });

    test("T6.3 - Error ", (done) => {
      const mockProposalId = "P012";

      db.query.mockRejectedValue(new Error("Database error"));

      service.setProposalArchived(mockProposalId)
        .catch((error) => {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("Database error");
            expect(db.query).toHaveBeenCalled();
            done();
        });
    });

});

describe("T7 - deleteProposal", () => {
  test("T7.1 SUCCESS - Proposal deleted", (done) => {

    const mockDbRows = [
      {
        proposal_id: "P012",
        title: "New Proposal",
        supervisor_id: "T001",
        keywords: ["Keyword1", "Keyword2"],
        type: "Experimental",
        groups: ["GroupA"],
        description: "Test description",
        required_knowledge: "Node.js, PostgreSQL",
        notes: "Test notes",
        expiration_date: "2024-12-31",
        level: "Master",
        programmes: ["MS001"],
        deleted: true,
      },
    ];

    db.query.mockResolvedValue({
      rows: mockDbRows,
    });

    service.deleteProposal("P012")
      .then((result) => {
        expect(result.data).toEqual(mockDbRows[0]);
        expect(db.query).toHaveBeenCalledWith(expect.any(String), ["P012"]);
        done();
      })
      .catch((err) => done(err));

  });
  test("T7.2 ERROR ", (done) => {

    const mockProposalId = "P012";

      db.query.mockRejectedValue(new Error("Database error"));

      service.deleteProposal(mockProposalId)
        .catch((error) => {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("Database error");
            expect(db.query).toHaveBeenCalled();
            done();
        });

  });

  test("T7.3 Return undefined - rowCount: 0", (done) => {
    const mockProposalId = "P012";
    db.query.mockResolvedValue({
      rows: [],
      rowCount: 0,
    });

    service.deleteProposal(mockProposalId)
      .then((result) => {
        expect(result.data).toBeUndefined();
        expect(db.query).toHaveBeenCalledWith(expect.any(String), [mockProposalId]);
        done();
      })
      .catch((err) => done(err));
  });

});

describe("T8 - updateProposal", () => {
  test("T8.1 SUCCESS | Update proposal", (done) => {
    const mockProposal = {
      proposal_id: "P001",
      title: "Update Proposal",
      supervisor_id: "T001",
      keywords: ["Keyword1", "Keyword2"],
      type: "Experimental",
      groups: ["GroupA"],
      description: "Test description",
      required_knowledge: "Node.js, PostgreSQL",
      notes: "Test notes",
      expiration_date: "2024-11-31",
      level: "Master",
      programmes: ["Master of Science"],
    };

    const updateProposalObj = {
      data: new Proposal(
        mockProposal.proposal_id,
        mockProposal.title,
        mockProposal.supervisor_id,
        mockProposal.keywords,
        mockProposal.type,
        mockProposal.groups,
        mockProposal.description,
        mockProposal.required_knowledge,
        mockProposal.notes,
        mockProposal.expiration_date,
        mockProposal.level,
        mockProposal.programmes
      )
    };

    db.query.mockResolvedValue({ rows: [mockProposal] });

    service.updateProposal(mockProposal)
      .then((result) => {
        expect(result).toEqual(updateProposalObj);
        expect(db.query).toHaveBeenCalledWith(
          expect.any(String),
          expect.arrayContaining([
            mockProposal.title,
            mockProposal.level,
            expect.arrayContaining(mockProposal.keywords),
            mockProposal.type,
            mockProposal.description,
            mockProposal.required_knowledge,
            mockProposal.notes,
            mockProposal.expiration_date,
            expect.arrayContaining(mockProposal.programmes),
            mockProposal.proposal_id,
          ])
        );
        done();
      })
      .catch((error) => done(error));
  });

  test("T8.2 ERROR   | Throw Error - Database Error", (done) => {
    const message = "Database error";
    const mockProposal = {
      proposal_id: "P001",
      title: "Update Proposal",
      supervisor_id: "T001",
      keywords: ["Keyword1", "Keyword2"],
      type: "Experimental",
      groups: ["GroupA"],
      description: "Test description",
      required_knowledge: "Node.js, PostgreSQL",
      notes: "Test notes",
      expiration_date: "2024-11-31",
      level: "Master",
      programmes: ["Master of Science"],
    };

    db.query.mockRejectedValueOnce(new Error(message));

    service.updateProposal(mockProposal)
      .catch((error) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(message);
        expect(db.query).toHaveBeenCalled();
        done();
      });
  });

  test("T8.3 ERROR   | Throw Error - Input Undefined", (done) => {
    const message = "Cannot read properties of undefined (reading 'title')";

    db.query.mockRejectedValueOnce(new Error(message));

    service.updateProposal(undefined)
      .catch((error) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(message);
        expect(db.query).not.toHaveBeenCalled();
        done();
      });
  });
});