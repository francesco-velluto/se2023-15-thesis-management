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

  test("Should show apply or applied button - if apply it becomes applied after click", async () => {
    await doLogin();

    await driver.get(baseURL + "/proposals/P015");

    await driver.sleep(1000)

    let applyButtonTextBefore = await driver
      .findElement(By.id("apply-button"))
      .getText();

    expect(applyButtonTextBefore === "Apply" || applyButtonTextBefore === "Applied").toBeTruthy();

    if(applyButtonTextBefore === "Apply") {
      await driver.findElement(By.id("apply-button"));

      // simulate click with js
      await driver.executeScript(
          "document.getElementById('apply-button').click()"
      );

      await driver.sleep(1000);

      let applyButtonText = await driver
          .findElement(By.id("apply-button"))
          .getText();

      expect(applyButtonTextBefore).toEqual("Apply");
      expect(applyButtonText).toEqual("Applied");
    }
  }, 10000);
});

describe("End to end tests for Accept or Reject Application", () => {
  let driver;
  let baseURL = `http://localhost:${process.env.FRONTEND_PORT}`;

  const doLogin = async (isTeacherOne = true) => {
    await driver.get(baseURL + "/login");

    // perform login
    const usernameBox = await driver.findElement(By.id("username"));
    usernameBox.clear();
    usernameBox.sendKeys(isTeacherOne ? "sarah.anderson@example.com" : "ana.gomez@example.com")

    const passwordBox = await driver.findElement(By.id("password"));
    passwordBox.clear();
    passwordBox.sendKeys(isTeacherOne ? "T001" : "T003");

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

  test("Should cancel the accept of an application", async () => {
    await doLogin();

    await driver.sleep(500);

    await driver.get(baseURL + "/applications/1");

    await driver.sleep(1000);

    const acceptButton = await driver.findElement(By.className("btn-outline-success"));

    // click submit button with js
    await driver.executeScript(
        "arguments[0].click();",
        acceptButton
    );

    await driver.sleep(500);

    const cancelButton = await driver.findElement(By.className("btn-danger"));

    // click submit button with js
    await driver.executeScript(
        "arguments[0].click();",
        cancelButton
    );

    await driver.sleep(500);

    expect(await driver.getCurrentUrl()).toEqual(baseURL + "/applications/1");
  }, 10000);

  test("Should cancel the reject of an application", async () => {
    await doLogin();

    await driver.sleep(500);

    await driver.get(baseURL + "/applications/1");

    await driver.sleep(1000);

    const rejectButton = await driver.findElement(By.className("btn-outline-danger"));

    // click submit button with js
    await driver.executeScript(
        "arguments[0].click();",
        rejectButton
    );

    await driver.sleep(500);

    const cancelButton = await driver.findElement(By.className("btn-danger"));

    // click submit button with js
    await driver.executeScript(
        "arguments[0].click();",
        cancelButton
    );

    await driver.sleep(500);

    expect(await driver.getCurrentUrl()).toEqual(baseURL + "/applications/1");
  }, 10000);

  test("Should accept an application", async () => {
    await doLogin();

    await driver.sleep(500);

    await driver.get(baseURL + "/applications/1");

    await driver.sleep(1000);

    const acceptButton = await driver.findElement(By.className("btn-outline-success"));

    // click submit button with js
    await driver.executeScript(
        "arguments[0].click();",
        acceptButton
    );

    await driver.sleep(500);

    const confirmButton = await driver.findElement(By.className("btn-success"));

    // click submit button with js
    await driver.executeScript(
        "arguments[0].click();",
        confirmButton
    );

    await driver.sleep(500);

    expect(await driver.getCurrentUrl()).toEqual(baseURL + "/applications");
  }, 10000);

    test("Should reject an application", async () => {
        await doLogin(false);

        await driver.sleep(500);

        await driver.get(baseURL + "/applications/3");

        await driver.sleep(1000);

        const rejectButton = await driver.findElement(By.className("btn-outline-danger"));

        // click submit button with js
        await driver.executeScript(
            "arguments[0].click();",
            rejectButton
        );

        await driver.sleep(500);

        const confirmButton = await driver.findElement(By.className("btn-success"));

        // click submit button with js
        await driver.executeScript(
            "arguments[0].click();",
            confirmButton
        );

        await driver.sleep(500);

        expect(await driver.getCurrentUrl()).toEqual(baseURL + "/applications");
    }, 10000);

});