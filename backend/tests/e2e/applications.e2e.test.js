const request = require("supertest");
const app = require("../../app");

const { Builder, By, until } = require("selenium-webdriver");

describe("End to end tests for Apply to proposal", () => {
  let driver;
  let baseURL = `http://localhost:${process.env.FRONTEND_PORT}`;

  const doLogin = async () => {
    await driver.get(baseURL);

    await driver.sleep(1000);

    // perform login
    let usernameBox = await driver.findElement(By.id("username"));
    usernameBox.clear();
    usernameBox.sendKeys("emily.johnson@example.com");
    let passwordBox = await driver.findElement(By.id("password"));
    passwordBox.clear();
    passwordBox.sendKeys("S002");

    await driver.sleep(1000);

    const submitButton = await driver.findElement(By.css("div.ca8d7aabd button"));

    // remove disabled property from button
    await driver.executeScript(
      "arguments[0].removeAttribute('disabled')",
      submitButton
    );

    // click submit button with js
    await submitButton.click();

    await driver.sleep(1000);

    await driver.get(baseURL);

    await driver.sleep(1000);
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

  test("Should show apply or applied button - if apply it becomes applied after click", async () => {
    await doLogin();

    await driver.get(baseURL + "/proposals/P015");

    await driver.sleep(1000);

    let applyButtonTextBefore = await driver
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

      await doLogout();
    }
  }, 20000);
});

describe("End to end tests for Accept or Reject Application", () => {
  let driver;
  let baseURL = `http://localhost:${process.env.FRONTEND_PORT}`;

  const doLogin = async (isTeacherOne = true) => {
    await driver.get(baseURL);

    await driver.sleep(2000);

    // perform login
    let usernameBox = await driver.findElement(By.id("username"));
    usernameBox.clear();
    usernameBox.sendKeys(
      isTeacherOne ? "sarah.anderson@example.com" : "ana.gomez@example.com"
    );

    let passwordBox = await driver.findElement(By.id("password"));
    passwordBox.clear();
    passwordBox.sendKeys(isTeacherOne ? "T001" : "T003");

    await driver.sleep(1000);

    // find all buttons elements
    const submitButton = await driver.findElement(By.css("div.ca8d7aabd button"));


    // remove disabled property from button
    await driver.executeScript(
      "arguments[0].removeAttribute('disabled')",
      submitButton
    );

    // click submit button with js
    await submitButton.click();

    await driver.sleep(1000);
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

  test("Should cancel the accept of an application", async () => {
    await doLogin();

    await driver.sleep(500);

    await driver.get(baseURL + "/applications/1");

    await driver.sleep(1000);

    const acceptButton = await driver.findElement(By.id("accept-application"));

    // click submit button with js
    await driver.executeScript("arguments[0].click();", acceptButton);

    await driver.sleep(500);

    const cancelButton = await driver.findElement(By.id("cancel-reject-application"));

    // click submit button with js
    await driver.executeScript("arguments[0].click();", cancelButton);

    await driver.sleep(500);

    expect(await driver.getCurrentUrl()).toEqual(baseURL + "/applications/1");

    await doLogout();
  }, 20000);

  test("Should cancel the reject of an application", async () => {
    await doLogin();

    await driver.sleep(500);

    await driver.get(baseURL + "/applications/1");

    await driver.sleep(1000);

    const rejectButton = await driver.findElement(By.id("reject-application"));

    // click submit button with js
    await driver.executeScript("arguments[0].click();", rejectButton);

    await driver.sleep(500);

    const cancelButton = await driver.findElement(By.id("cancel-reject-application"));

    // click submit button with js
    await driver.executeScript("arguments[0].click();", cancelButton);

    await driver.sleep(500);

    expect(await driver.getCurrentUrl()).toEqual(baseURL + "/applications/1");

    await doLogout();
  }, 20000);

  test("Should accept an application", async () => {
    await doLogin();

    await driver.sleep(500);

    await driver.get(baseURL + "/applications/1");

    await driver.sleep(1000);

    const acceptButton = await driver.findElement(By.id("accept-application"));

    // click submit button with js
    await driver.executeScript("arguments[0].click();", acceptButton);

    await driver.sleep(500);

    const confirmButton = await driver.findElement(By.id("confirm-reject-application"));

    // click submit button with js
    await driver.executeScript("arguments[0].click();", confirmButton);

    await driver.sleep(100);

    const emailMessageBefore = await driver.findElement(By.id("email-sending-message")).getText();

    expect(emailMessageBefore.includes("We are updating the status of the application and sending an email notification")).toBeTruthy();

    await driver.sleep(2000);

    const emailMessageAfter = await driver.findElement(By.id("email-sending-message")).getText();

    expect(emailMessageAfter.includes("An email notification has been correctly sent")).toBeTruthy();

    const backButton = await driver.findElement(By.id("email-message-back-btn"));

    // click submit button with js
    await driver.executeScript("arguments[0].click();", backButton);

    await driver.sleep(500);

    expect(await driver.getCurrentUrl()).toEqual(baseURL + "/applications");

    await doLogout();
  }, 20000);

  test("Should reject an application", async () => {
    await doLogin(false);

    await driver.sleep(500);

    await driver.get(baseURL + "/applications/13");

    await driver.sleep(1000);

    const rejectButton = await driver.findElement(By.id("reject-application"));

    // click submit button with js
    await driver.executeScript("arguments[0].click();", rejectButton);

    await driver.sleep(500);

    const confirmButton = await driver.findElement(By.id("confirm-reject-application"));

    // click submit button with js
    await driver.executeScript("arguments[0].click();", confirmButton);

    await driver.sleep(100);

    const emailMessageBefore = await driver.findElement(By.id("email-sending-message")).getText();

    expect(emailMessageBefore.includes("We are updating the status of the application and sending an email notification")).toBeTruthy();

    await driver.sleep(2000);

    const emailMessageAfter = await driver.findElement(By.id("email-sending-message")).getText();

    expect(emailMessageAfter.includes("An email notification has been correctly sent")).toBeTruthy();

    const backButton = await driver.findElement(By.id("email-message-back-btn"));

    // click submit button with js
    await driver.executeScript("arguments[0].click();", backButton);

    await driver.sleep(500);

    expect(await driver.getCurrentUrl()).toEqual(baseURL + "/applications");

    await doLogout();
  }, 20000);
});

describe("End to end tests for Browse applications decisions", () => {
  let driver;
  let baseURL = `http://localhost:${process.env.FRONTEND_PORT}`;

  const doLogin = async () => {
    await driver.get(baseURL);

    await driver.sleep(1000);

    // perform login
    let usernameBox = await driver.findElement(By.id("username"));
    usernameBox.clear();
    usernameBox.sendKeys("john.smith@example.com");

    let passwordBox = await driver.findElement(By.id("password"));
    passwordBox.clear();
    passwordBox.sendKeys("S001");

    await driver.sleep(1000);

    const submitButton = await driver.findElement(By.css("div.ca8d7aabd button"));

    // remove disabled property from button
    await driver.executeScript(
      "arguments[0].removeAttribute('disabled')",
      submitButton
    );

    // click submit button with js
    await submitButton.click();

    await driver.sleep(1000);
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

  test("Should show the application decision", async () => {
    await doLogin();

    await driver.sleep(500);

    await driver.get(baseURL + "/applications");

    await driver.sleep(1000);

    expect(await driver.getCurrentUrl()).toEqual(baseURL + "/applications");

    const applications = await driver.findElements(
      By.id("student-application-card")
    );

    if (applications.length > 0) {
      for (const application of applications) {
        const applicationHeader = await application
          .findElement(By.id("student-application-card-header"))
          .getText();

        expect(["Accepted", "Rejected", "Pending"]).toContain(
          applicationHeader
        );
      }
    }

    await driver.findElement(By.id("back-to-homepage-button")).click();

    await driver.sleep(500);

    expect(await driver.getCurrentUrl()).toEqual(baseURL + "/");

    await doLogout();
  }, 20000);

  test("Should show the new application decision if the student applies to a new proposal", async () => {
    await doLogin();

    await driver.sleep(500);

    await driver.get(baseURL + "/proposals");

    const showDetailsButtons = await driver.findElements(
      By.className("show-details-link")
    );

    for (const showDetailsButton of showDetailsButtons) {
      await showDetailsButton.click();

      await driver.sleep(500);

      let applyButtonTextBefore = await driver
        .findElement(By.id("apply-button"))
        .getText();

      expect(
        applyButtonTextBefore === "Apply" || applyButtonTextBefore === "Applied"
      ).toBeTruthy();

      if (applyButtonTextBefore === "Apply") {
        const proposalTitle = await driver
          .findElement(By.className("proposal-details-title"))
          .getText();
        await driver.findElement(By.id("apply-button")).click();

        await driver.sleep(1000);

        await driver.get(baseURL + "/applications");

        await driver.sleep(500);

        expect(await driver.getCurrentUrl()).toEqual(baseURL + "/applications");

        const title = (
          await driver
            .findElement(By.id("student-application-card-title"))
            .getText()
        )[0];

        expect(title).toEqual(proposalTitle);

        break;
      }
    }

    await doLogout();
  }, 20000);
});
