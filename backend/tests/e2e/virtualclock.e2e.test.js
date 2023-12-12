const request = require("supertest");
const app = require("../../app");
const { add, min, format, parse, isAfter } = require("date-fns");
const { Builder, By, until } = require("selenium-webdriver");
const { doLogin, doLogout } = require("./utils");

const baseURL = `http://localhost:${process.env.FRONTEND_PORT}`;

let driver;

beforeAll(async () => {
  driver = await new Builder().forBrowser("chrome").build();
});

afterAll(async () => {
  await driver.quit();
});

describe("End to end tests for virtual clock", () => {
  it("Should update the proposals list when virtual clock date changes", async () => {
    await doLogin("john.smith@example.com", "S001", driver);

    await driver.get(baseURL + "/proposals");

    await driver.sleep(1000);

    // expiration dates of proposal before using the virtual clock
    const exp_dates_elements_before = await driver.findElements(
      By.className("expiration-date")
    );

    const exp_dates_before = await Promise.all(
      exp_dates_elements_before.map(async (elem) => {
        const date = await elem.getText();
        return parse(date, "dd/MM/yyyy", new Date());
      })
    );

    const min_exp_date = min(exp_dates_before);

    // set virtual clock to be two days after the expiration date of the min exp date
    // to be sure that at least one proposal will be filtered out
    const virtualClockDate = add(min_exp_date, { days: 2 });

    await driver.sleep(500);

    await driver.findElement(By.id("show-virtual-clock-btn")).click();

    await driver
      .findElement(By.id("virtual-clock-form"))
      .sendKeys(format(virtualClockDate, "dd/MM/yyyy"));

    await driver.findElement(By.id("apply-new-date")).click();

    await driver.sleep(1000);

    const exp_dates_after = await driver.findElements(
      By.className("expiration-date")
    );

    expect(exp_dates_after.length).toBeLessThan(exp_dates_before.length);

    for (const date_element of exp_dates_after) {
      const date_text = await date_element.getText();
      const date = parse(date_text, "dd/MM/yyyy", new Date());
      expect(isAfter(date, virtualClockDate)).toBe(true);
    }

    await doLogout(driver);
  }, 20000);
});
