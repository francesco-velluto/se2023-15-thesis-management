const request = require("supertest");
const app = require("../app");

const { Builder, By, until } = require("selenium-webdriver");

describe("End to end tests for Apply to proposal", () => {
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
  });

  afterAll(async () => {
    await driver.quit();
  });

  test("Should show apply button to apply and then text becomes applied", async () => {
    await doLogin();

    await driver.get(baseURL + "/proposals/P001");

    await driver.sleep(1000);
    await driver.findElement(By.id("apply-button")).click();

    let applyButtonTextBefore = await driver
      .findElement(By.id("apply-button"))
      .getText();
    expect(applyButtonTextBefore).toEqual("Apply");

    await driver.sleep(1000);
    let applyButtonText = await driver
      .findElement(By.id("apply-button"))
      .getText();
    expect(applyButtonText).toEqual("Applied");
  }, 10000);
});