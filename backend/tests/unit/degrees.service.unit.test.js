const service = require("../../service/degrees.service");
const db = require("../../service/db");
const Degree = require("../../model/Degree");

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

describe("T1 - getDegrees", () => {
  const mockDegrees = [
    new Degree('BSC001', 'Bachelor of Science'),
    new Degree('BSC002', 'Bachelor of Arts'),
    new Degree('MSC001', 'Master of Science'),
  ];

  test("T1.1 SUCCESS | Get degrees", (done) => {
    db.query.mockResolvedValue({ rows: mockDegrees, rowCount: 3 });

    service.getDegrees()
      .then((result) => {
        expect(result).toEqual(mockDegrees);
        expect(db.query).toHaveBeenCalledWith(
          expect.any(String)
        );
        done();
      })
      .catch((error) => done(error));
  });

  test("T1.2 SUCCESS | There are not degrees", (done) => {
    db.query.mockResolvedValue({ rows: [], rowCount: 0 });

    service.getDegrees()
      .then((result) => {
        expect(result).toEqual([]);
        expect(db.query).toHaveBeenCalledWith(
          expect.any(String)
        );
        done();
      })
      .catch((error) => done(error));
  });

  test("T1.3 ERROR   | Throw an Error", (done) => {
    const message = new Error("Database error");
    db.query.mockRejectedValue(message);

    service.getDegrees()
      .catch((error) => {
        expect(error).toEqual(message);
        expect(db.query).toHaveBeenCalled();
        done();
      });
  });
});

