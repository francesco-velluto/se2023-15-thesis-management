const { PostgreSqlContainer } = require("@testcontainers/postgresql");
const { Client } = require("pg");
const request = require("supertest");
const app = require("../app");
const db = require("../service/db");
const {
  createProposalsTableQuery,
  createStudentTableQuery,
  createTeacherTableQuery,
  populateStudentTableQuery,
  populateTeacherTableQuery,
  populateProposalsTableQuery,
} = require("./testDB/testDBQueries");

jest.mock("../service/db");

let container;
let mockDB;
let studentAuthCookies;
let teacherAuthCookies;

/*
 * Template for insert proposal request body,
 * if you need to change some field, just copy with spread operator:
 * const myReqBody = { ...mockProposalReq, title: "new title" };
 */
const mockProposalReq = {
  title: "test",
  supervisor_id: "T002",
  keywords: ["keyword1", "keyword2"],
  type: "Master",
  groups: ["Group A", "Group B"],
  description: "A master thesis just to test the insert API call",
  required_knowledge: "Node.js, PostgreSQL, React.js",
  notes: "These are the notes...",
  expiration_date: "2024-06-30",
  level: "Undergraduate",
  programmes: ["CD008"],
};

const setupConnection = async () => {
  // Setup docker container (docker should be running)
  container = await new PostgreSqlContainer().withExposedPorts(5432).start();

  // Setup connection to mock DB used for testing
  mockDB = new Client({
    connectionString: container.getConnectionUri(),
  });
  await mockDB.connect();

  // Mock db.query function to actually query the mock database
  db.query.mockImplementation((query, params) => mockDB.query(query, params));
};

const createTables = async () => {
  // Create needed tables
  await mockDB.query(createStudentTableQuery);
  await mockDB.query(createTeacherTableQuery);
  await mockDB.query(createProposalsTableQuery);
};

const populateTables = async () => {
  // Populate tables with some tuples
  await mockDB.query(populateStudentTableQuery);
  await mockDB.query(populateTeacherTableQuery);
  await mockDB.query(populateProposalsTableQuery);
};

const createStudentAuthCookies = async () => {
  const studentLoginResponse = await request(app)
    .post("/api/authentication/login")
    .send({ username: "john.smith@example.com", password: "S001" })
    .expect(200);

  // Extract authentication details from the login response, e.g., cookies or tokens
  studentAuthCookies = studentLoginResponse.headers["set-cookie"];
};

const createTeacherAuthCookies = async () => {
  const teacherLoginResponse = await request(app)
    .post("/api/authentication/login")
    .send({ username: "sarah.anderson@example.com", password: "T001" })
    .expect(200);

  // Extract authentication details from the login response, e.g., cookies or tokens
  teacherAuthCookies = teacherLoginResponse.headers["set-cookie"];
};

beforeAll(async () => {
  // Setup docker container and postgres client connection
  await setupConnection();

  // Create and populate the test DB with needed tables
  await createTables();
  await populateTables();

  // Obtain authentication cookies for both student and teacher,
  // to test authentication and authorization
  await createStudentAuthCookies();
  await createTeacherAuthCookies();
}, 10000);

afterAll(async () => {
  // Stop the container and close the connection with client after all tests are done
  if (container) {
    await mockDB.end();
    await container.stop();
  }
});

describe("Integration Tests", () => {
  test("T1.1 - ERROR 401 | Not authenticated", async () => {
    const res = await request(app).post("/api/proposals").send(mockProposalReq);

    expect(res.status).toBe(401);
  }, 10000);

  test("T1.2 - ERROR 401 | Not authorized", async () => {
    const res = await request(app)
      .post("/api/proposals")
      .set("Cookie", studentAuthCookies)
      .send(mockProposalReq);

    expect(res.status).toBe(401);
  }, 10000);

  test("T1.3 - SUCCESS 201 | Insert new proposal", async () => {
    const res = await request(app)
      .post("/api/proposals")
      .set("Cookie", teacherAuthCookies)
      .send(mockProposalReq);

    expect(res.status).toBe(201);
    expect(res.body.proposal.proposal_id).toEqual("P003");
    const check = await mockDB.query("SELECT * FROM proposals");
    expect(check.rowCount).toBe(3);
  }, 10000);
});
