const request = require("supertest");
const app = require("../../app");
const { Builder, By, Select } = require("selenium-webdriver");
const { doLogin, doLogout } = require("./utils");

const baseURL = `http://localhost:${process.env.FRONTEND_PORT}`;

let driver;

beforeAll(async () => {
  driver = await new Builder().forBrowser("chrome").build();
});

afterAll(async () => {
  await driver.quit();
});

describe("End to end tests for insert thesis request", () => {
  it("Should show an alert if the title is missing", async () => {
    await doLogin("emily.johnson@example.com", "S002", driver);

    await driver.get(baseURL + "/proposals/requests");

    await driver.sleep(1000);

    await driver.findElement(By.name("description")).sendKeys("This is the description");

    let selectElement = await driver.findElement(By.name("supervisor"));
    let select = new Select(selectElement);
    await select.selectByValue("T001");

    await driver.sleep(500);

    // simulate click with js
    await driver.executeScript("document.getElementById('add-request-btn').click()");

    await driver.sleep(1000);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toEqual(baseURL + "/proposals/requests");

    let alertText = await driver.findElement(By.className("alert")).getText();
    expect(alertText).toEqual("Please enter a valid title.");

    await doLogout(driver);
  }, 20000);

  it("Should show an alert if the description is missing", async () => {
    await doLogin("emily.johnson@example.com", "S002", driver);

    await driver.get(baseURL + "/proposals/requests");

    await driver.sleep(1000);

    await driver.findElement(By.name("title")).sendKeys("New thesis request");

    let selectElement = await driver.findElement(By.name("supervisor"));
    let select = new Select(selectElement);
    await select.selectByValue("T001");

    await driver.sleep(500);

    // simulate click with js
    await driver.executeScript("document.getElementById('add-request-btn').click()");

    await driver.sleep(1000);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toEqual(baseURL + "/proposals/requests");

    let alertText = await driver.findElement(By.className("alert")).getText();
    expect(alertText).toEqual("Please enter a valid description.");

    await doLogout(driver);
  }, 20000);

  it("Should show an alert if the supervisor is missing", async () => {
    await doLogin("emily.johnson@example.com", "S002", driver);

    await driver.get(baseURL + "/proposals/requests");

    await driver.sleep(1000);

    await driver.findElement(By.name("title")).sendKeys("New thesis request");

    await driver.findElement(By.name("description")).sendKeys("This is the description");

    await driver.sleep(500);

    // simulate click with js
    await driver.executeScript("document.getElementById('add-request-btn').click()");

    await driver.sleep(1000);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toEqual(baseURL + "/proposals/requests");

    let alertText = await driver.findElement(By.className("alert")).getText();
    expect(alertText).toEqual("Please enter a valid supervisor.");

    await doLogout(driver);
  }, 20000);

  it("Should insert a new thesis request", async () => {
    await doLogin("emily.johnson@example.com", "S002", driver);

    await driver.get(baseURL + "/proposals/requests");

    await driver.sleep(1000);

    await driver.findElement(By.name("title")).sendKeys("New thesis request");

    await driver.findElement(By.name("description")).sendKeys("This is the description");

    let selectElement = await driver.findElement(By.name("supervisor"));
    let select = new Select(selectElement);
    await select.selectByValue("T001");

    await driver.sleep(500);

    // simulate click with js
    await driver.executeScript("document.getElementById('add-request-btn').click()");

    await driver.sleep(1000);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toEqual(baseURL + "/proposals/requests");

    await doLogout(driver);
  }, 20000);
});
