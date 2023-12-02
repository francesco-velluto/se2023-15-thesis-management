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

  test("Should span an alert when login credentials are wrong", async () => {
    await driver.get(baseURL);

    await driver.sleep(1000);

    let usernameBox = await driver.findElement(By.id("username"));
    await usernameBox.clear();
    await usernameBox.sendKeys("john.smith@example.com");

    let passwordBox = await driver.findElement(By.id("password"));
    await passwordBox.clear();
    await passwordBox.sendKeys("wrongpassword");

    const submitButton = await driver.findElement(By.css("button.c480bc568"))

    // click using js
    await driver.executeScript("arguments[0].click();", submitButton);

    await driver.sleep(500);

    const alert = await driver.findElement(By.id("error-element-password"));
    const textAlert = await alert.getText();

    expect(textAlert).toEqual("Wrong email or password");
  }, 10000);

  test("Should login correctly", async () => {
    await driver.get(baseURL);

    await driver.sleep(1000);

    let usernameBox = await driver.findElement(By.id("username"));
    await usernameBox.clear();
    await usernameBox.sendKeys("john.smith@example.com");

    let passwordBox = await driver.findElement(By.id("password"));
    await passwordBox.clear();
    await passwordBox.sendKeys("S001");

    const submitButton = await driver.findElement(By.css("button.c480bc568"))

    // click using js
    await driver.executeScript("arguments[0].click();", submitButton);

    await driver.sleep(500);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toEqual(baseURL + "/");
  }, 10000);
});