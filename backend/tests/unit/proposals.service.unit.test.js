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
    const mockDegreeCode="CD008"
    const mockDbRows = [
        {
            proposal_id: "P003",
            title: "Artificial Intelligence",
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
      }, 10000 );
      
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
