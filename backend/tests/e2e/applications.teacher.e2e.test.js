const app = require("../../app");
const { Builder, By, until } = require("selenium-webdriver");
const { doLogin, doLogout } = require("./utils");

describe("End to end tests for browse applications", () => {
  let driver;
  let baseURL = `http://localhost:${process.env.FRONTEND_PORT}`;

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test("Should show at least an application in the page", async () => {
    await doLogin("michael.wilson@example.com", "T002", driver);

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

    await doLogout(driver);
  }, 20000);
});