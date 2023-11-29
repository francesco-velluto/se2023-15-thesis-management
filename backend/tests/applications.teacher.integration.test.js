const request = require("supertest");
const app = require("../app");

const { Builder, By, until } = require("selenium-webdriver");

describe("End to end tests for browse applications", () => {
  let driver;
  let baseURL = `http://localhost:${process.env.FRONTEND_PORT}`;

  const doLogin = async () => {
    await driver.get(baseURL + "/login");

    // perform login
    const usernameBox = await driver.findElement(By.id("username"));
    usernameBox.clear();
    usernameBox.sendKeys("michael.wilson@example.com");
    const passwordBox = await driver.findElement(By.id("password"));
    passwordBox.clear();
    passwordBox.sendKeys("T002");

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

  test("Should show an application in the page", async () => {
    await doLogin();

    await driver.get(baseURL + "/applications");

    await driver.sleep(1000);

    expect(await driver.getCurrentUrl()).toEqual(baseURL + "/applications");

    const accordion = await driver.wait(until.elementLocated(By.css('Accordion')), 5000);    
    assert.isNotNull(accordion);
  
    console.log(accordion);

    // Assicurati che ci siano applicazioni nell'Accordion
    const applications = await driver.findElements(By.css('Accordion.Item'));
    assert.isTrue(applications.length > 0);

    console.log(applications);

    
    /*expect(
      applyButtonTextBefore === "Apply" || applyButtonTextBefore === "Applied"
    ).toBeTruthy();*/


    /*let applyButtonTextBefore = await driver
      .findElement(By.id("apply-button"))
      .getText();

    expect(
      applyButtonTextBefore === "Apply" || applyButtonTextBefore === "Applied"
    ).toBeTruthy();

    if (applyButtonTextBefore === "Apply") {
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
    }*/

  }, 10000);
});