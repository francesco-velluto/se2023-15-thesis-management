const { Builder, By, until } = require("selenium-webdriver");

describe("End to end tests login", () => {
  let driver;
  let baseURL = `http://localhost:3000`;

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test("Button not clickable when empty fields", async () => {
    await driver.get(baseURL + "/login");

    const usernameBox = await driver.findElement(By.id("username"));
    usernameBox.sendKeys("john.smith@example.com");

    const submitButton = await driver.findElement(By.css("button"));

    const isEnabled = await submitButton.isEnabled();
    expect(isEnabled).toBe(false);
  }, 10000);

  test("Should span an alert when login credentials are wrong", async () => {
    await driver.get(baseURL + "/login");

    await driver.sleep(500);

    let usernameBox = await driver.findElement(By.id("username"));
    await usernameBox.clear();
    await usernameBox.sendKeys("john.smith@example.com");

    let passwordBox = await driver.findElement(By.id("password"));
    await passwordBox.clear();
    await passwordBox.sendKeys("wrongpassword");

    const submitButton = await driver.findElement(By.css("button"))

    // click using js
    await driver.executeScript("arguments[0].click();", submitButton);

    await driver.sleep(500);

    const alert = await driver.findElement(By.className("alert"));
    const textAlert = await alert.getText();

    expect(textAlert).toEqual("Incorrect email and/or password!");
  }, 10000);

  test("Should login correctly", async () => {
    await driver.get(baseURL + "/login");

    await driver.sleep(500);

    let usernameBox = await driver.findElement(By.id("username"));
    await usernameBox.clear();
    await usernameBox.sendKeys("john.smith@example.com");

    let passwordBox = await driver.findElement(By.id("password"));
    await passwordBox.clear();
    await passwordBox.sendKeys("S001");

    const submitButton = await driver.findElement(By.css("button"))

    // click using js
    await driver.executeScript("arguments[0].click();", submitButton);

    await driver.sleep(500);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toEqual(baseURL + "/");
  }, 10000);
});
