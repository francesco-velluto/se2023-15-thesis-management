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

    const username = "john.smith@example.com";
    const password = "wrongpassword";

    // perform login
    const usernameBox = await driver.findElement(By.id("username"));
    usernameBox.clear();
    usernameBox.sendKeys(username);

    const passwordBox = await driver.findElement(By.id("password"));
    passwordBox.clear();
    passwordBox.sendKeys(password);

    // click submit button
    const submitButton = await driver.findElement(By.css("div.cdc80f5fa button"))
    await submitButton.click();

    await driver.sleep(500);

    const alert = await driver.findElement(By.id("error-element-password"));
    const textAlert = await alert.getText();

    expect(textAlert).toEqual("Wrong email or password");
  }, 10000);

  test("Should login correctly", async () => {
    await driver.get(baseURL);

    await driver.sleep(1000);

    const username = "john.smith@example.com";
    const password = "S001";

    // perform login
    const usernameBox = await driver.findElement(By.id("username"));
    usernameBox.clear();
    usernameBox.sendKeys(username);

    const passwordBox = await driver.findElement(By.id("password"));
    passwordBox.clear();
    passwordBox.sendKeys(password);

    // click submit button
    const submitButton = await driver.findElement(By.css("div.cdc80f5fa button"))
    await submitButton.click();

    await driver.sleep(500);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toEqual(baseURL + "/");
  }, 10000);
});
