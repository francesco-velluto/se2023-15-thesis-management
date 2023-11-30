const app = require("../app");
const { Builder, By, until } = require("selenium-webdriver");

describe("End to end tests for browse applications", () => {
  let driver;
  let baseURL = `http://localhost:${process.env.FRONTEND_PORT}`;

  const doLogin = async () => {
    await driver.get(baseURL);

    await driver.sleep(1000);

    // perform login
    const usernameBox = await driver.findElement(By.id("username"));
    usernameBox.clear();
    usernameBox.sendKeys("michael.wilson@example.com");

    const passwordBox = await driver.findElement(By.id("password"));
    passwordBox.clear();
    passwordBox.sendKeys("T002");

    const submitButton = await driver.findElement(By.css("button.c480bc568"))

    // remove disabled property from button
    await driver.executeScript(
      "arguments[0].removeAttribute('disabled')",
      submitButton
    );

    // click submit button with js
    await submitButton.click();

    await driver.sleep(500);
  };

  const doLogout = async () => {
    // click on the drop menu
    const logoutDropdown = await driver.findElement(By.id("dropdown-basic"));
    await logoutDropdown.click();

    // click on logout
    const logout = await driver.findElement(By.id("logout-id"));
    await logout.click();

    await driver.sleep(1000);
  }

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test("Should show at least an application in the page", async () => {
    await doLogin();

    await driver.get(baseURL + "/applications");

    await driver.sleep(1000);

    expect(await driver.getCurrentUrl()).toEqual(baseURL + "/applications");

    const accordionItems = await driver.findElements(By.className("accordion-item"));
    expect(accordionItems !== undefined).toEqual(true);
    expect(accordionItems.length > 0).toEqual(true);

    for (const accordionItem of accordionItems) {
      // Verifica l'header
      const accordionHeader = await accordionItem.findElement(By.className("accordion-header"));
      expect(accordionHeader !== undefined).toEqual(true);
    
      // Clicca sull'header per aprire il body
      await accordionHeader.click();
    
      // Verifica il body
      const accordionBody = await accordionItem.findElement(By.className("accordion-body"));
      expect(accordionBody !== undefined).toEqual(true);
    
      // Assicurati che ci siano applicazioni nell'Accordion-Body
      const applications = await accordionBody.findElements(By.className('my-3 card'));
      expect(applications.length > 0).toEqual(true);
    }
    
    await doLogout();
  }, 20000);
});