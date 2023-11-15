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

const { Builder, By, until } = require("selenium-webdriver");

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

const restoreProposalsTable = async () => {
  await mockDB.query("DELETE FROM proposals");
  await mockDB.query(populateProposalsTableQuery);
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

describe("End to end tests for Search proposals", () => {
  let driver;
  let baseURL = `http://localhost:${process.env.FRONTEND_PORT}`;

  const doLogin = async () => {
    await driver.get(baseURL + "/login");

    // perform login
    const usernameBox = await driver.findElement(By.id("username"));
    usernameBox.clear();
    usernameBox.sendKeys("john.smith@example.com");
    const passwordBox = await driver.findElement(By.id("password"));
    passwordBox.clear();
    passwordBox.sendKeys("S001");

    await driver.sleep(1000);

    const submitButton = await driver.findElement(By.tagName("button"));

    // remove disabled property from button
    await driver.executeScript(
      "arguments[0].removeAttribute('disabled')",
      submitButton
    );

    // click submit button with js
    await submitButton.click();

    await driver.sleep(1000);
  };

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build();
    await restoreProposalsTable(); // should be already restored but to be sure...
  });

  afterAll(async () => {
    await driver.quit();
  });

  test("Should show not authorized page if not logged in yet", async () => {
    await driver.get(baseURL + "/proposals");

    await driver.sleep(1000);

    let pageTitle = await driver
      .findElement(By.className("alert-danger"))
      .getText();
    expect(pageTitle).toEqual("Access Not Authorized");
  });

  test("Should show proposals list", async () => {
    await doLogin();

    await driver.get(baseURL + "/proposals");

    await driver.sleep(1000);
    await driver.findElement(By.className("border-dark"));
  });

  test("Should show proposals list filtered by title", async () => {
    await doLogin();

    await driver.get(baseURL + "/proposals");

    await driver.sleep(1000);

    let select = await driver.findElement(By.className("form-select"));

    // select title
    await driver.executeScript("arguments[0].value = 'title';", select);

    let typeField = await driver.findElement(By.id("inputValue"));
    await typeField.clear();
    await typeField.sendKeys("Web Development");

    await driver.sleep(1000);

    let srcButton = driver.findElement(By.className("btn-outline-secondary"));
    await srcButton.click();

    await driver.sleep(1000);

    await driver.findElement(By.className("border-dark"));
  }, 10000);
});

describe("End to end tests for Proposal details", () => {
  let driver;
  let baseURL = `http://localhost:${process.env.FRONTEND_PORT}`;

  const doLogin = async () => {
    await driver.get(baseURL + "/login");

    // perform login
    const usernameBox = await driver.findElement(By.id("username"));
    usernameBox.clear();
    usernameBox.sendKeys("sarah.anderson@example.com");
    const passwordBox = await driver.findElement(By.id("password"));
    passwordBox.clear();
    passwordBox.sendKeys("T001");

    await driver.sleep(1000);

    const submitButton = await driver.findElement(By.tagName("button"));

    // remove disabled property from button
    await driver.executeScript(
      "arguments[0].removeAttribute('disabled')",
      submitButton
    );

    // click submit button with js
    await submitButton.click();

    await driver.sleep(1000);
  };

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build();
    await restoreProposalsTable(); // should be already restored but to be sure...
  });

  afterAll(async () => {
    await driver.quit();
  });

  test("Should show not authorized page if not logged in yet", async () => {
    await driver.get(baseURL + "/proposals/P001");

    await driver.sleep(1000);

    let pageTitle = await driver
      .findElement(By.className("alert-danger"))
      .getText();
    expect(pageTitle).toEqual("Access Not Authorized");
  });

  test("Should show Proposal not found", async () => {
    await doLogin();

    await driver.get(baseURL + "/proposals/ABC0");

    await driver.sleep(1000);
    let pageTitle = await driver
      .findElement(By.className("alert-danger"))
      .getText();

    expect(pageTitle).toEqual("Proposal not found");
  });

  test("Should show Proposal details", async () => {
    await doLogin();

    await driver.get(baseURL + "/proposals/P001");

    await driver.sleep(1000);
    await driver.findElement(By.className("proposal-details-title"));
  });
});

describe("Integration Tests for Insert Proposal", () => {
  afterAll(async () => {
    await restoreProposalsTable();
  });

  test("T1.1 - ERROR 401 | Not authenticated", async () => {
    const res = await request(app).post("/api/proposals").send(mockProposalReq);

    expect(res.status).toBe(401);
  });

  test("T1.2 - ERROR 401 | Not authorized", async () => {
    const res = await request(app)
      .post("/api/proposals")
      .set("Cookie", studentAuthCookies)
      .send(mockProposalReq);

    expect(res.status).toBe(401);
  });

  test("T1.3 - SUCCESS 201 | Insert new proposal in empty table", async () => {
    // Remove every proposal from table
    await mockDB.query("DELETE FROM proposals");

    const res = await request(app)
      .post("/api/proposals")
      .set("Cookie", teacherAuthCookies)
      .send(mockProposalReq);

    expect(res.status).toBe(201);
    expect(res.body.proposal.proposal_id).toEqual("P001");
    const check = await mockDB.query("SELECT * FROM proposals");
    expect(check.rowCount).toBe(1);

    // Restore original content
    await mockDB.query("DELETE FROM proposals");
    await mockDB.query(populateProposalsTableQuery);
  });

  test("T1.4 - SUCCESS 201 | Insert new proposal", async () => {
    const res = await request(app)
      .post("/api/proposals")
      .set("Cookie", teacherAuthCookies)
      .send(mockProposalReq);

    expect(res.status).toBe(201);
    expect(res.body.proposal.proposal_id).toEqual("P003");
    const check = await mockDB.query("SELECT * FROM proposals");
    expect(check.rowCount).toBe(3);
  });
});

describe("End to End Tests for Insert Proposal", () => {
  let driver;
  let baseURL = `http://localhost:${process.env.FRONTEND_PORT}/api`;

  const doLogin = async () => {
    await driver.get(baseURL + "/login");
    await driver.sleep(500);
    // perform login
    const usernameBox = await driver.findElement(By.id("username"));
    usernameBox.sendKeys("sarah.anderson@example.com");

    const passwordBox = await driver.findElement(By.id("password"));
    passwordBox.sendKeys("T001");

    const submitButton = await driver.findElement(By.name("button"));
    await submitButton.click();
  };

  const fillProposalForm = async () => {
    // Title
    await driver.findElement(By.id("title")).sendKeys(mockProposalReq.title);

    await driver.sleep(500);

    // Supervisor
    const selectSupervisor = await driver.findElement(By.id("supervisor"));
    selectSupervisor.selectByValue(mockProposalReq.supervisor_id);
    await driver.sleep(500);

    // Keywords
    for (const keyword of mockProposalReq.keywords) {
      await driver.findElement(By.id("keyword")).sendKeys(keyword);
      await driver.findElement(By.id("add-keyword-btn")).click();
    }
    await driver.sleep(500);

    // Type
    await driver.findElement(By.id("type")).sendKeys(mockProposalReq.type);
    await driver.sleep(500);

    // Groups
    for (const group of mockProposalReq.groups) {
      const selectGroup = await driver.findElement(By.id("group"));
      /* TO-DO: select group from menu */
      selectGroup.selectByVisibleText(group);
      await driver.findElement(By.id("add-group-btn")).click();
    }
    await driver.sleep(500);

    // Description
    await driver
      .findElement(By.id("description"))
      .sendKeys(mockProposalReq.description);
    await driver.sleep(500);

    // Required knowledge
    await driver
      .findElement(By.id("required-knowledge"))
      .sendKeys(mockProposalReq.required_knowledge);
    await driver.sleep(500);

    // Notes
    await driver.findElement(By.id("notes")).sendKeys(mockProposalReq.notes);
    await driver.sleep(500);

    // Expiration date
    await driver
      .findElement(By.id("expiration-date"))
      .sendKeys(mockProposalReq.expiration_date);
    await driver.sleep(500);

    // Level
    await driver.findElement(By.id("level")).sendKeys(mockProposalReq.level);
    await driver.sleep(500);

    // Programmes
    for (const programme of mockProposalReq.programmes) {
      const selectProgramme = await driver.findElement(By.id("programme"));
      /* TO-DO: select programme from menu */
      await driver.findElement(By.id("add-programme-btn")).click();
    }
    await driver.sleep(500);
  };

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build();

    await restoreProposalsTable(); // should be already restored but to be sure...
  });

  afterAll(async () => {
    await driver.quit();
  });

  // TO-DO: this test can be removed if no redirection is actually used
  test("T2.1 - Should show (or redirect to) not authorized page if not logged in yet", async () => {
    await driver.get(baseURL + "/proposals/new");

    await driver.sleep(500);

    const alert = await driver.findElement(By.className("alert"));

    // Find the h3 element within the div
    const h3Alert = await alert.findElement(By.css("h3"));

    const textAlert = await h3Alert.getText();
    expect(textAlert).toEqual("Access Not Authorized");
  });

  test("T2.2 - Should not post a new proposal if title is empty", async () => {
    await doLogin();

    await driver.get(baseURL + "/proposals/new");

    await driver.sleep(500);

    // Fill all fields
    await fillProposalForm();

    // Clear title field
    await driver.findElement(By.id("title")).clear();

    // Click submit button
    await driver.findElement(By.id("add-proposal-btn")).click();

    // TODO: expect some error alert to be shown or the button to be disabled

    // check that the database contains only the original tuples and not a new one
    const res = await mockDB.query("SELECT * FROM proposals");
    expect(res.rowCount).toBe(2);
  });

  test("T2.3 - Should insert a new proposal", async () => {
    await doLogin();

    await driver.get(baseURL + "/proposals/new");

    await driver.sleep(500);

    // Fill all the form fields
    await fillProposalForm();

    // Click submit button
    await driver.findElement(By.id("add-proposal-btn")).click();

    await driver.sleep(500);

    // check that the database contains now a new tuple with the returned id
    const res = await mockDB.query("SELECT proposal_id FROM proposals");
    expect(res.rowCount).toBe(3);
    expect(res.rows.includes("P003")).toBeTrue();

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toEqual(baseURL + "/proposals/P003");
  });
});
