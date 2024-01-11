const request = require("supertest");
const app = require("../../app");

const { Builder, By } = require("selenium-webdriver");
const { doLogout, doLogin } = require("./utils");

describe("End to end tests for Notify Application", () => {
    let driver;
    const baseURL = `http://localhost:${process.env.FRONTEND_PORT}`;

    const successMessagePopupHeader = "Applying for this proposal";
    const successMessagePopupBody1 = "Your application has been inserted successfully!";
    const successMessagePopupBody2 = "An email notification has been sent to the teacher.";

    beforeAll(async () => {
        driver = await new Builder().forBrowser("chrome").build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test("Should display a confirmation popup after the application if the email has been sent to the teacher", async () => {
        await doLogin("s317549@studenti.polito.it", "S012", driver);

        await driver.get(baseURL + "/proposals/P002");

        await driver.sleep(1000);

        const applyButton = await driver.findElement(By.id("apply-button"));
        const applyButtonTextBefore = await applyButton.getText();
        
        expect(applyButtonTextBefore === "Apply").toBeTruthy();

        await applyButton.click();        
        await driver.sleep(2000);

        const modalHeaderPopupEmail = await driver.findElement(By.css(".modal-title.h4"));
        const modalHeaderPopupEmailText = await modalHeaderPopupEmail.getText();

        expect(modalHeaderPopupEmailText === successMessagePopupHeader).toBeTruthy();

        const modalBodyPopupEmail = await driver.findElement(By.id("email-sending-message"));
        const modalBodyPopupEmailText = await modalBodyPopupEmail.getText();

        expect(modalBodyPopupEmailText).toContain(successMessagePopupBody1);
        expect(modalBodyPopupEmailText).toContain(successMessagePopupBody2);
        
        const applyButtonTextAfter = await applyButton.getText();
        expect(applyButtonTextAfter === "Applied").toBeTruthy();

        await doLogout(driver);
    }, 30000);
});