const service = require("../../service/virtualclock.service");
const db = require("../../service/db");
const dayjs = require("dayjs");

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

describe("T1 - getVirtualDate", () => {
  const formatString = "YYYY-MM-DD";

  test("T1.1 SUCCESS | Get Virtual Date ", (done) => {
    const mockVirtualDate = { prop_value: '2024-01-02' };
    const mockRes = { data: dayjs(mockVirtualDate.prop_value).format(formatString) };
    db.query.mockResolvedValue({ rows: [mockVirtualDate] });

    service.getVirtualDate()
      .then((result) => {
        expect(result).toEqual(mockRes);
        expect(db.query).toHaveBeenCalledWith(
          expect.any(String)
        );
        done();
      })
      .catch((error) => done(error));
  });

  test("T1.2 SUCCESS | Get the date with a different format string ", (done) => {
    const mockVirtualDate = { prop_value: '02-01-2024' };
    const mockRes = { data: dayjs(mockVirtualDate.prop_value).format(formatString) };

    db.query.mockResolvedValue({ rows: [mockVirtualDate] });

    service.getVirtualDate()
      .then((result) => {
        expect(result).toEqual(mockRes);
        expect(db.query).toHaveBeenCalled();
        done();
      })
      .catch((error) => done(error));
  });

  test("T1.3 ERROR   | Throw an Error", (done) => {
    const message = new Error("Database error");
    db.query.mockRejectedValue(message);

    service.getVirtualDate()
      .catch((error) => {
        expect(error).toEqual(message);
        expect(db.query).toHaveBeenCalled();
        done();
      });
  });
});

describe("T2 - updateVirtualDate", () => {
  const formatString = "YYYY-MM-DD";

  test("T2.1 SUCCESS | Update virtual date", (done) => {
    const mockDate = { prop_value: '2024-01-02' };
    const mockRes = dayjs(mockDate.prop_value).format(formatString);
    db.query.mockResolvedValue({ rows: [mockDate], rowCount: 1 });

    service.updateVirtualDate(mockDate.prop_value)
      .then((result) => {
        expect(result).toEqual({ data: mockRes });
        expect(db.query).toHaveBeenCalledWith(
          expect.any(String),
          expect.arrayContaining([mockRes])
        );
        done();
      })
      .catch((error) => done(error));
  });

  test("T2.2 ERROR   | No date found", (done) => {
    const mockDate = "2024-02-01";
    db.query.mockResolvedValue({ rows: [], rowCount: 0 });

    service.updateVirtualDate(mockDate)
      .catch((error) => {
        expect(error).toEqual(new Error("New virtual date can't be before the current one!"));
        expect(db.query).toHaveBeenCalledWith(
          expect.any(String),
          expect.arrayContaining([mockDate])
        );
        done();
      })
  });

  test("T2.3 ERROR   | Throw an Error", (done) => {
    const mockDate = "2024-02-01";
    const message = new Error("Database error");
    db.query.mockRejectedValue(message);

    service.updateVirtualDate(mockDate)
      .catch((error) => {
        expect(error).toEqual(message);
        expect(db.query).toHaveBeenCalledWith(
          expect.any(String),
          expect.arrayContaining([mockDate])
        );
        done();
      });
  });

  test("T2.4 ERROR   | The date is undefined", (done) => {
    const message = new Error("The date cannot be undefined");
    db.query.mockRejectedValue(message);

    service.updateVirtualDate(undefined)
      .catch((error) => {
        expect(error).toEqual(message);
        expect(db.query).toHaveBeenCalled();
        done();
      });
  });
});

