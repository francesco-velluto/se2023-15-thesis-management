const dayjs = require("dayjs");
const { Builder, By, Select, Button, until } = require("selenium-webdriver");
const app = require("../../app");
const { doLogin, doLogout } = require("./utils");
const db = require("../../service/db");
const { ca } = require("date-fns/locale");
const e = require("express");

/*
 * Template for insert proposal request body,
 * if you need to change some field, just copy with spread operator:
 * const myReqBody = { ...mockProposalReq, title: "new title" };
 */
const mockProposalReq = {
    title: "test",
    supervisor_id: "T002",
    keywords: ["keyword1", "keyword2"],
    type: "Research",
    groups: ["Group A", "Group B"],
    description: "A master thesis just to test the insert API call",
    required_knowledge: "Node.js, PostgreSQL, React.js",
    notes: "These are the notes...",
    expiration_date: "2024-06-30",
    level: "Master",
    programmes: ["Master of Science"],
};
const baseURL = `http://localhost:${process.env.FRONTEND_PORT}`;
let driver;


describe("End to end tests for Search proposals", () => {
    beforeAll(async () => {
        driver = await new Builder().forBrowser("chrome").build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test("Should show not authorized page if not logged in yet", async () => {
        await driver.get(baseURL + "/proposals");

        await driver.sleep(500);

        let pageTitle = await driver
            .findElement(By.className("alert-danger"))
            .getText();
        expect(pageTitle).toEqual("Access Not Authorized");
    }, 20000);

    test("Should show proposals list", async () => {
        await doLogin("john.smith@example.com", "S001", driver);

        await driver.get(baseURL + "/proposals");

        await driver.sleep(500);
        await driver.findElement(By.className("border-dark"));

        await doLogout(driver);
    }, 20000);

    test("Should show proposals list filtered by description", async () => {
        await doLogin("john.smith@example.com", "S001", driver);

        await driver.get(baseURL + "/proposals");

        await driver.sleep(500);

        let selectElement = await driver.findElement(By.className("form-select"));
        let select = new Select(selectElement);
        await select.selectByValue("description");

        await driver.sleep(500);

        let typeField = await driver.findElement(By.id("inputValue"));
        await typeField.clear();
        await typeField.sendKeys("web");

        let srcButton = driver.findElement(By.className("btn-outline-secondary"));
        await srcButton.click();

        await driver.sleep(500);

        await driver.findElement(By.className("border-dark"));

        await doLogout(driver);
    }, 20000);
});


describe("End to end tests for Proposal details", () => {
    beforeAll(async () => {
        driver = await new Builder().forBrowser("chrome").build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test("Should show not authorized page if not logged in yet", async () => {
        await driver.get(baseURL + "/proposals/P001");

        await driver.sleep(1000);

        let pageTitle = await driver
            .findElement(By.className("alert-danger"))
            .getText();
        expect(pageTitle).toEqual("Access Not Authorized");
    }, 20000);

    test("Should show Proposal not found", async () => {
        await doLogin("john.smith@example.com", "S001", driver);

        await driver.get(baseURL + "/proposals/ABC0");

        await driver.sleep(500);

        let pageTitle = await driver
            .findElement(By.className("lead"))
            .getText();

        expect(pageTitle).toEqual("The proposal has not been found!");

        await doLogout(driver);
    }, 20000);

    test("Should show Proposal details", async () => {
        await doLogin("john.smith@example.com", "S001", driver);

        await driver.get(baseURL + "/proposals/P001");

        await driver.sleep(500);
        await driver.findElement(By.className("proposal-details-title"));

        await doLogout(driver);
    }, 20000);
});


describe("End to End Tests for Insert Proposal", () => {
    const fillProposalForm = async () => {
        // Title
        await driver.findElement(By.name("title")).sendKeys(mockProposalReq.title);

        // Keywords
        for (const keyword of mockProposalReq.keywords) {
            const keywordField = await driver.findElement(By.name("proposal-keywords"));
            await keywordField.sendKeys(keyword);

            // simulate click with js
            await driver.executeScript(
                "document.getElementById('add-keyword-btn').click()"
            );

            await driver.sleep(200);
            await keywordField.clear();
        }

        // Type
        await driver.findElement(By.name("proposal-type")).sendKeys(mockProposalReq.type);

        // Description
        await driver
            .findElement(By.name("description"))
            .sendKeys(mockProposalReq.description);

        // Required knowledge
        await driver
            .findElement(By.name("required-knowledge"))
            .sendKeys(mockProposalReq.required_knowledge);

        // Notes
        await driver.findElement(By.name("additional-notes")).sendKeys(mockProposalReq.notes);

        // Expiration date
        const date = dayjs(mockProposalReq.expiration_date).format("DD/MM/YYYY");
        await driver.findElement(By.id("expiration-date")).sendKeys(date);

        // Level
        let selectElement = await driver.findElement(By.name("proposal-level"));
        let select = new Select(selectElement);
        await select.selectByValue(mockProposalReq.level);

        // Programmes
        for (const programme of mockProposalReq.programmes) {
            const selectElement = await driver.findElement(By.name("proposal-programmes"));
            const select = new Select(selectElement);
            await select.selectByVisibleText(programme);

            await driver.sleep(200);
        }
    };

    beforeAll(async () => {
        driver = await new Builder().forBrowser("chrome").build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test("T2.1 - Should show (or redirect to) not authorized page if not logged in yet", async () => {
        await driver.get(baseURL + "/proposals/new");

        const alert = await driver.findElement(By.className("alert"));

        // Find the h3 element within the div
        const h3Alert = await alert.findElement(By.css("h3"));

        const textAlert = await h3Alert.getText();
        expect(textAlert).toEqual("Access Not Authorized");
    }, 20000);

    test("T2.2 - Should not post a new proposal if title is empty", async () => {
        await doLogin("sarah.anderson@example.com", "T001", driver);

        await driver.get(baseURL + "/proposals/new");

        await driver.sleep(500);

        // Fill all fields
        await fillProposalForm();

        // Clear title field
        await driver.findElement(By.name("title")).clear();

        await driver.sleep(500);

        // simulate click with js
        await driver.executeScript(
            "document.getElementById('add-proposal-btn').click()"
        );

        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toEqual(baseURL + "/proposals/new"); // expect to not be redirected

        await doLogout(driver);
    }, 20000);

    test("T2.3 - Should insert a new proposal", async () => {
        await doLogin("sarah.anderson@example.com", "T001", driver);

        await driver.get(baseURL + "/proposals/new");

        await driver.sleep(500);

        // Fill all the form fields
        await fillProposalForm();

        await driver.sleep(500);

        // simulate click with js
        await driver.executeScript(
            "document.getElementById('add-proposal-btn').click()"
        );

        const currentUrl = await driver.getCurrentUrl();
        const idRegex = "0(0[1-9]|[1-9][0-9])|[1-9][0-9]{2}[0-9]*";
        expect(currentUrl).toMatch(new RegExp(baseURL + "/proposals/P" + idRegex));

        await doLogout(driver);
    }, 20000);
});


describe("End to end test for professor proposals", () => {
    beforeAll(async () => {
        driver = await new Builder().forBrowser("chrome").build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test("Should show not authorized page if not logged in yet", async () => {
        await driver.get(baseURL + "/proposals");

        await driver.sleep(500);

        let pageTitle = await driver
            .findElement(By.className("alert-danger"))
            .getText();
        expect(pageTitle).toEqual("Access Not Authorized");
    }, 20000);

    test("Should show the proposals list if logged", async () => {
        await doLogin("michael.wilson@example.com", "T002", driver);

        await driver.get(baseURL + "/proposals");

        await driver.sleep(500);
        await driver.findElement(By.className("bg-white rounded-bottom py-4 container"));

        await doLogout(driver);
    }, 20000);

    test("Should see the details of a proposal", async () => {
        await doLogin("michael.wilson@example.com", "T002", driver);

        await driver.get(baseURL + "/proposals/P002");

        await driver.sleep(500);
        let pageTitle = await driver.findElement(By.className("proposal-details-title")).getAttribute('value');

        expect(pageTitle).toEqual("Machine Learning");

        await doLogout(driver);
    }, 20000);

    test("Should see proposal not found alert", async () => {
        await doLogin("michael.wilson@example.com", "T002", driver);

        await driver.get(baseURL + "/proposals/P0066");

        await driver.sleep(500);

        let alertText = await driver.findElement(By.className("lead")).getText();
        expect(alertText).toEqual("The proposal has not been found!");

        await doLogout(driver);
    }, 20000);

});

describe("End to end test for delete proposal", () => {

    beforeAll(async () => {
        driver = await new Builder().forBrowser("chrome").build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test("Should show not authorized page if not logged in yet", async () => {
        await driver.get(baseURL + "/proposals/P019");

        await driver.sleep(500);

        let pageTitle = await driver
            .findElement(By.className("alert-danger"))
            .getText();
        expect(pageTitle).toEqual("Access Not Authorized");

    }, 20000);

    test("Shouldn't show the delete button if logged as a student", async() => {
        await doLogin("john.smith@example.com", "S001", driver);

        await driver.sleep(500);

        await driver.get(baseURL + "/proposals/P019");

        await driver.sleep(1000);

        let button = await driver.findElement(By.css('#apply-button')).getText();

        expect(button).toEqual("Apply");

        await doLogout(driver);

        
    }, 20000);

    test("Shouldn't delete the proposal if cancel the action", async() =>{
        await doLogin("ana.gomez@example.com", "T003", driver);

        await driver.sleep(500);

        await driver.get(baseURL + "/proposals/P019");
        await driver.sleep(500);

        const deleteButton = await driver.findElement(By.css('#delete-proposal-btn'));
        

        expect(await deleteButton.getText()).toEqual("Delete proposal");
        

        await driver.executeScript(
            "arguments[0].removeAttribute('disabled')",
            deleteButton
        );

        await driver.executeScript(
            "document.getElementById('delete-proposal-btn').click()"
        );

        await driver.sleep(500);

        let cancelButton = await driver.findElement(By.css('#cancel-delete-proposal'));
        await driver.sleep(500);

        expect(await cancelButton.getText()).toEqual('Cancel');

        await driver.executeScript(
            "document.getElementById('cancel-delete-proposal').click()"
        );

        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toEqual(baseURL + "/proposals/P019"); // expect to not be redirected

        await doLogout(driver);
    
    }, 20000);

    test("Should delete the proposal", async ()=>{

        //await fakeInsert();

        await doLogin("ana.gomez@example.com", "T003", driver);

        await driver.sleep(500);

        await driver.get(baseURL + "/proposals/P019");
        await driver.sleep(500);

        const deleteButton = await driver.findElement(By.css('#delete-proposal-btn'));
        

        expect(await deleteButton.getText()).toEqual("Delete proposal");
        

        await driver.executeScript(
            "arguments[0].removeAttribute('disabled')",
            deleteButton
        );

        await driver.executeScript(
            "document.getElementById('delete-proposal-btn').click()"
        );

        await driver.sleep(500);

        let confirmButton = await driver.findElement(By.css('#confirm-delete-proposal'));
        await driver.sleep(500);

        expect(await confirmButton.getText()).toEqual('Confirm');

        await driver.executeScript(
            "document.getElementById('confirm-delete-proposal').click()"
        );

        await driver.sleep(500);

        const currentUrl = await driver.getCurrentUrl();

        await driver.sleep(500);
        expect(currentUrl).toEqual(baseURL + "/proposals"); // expect to be redirected
    
        await doLogout(driver);

    }, 20000);


})

describe("End to end test for update proposal", () => {

    beforeAll(async () => {
        driver = await new Builder().forBrowser("chrome").build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test("Should show not authorized page if not logged in yet", async () => {
        await driver.get(baseURL + "/proposals/P019");

        await driver.sleep(500);

        let pageTitle = await driver
            .findElement(By.className("alert-danger"))
            .getText();
        expect(pageTitle).toEqual("Access Not Authorized");

    }, 20000);

    test("Shouldn't show the update button if logged as a student", async() => {
        await doLogin("john.smith@example.com", "S001", driver);

        await driver.sleep(500);

        await driver.get(baseURL + "/proposals");

        await driver.sleep(1000);

        try{

            await driver.findElement(By.id('dropdown-proposal-actions'));

            //if the element is found, the test fails
            expect(true).toEqual(false);

        } catch(err){

            expect(err.name).toEqual("NoSuchElementError");

            doLogout(driver);



        }

    }, 20000);

    test("Shouldn't update the proposal if cancel the action", async() =>{
        await doLogin("michael.wilson@example.com", "T002", driver);

        await driver.sleep(1000);

        await driver.get(baseURL + "/proposals");

        await driver.sleep(1000);

        const firstProposal = await driver.wait(until.elementLocated(By.className('proposal-row')), 10000);

        const dropdownButton = await firstProposal.findElement(By.css('#dropdown-proposal-actions'));

        expect(await dropdownButton.getText()).toEqual("Actions");

        await dropdownButton.click();
        
        const dropdownButtonUpdate = await firstProposal.findElement(By.css('#update-proposal-id'));

        expect(await dropdownButtonUpdate.getText()).toEqual("Update");

        await dropdownButtonUpdate.click();

        await driver.sleep(500);

        const titleField = await driver.findElement(By.name('title'));

        const titleBefore = await titleField.getAttribute('value');

        await titleField.clear();

        await titleField.sendKeys("Modified title");

        await driver.sleep(500);

        const cancelButton = await driver.findElement(By.css('#go-back'));

        expect(await cancelButton.getText()).toEqual("Return");

        await driver.executeScript(
            "document.getElementById('go-back').click()"
        );

        await driver.sleep(1000);

        const firstProposalAfter = await driver.findElement(By.className('proposal-row'));

        const showDetailsButton = await firstProposalAfter.findElement(By.id('show-details-proposal'));

        await showDetailsButton.click();

        await driver.sleep(1000);

        const titleAfter = await driver.findElement(By.id('proposal-title')).getAttribute('value');

        expect(titleAfter).toEqual(titleBefore);
        expect(titleAfter).not.toEqual("Modified title");

        await doLogout(driver);     

    }, 20000);

    test("Should update the proposal", async ()=>{

        await doLogin("michael.wilson@example.com", "T002", driver);

        await driver.sleep(1000);

        await driver.get(baseURL + "/proposals");

        await driver.sleep(1000);

        const firstProposal = await driver.wait(until.elementLocated(By.className('proposal-row')), 10000);

        const dropdownButton = await firstProposal.findElement(By.css('#dropdown-proposal-actions'));

        expect(await dropdownButton.getText()).toEqual("Actions");

        await dropdownButton.click();

        const dropdownButtonUpdate = await firstProposal.findElement(By.css('#update-proposal-id'));

        expect(await dropdownButtonUpdate.getText()).toEqual("Update");

        await dropdownButtonUpdate.click();

        await driver.sleep(500);

        const titleField = await driver.findElement(By.name('title'));

        await titleField.clear();

        const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        await titleField.sendKeys(randomString);

        await driver.sleep(500);

        const saveButton = await driver.findElement(By.css('#add-proposal-btn'));

        expect(await saveButton.getText()).toEqual("Save");

        await driver.executeScript(
            "document.getElementById('add-proposal-btn').click()"
        );

        await driver.sleep(1000);

        await driver.get(baseURL + "/proposals");

        await driver.sleep(1000);

        const firstProposalAfter = await driver.findElement(By.className('proposal-row'));

        const showDetailsButton = await firstProposalAfter.findElement(By.id('show-details-proposal'));

        await showDetailsButton.click();

        await driver.sleep(1000);

        const titleAfter = await driver.findElement(By.id('proposal-title')).getAttribute('value');

        expect(titleAfter).toEqual(randomString);

        await driver.sleep(1000);

        await doLogout(driver);

        await driver.sleep(1000);

    }, 30000);

    test("Shouldn't update the proposal if title is empty", async ()=>{

        await doLogin("michael.wilson@example.com", "T002", driver);

        await driver.sleep(1000);

        await driver.get(baseURL + "/proposals");

        await driver.sleep(1000);

        const firstProposal = await driver.wait(until.elementLocated(By.className('proposal-row')), 10000);

        const dropdownButton = await firstProposal.findElement(By.css('#dropdown-proposal-actions'));

        expect(await dropdownButton.getText()).toEqual("Actions");

        await dropdownButton.click();

        const dropdownButtonUpdate = await firstProposal.findElement(By.css('#update-proposal-id'));

        expect(await dropdownButtonUpdate.getText()).toEqual("Update");

        await dropdownButtonUpdate.click();

        await driver.sleep(500);

        const titleField = await driver.findElement(By.name('title'));

        await titleField.clear();

        await driver.sleep(500);

        const saveButton = await driver.findElement(By.css('#add-proposal-btn'));

        expect(await saveButton.getText()).toEqual("Save");

        await driver.executeScript(
            "document.getElementById('add-proposal-btn').click()"
        );

        await driver.sleep(1000);

        await driver.get(baseURL + "/proposals");

        await driver.sleep(1000);

        const firstProposalAfter = await driver.findElement(By.className('proposal-row'));

        const showDetailsButton = await firstProposalAfter.findElement(By.id('show-details-proposal'));

        await showDetailsButton.click();

        await driver.sleep(1000);

        const titleAfter = await driver.findElement(By.id('proposal-title')).getAttribute('value');

        expect(titleAfter).not.toEqual("");

        await doLogout(driver);

    }, 20000);

    test("Shouldn't update the proposal if description is empty", async ()=>{

        await doLogin("michael.wilson@example.com", "T002", driver);

        await driver.sleep(1000);

        await driver.get(baseURL + "/proposals");

        await driver.sleep(1000);

        const firstProposal = await driver.wait(until.elementLocated(By.className('proposal-row')), 10000);
        const dropdownButton = await firstProposal.findElement(By.css('#dropdown-proposal-actions'));

        expect(await dropdownButton.getText()).toEqual("Actions");  

        await dropdownButton.click();

        const dropdownButtonUpdate = await firstProposal.findElement(By.css('#update-proposal-id'));

        expect(await dropdownButtonUpdate.getText()).toEqual("Update");

        await dropdownButtonUpdate.click();

        await driver.sleep(500);

        const descriptionField = await driver.findElement(By.name('description'));

        await descriptionField.clear();

        await driver.sleep(500);

        const saveButton = await driver.findElement(By.css('#add-proposal-btn'));

        expect(await saveButton.getText()).toEqual("Save");

        await driver.executeScript(
            "document.getElementById('add-proposal-btn').click()"
        );

        await driver.sleep(1000);

        await driver.get(baseURL + "/proposals");

        await driver.sleep(1000);

        const firstProposalAfter = await driver.findElement(By.className('proposal-row'));

        const showDetailsButton = await firstProposalAfter.findElement(By.id('show-details-proposal'));

        await showDetailsButton.click();

        await driver.sleep(1000);

        const descriptionAfter = await driver.findElement(By.id('description')).getText();

        expect(descriptionAfter).not.toEqual("");

        await doLogout(driver);

    }   , 20000);

    test("Shouldn't update the proposal if type is empty", async ()=>{

        await doLogin("michael.wilson@example.com", "T002", driver);

        await driver.sleep(1000);

        await driver.get(baseURL + "/proposals");

        await driver.sleep(1000);

        const firstProposal = await driver.wait(until.elementLocated(By.className('proposal-row')), 10000);

        const dropdownButton = await firstProposal.findElement(By.css('#dropdown-proposal-actions'));

        expect(await dropdownButton.getText()).toEqual("Actions");

        await dropdownButton.click();

        const dropdownButtonUpdate = await firstProposal.findElement(By.css('#update-proposal-id'));

        expect(await dropdownButtonUpdate.getText()).toEqual("Update");

        await dropdownButtonUpdate.click();

        await driver.sleep(500);

        const typeField = await driver.findElement(By.name('proposal-type'));

        await typeField.clear();

        await driver.sleep(500);

        const saveButton = await driver.findElement(By.css('#add-proposal-btn'));

        expect(await saveButton.getText()).toEqual("Save");

        await driver.executeScript(
            "document.getElementById('add-proposal-btn').click()"
        );

        await driver.sleep(1000);

        await driver.get(baseURL + "/proposals");

        await driver.sleep(1000);

        const firstProposalAfter = await driver.findElement(By.className('proposal-row'));

        const showDetailsButton = await firstProposalAfter.findElement(By.id('show-details-proposal'));

        await showDetailsButton.click();

        await driver.sleep(1000);

        const typeAfter = await driver.findElement(By.id('proposal-type')).getAttribute('value');

        expect(typeAfter).not.toEqual("");

        await doLogout(driver);

    }, 20000);

    test("Shouldn't update the proposal if CdS / Programmes are empty", async ()=>{

        await doLogin("michael.wilson@example.com", "T002", driver);

        await driver.sleep(1000);

        await driver.get(baseURL + "/proposals");

        await driver.sleep(1000);

        const firstProposal = await driver.wait(until.elementLocated(By.className('proposal-row')), 10000);

        const dropdownButton = await firstProposal.findElement(By.css('#dropdown-proposal-actions'));

        expect(await dropdownButton.getText()).toEqual("Actions");

        await dropdownButton.click();

        const dropdownButtonUpdate = await firstProposal.findElement(By.css('#update-proposal-id'));

        expect(await dropdownButtonUpdate.getText()).toEqual("Update");

        await dropdownButtonUpdate.click();

        await driver.sleep(500);

        const proposalProgrammesList = await driver.wait(until.elementLocated(By.id("proposal-programmes-list")), 10000);

        await driver.executeScript("arguments[0].innerHTML = '';", proposalProgrammesList);

        await driver.sleep(500);

        const saveButton = await driver.findElement(By.css('#add-proposal-btn'));

        expect(await saveButton.getText()).toEqual("Save");

        await driver.executeScript(
            "document.getElementById('add-proposal-btn').click()"
        );

        await driver.sleep(1000);

        await driver.get(baseURL + "/proposals");

        await driver.sleep(1000);

        const firstProposalAfter = await driver.findElement(By.className('proposal-row'));

        const showDetailsButton = await firstProposalAfter.findElement(By.id('show-details-proposal'));

        await showDetailsButton.click();

        await driver.sleep(1000);

        const proposalBadge = await driver.wait(until.elementLocated(By.className("proposal-badge")), 10000);

        const textContent = await proposalBadge.getText();

        expect(textContent).not.toEqual("");

        await doLogout(driver);

        }, 20000);

    test("Shouldn't update the proposal if expiration date is empty", async ()=>{

        await doLogin("michael.wilson@example.com", "T002", driver);

        await driver.sleep(1000);

        await driver.get(baseURL + "/proposals");

        await driver.sleep(1000);

        const firstProposal = await driver.wait(until.elementLocated(By.className('proposal-row')), 10000);

        const dropdownButton = await firstProposal.findElement(By.css('#dropdown-proposal-actions'));

        expect(await dropdownButton.getText()).toEqual("Actions");

        await dropdownButton.click();

        const dropdownButtonUpdate = await firstProposal.findElement(By.css('#update-proposal-id'));

        expect(await dropdownButtonUpdate.getText()).toEqual("Update");

        await dropdownButtonUpdate.click();

        await driver.sleep(500);

        const expirationDateField = await driver.findElement(By.id('expiration-date'));

        await expirationDateField.clear();

        await driver.sleep(500);

        const saveButton = await driver.findElement(By.css('#add-proposal-btn'));

        expect(await saveButton.getText()).toEqual("Save");

        await driver.executeScript(
            "document.getElementById('add-proposal-btn').click()"
        );

        await driver.sleep(1000);

        await driver.get(baseURL + "/proposals");

        await driver.sleep(1000);

        const firstProposalAfter = await driver.findElement(By.className('proposal-row'));

        const showDetailsButton = await firstProposalAfter.findElement(By.id('show-details-proposal'));

        await showDetailsButton.click();

        await driver.sleep(1000);

        let expirationDateAfter = await driver.wait(until.elementLocated(By.className("proposal-details-expiration")), 10000).getText();
        expirationDateAfter = expirationDateAfter.substring(12);

        expect(expirationDateAfter).not.toEqual("");

        await doLogout(driver);

    }, 30000);

    test("Shouldn't update the proposal if Keyword are empty", async ()=>{

        await doLogin("michael.wilson@example.com", "T002", driver);

        await driver.sleep(1000);

        await driver.get(baseURL + "/proposals");

        await driver.sleep(1000);

        const firstProposal = await driver.wait(until.elementLocated(By.className('proposal-row')), 10000);

        const dropdownButton = await firstProposal.findElement(By.css('#dropdown-proposal-actions'));

        expect(await dropdownButton.getText()).toEqual("Actions");

        await dropdownButton.click();

        const dropdownButtonUpdate = await firstProposal.findElement(By.css('#update-proposal-id'));

        expect(await dropdownButtonUpdate.getText()).toEqual("Update");

        await dropdownButtonUpdate.click();

        await driver.sleep(1000);

        let buttons;

        while (1) {

            buttons = await driver.findElements(By.className("delete-keyword-btn"));
      
            if (buttons.length > 0) {
              await driver.executeScript("arguments[0].click()", buttons[buttons.length - 1]);
            } else {
              break;
            }
          }

        await driver.sleep(1000);


        const saveButton = await driver.wait(until.elementLocated(By.css('#add-proposal-btn')), 20000);

        expect(await saveButton.getText()).toEqual("Save");

        await driver.executeScript(
            "document.getElementById('add-proposal-btn').click()"
        );

        await driver.sleep(1000);

        await driver.get(baseURL + "/proposals");

        await driver.sleep(1000);

        const firstProposalAfter = await driver.findElement(By.className('proposal-row'));

        const showDetailsButton = await firstProposalAfter.findElement(By.id('show-details-proposal'));

        await showDetailsButton.click();

        await driver.sleep(1000);

        const proposalBadge = await driver.wait(until.elementLocated(By.className("proposal-badge")), 10000);

        const textContent = await proposalBadge.getText();

        expect(textContent).not.toEqual("");

        await doLogout(driver);

        }, 40000);


});

describe("End to end test for archive proposal", () => {

    beforeAll(async () => {
        driver = await new Builder().forBrowser("chrome").build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test("Should show not authorized page if not logged in yet", async () => {
        await driver.get(baseURL + "/proposals/");

        await driver.sleep(500);

        let pageTitle = await driver
            .findElement(By.className("alert-danger"))
            .getText();
        expect(pageTitle).toEqual("Access Not Authorized");

    }, 20000);

    test("Shouldn't show the possibility to archive the proposal if logged as a student", async() =>{

        await doLogin("john.smith@example.com", "S001", driver);
        await driver.sleep(500);

        await driver.get(baseURL + "/proposals");
        await driver.sleep(500);

        let inputValue = await driver.findElement(By.css('#inputValue'));
        expect(inputValue).not.toBe(null);

        await doLogout(driver);

    }, 20000);

    test("Should show the possibility to archive the proposal in the proposals list page", async() =>{
        await doLogin("michael.wilson@example.com", "T002", driver);
        await driver.sleep(500);

        await driver.get(baseURL + "/proposals");
        await driver.sleep(500);

        let dropDownButton = await driver.findElement(By.id('dropdown-proposal-actions'));
        await dropDownButton.click();

        let archiveSelect = await driver.findElement(By.id('archive-proposal-id')).getText();
        expect(archiveSelect).toEqual("Archive");

        await doLogout(driver);
    }, 20000);

    test("Should show the possibility to archive the proposal in the proposals details page", async() =>{
        await doLogin("michael.wilson@example.com", "T002", driver);
        await driver.sleep(500);

        await driver.get(baseURL + "/proposals/P015");
        await driver.sleep(500);

        let archiveSelect = await driver.findElement(By.id('archive-proposal-btn')).getText();
        expect(archiveSelect).toEqual("Archive proposal");

        await doLogout(driver);
    }, 20000);

    test("Should not archive the proposal if click the cancel button (proposals list page)", async() =>{
        await doLogin("michael.wilson@example.com", "T002", driver);
        await driver.sleep(500);

        await driver.get(baseURL + "/proposals");
        await driver.sleep(500);

        let dropDownButton = await driver.findElement(By.id('dropdown-proposal-actions'));
        await dropDownButton.click();

        let archiveSelect = await driver.findElement(By.id('archive-proposal-id'));
        expect(await archiveSelect.getText()).toEqual("Archive");

        await archiveSelect.click();
        await driver.sleep(500);

        let modal = await driver.findElement(By.className('modal-footer'));
        let cancelButton = await modal.findElement(By.className('btn btn-secondary'));
        expect(await cancelButton.getText()).toEqual("Cancel");

        await cancelButton.click();

        await doLogout(driver);
        
    }, 20000);

    test("Should not archive the proposal if click the cancel button (proposal details page)", async() =>{
        await doLogin("michael.wilson@example.com", "T002", driver);
        await driver.sleep(500);

        await driver.get(baseURL + "/proposals/P015");
        await driver.sleep(500);

        let archiveButton = await driver.findElement(By.id('archive-proposal-btn'));
        expect(await archiveButton.getText()).toEqual("Archive proposal");

        await driver.executeScript(
            "document.getElementById('archive-proposal-btn').click()"
        );

        await driver.sleep(500);

        let modal = await driver.findElement(By.className('modal-footer'));
        let cancelButton = await modal.findElement(By.className('btn btn-secondary'));
        expect(await cancelButton.getText()).toEqual("Cancel");

        await cancelButton.click();

        await doLogout(driver);
        
    }, 20000);

    test("Should show a button to go to applications if try to archive a proposal with pending applications", async ()=>{
        await doLogin("michael.wilson@example.com", "T002", driver);
        await driver.sleep(500);

        await driver.get(baseURL + "/proposals/P021");
        await driver.sleep(500);

        let archiveButton = await driver.findElement(By.id('archive-proposal-btn'));
        expect(await archiveButton.getText()).toEqual("Archive proposal");

        await driver.executeScript(
            "document.getElementById('archive-proposal-btn').click()"
        );

        await driver.sleep(500);

        let modal = await driver.findElement(By.className('modal-body'));
        let applicationsButton = await modal.findElement(By.className('btn btn-outline-warning'));
        expect(await applicationsButton.getText()).toEqual("Browse applications");

        await applicationsButton.click();
        await driver.sleep(500);

        let currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toBe(baseURL + "/applications");

        await doLogout(driver);
    }, 20000);

    test("Should archive the proposal", async() =>{
        await doLogin("michael.wilson@example.com", "T002", driver);
        await driver.sleep(500);

        await driver.get(baseURL + "/proposals/P015");
        await driver.sleep(500);

        let archiveButton = await driver.findElement(By.id('archive-proposal-btn'));
        expect(await archiveButton.getText()).toEqual("Archive proposal");

        await driver.executeScript(
            "document.getElementById('archive-proposal-btn').click()"
        );

        await driver.sleep(500);

        let modal = await driver.findElement(By.className('modal-footer'));
        let confirmButton = await modal.findElement(By.className('btn btn-primary'));
        expect(await confirmButton.getText()).toEqual("Archive");

        await confirmButton.click();
        await driver.sleep(500);

        let confirmAlert = await driver.findElement(By.className('fade alert alert-success alert-dismissible show'));
        expect (await confirmAlert.getText()).toEqual("Proposal archived successfully");

        await doLogout(driver);
        
    }, 20000)



});