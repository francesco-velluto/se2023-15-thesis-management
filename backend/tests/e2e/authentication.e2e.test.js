const app = require("../../app");
const { Builder, By } = require("selenium-webdriver");
const { doLogin, doLogout } = require("./utils");

describe("End to end tests login", () => {
  let driver;
  const baseURL = `http://localhost:${process.env.FRONTEND_PORT}`;

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test("Should display an alert when login credentials are wrong", async () => {
    await doLogin("john.smith@example.com", "wrongpassword", driver);

    await driver.sleep(500);

    const alert = await driver.findElement(By.id("error-element-password"));
    const textAlert = await alert.getText();

    expect(textAlert).toEqual("Wrong email or password");
  }, 10000);

  test("Should not access when the confirm button is clicked and the password is not entered", async () => {
    await doLogin("john.smith@example.com", "", driver);

    await driver.sleep(500);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).not.toEqual(baseURL + "/");
  }, 10000);

  test("Should not access when the confirm button is clicked and the email is not entered", async () => {
    await doLogin("", "wrongpassword", driver);

    await driver.sleep(500);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).not.toEqual(baseURL + "/");
  }, 10000);

  test("Should not access when the confirm button is clicked and the email and password are not entered", async () => {
    await doLogin("", "", driver);

    await driver.sleep(500);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).not.toEqual(baseURL + "/");
  }, 10000);

  test("Should access correctly", async () => {
    await doLogin("john.smith@example.com", "S001", driver);

    await driver.sleep(500);

    const currentUrl = await driver.getCurrentUrl();

    await doLogout(driver);

    expect(currentUrl).toEqual(baseURL + "/");
  }, 10000);
});
