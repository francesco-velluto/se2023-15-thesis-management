const dayjs = require("dayjs");
const { Builder, By, Select } = require("selenium-webdriver");
const app = require("../../app");
const assert = require('assert');
const { parse } = require("date-fns");
const { format } = require("date-fns");
const { doLogin, doLogout } = require("./utils");

/*
 * Template of a proposal,
 * if you need to change some field, just copy with spread operator:
 * const myReqBody = { ...mockProposalReq, title: "new title" };
 */
const mockProposal = {
    title: "",
    supervisor_id: "",
    keywords: [],
    type: "",
    groups: [],
    description: "",
    required_knowledge: "",
    notes: "",
    expiration_date: "",
    level: "",
    programmes: [],
};

const baseURL = `http://localhost:${process.env.FRONTEND_PORT}`;
let driver;

// it checks if two objects are equal
const deepEqual = (obj1, obj2) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (const key of keys1) {
        const val1 = obj1[key];
        const val2 = obj2[key];

        if (typeof val1 === 'object' && typeof val2 === 'object') {
            if (!deepEqual(val1, val2)) {
                return false;
            }
        } else if (val1 !== val2) {
            return false;
        }
    }

    return true;
};

// it copies the data from the view page of a proposal
const copyFromViewProposalPage = async () => {
    let proposal = JSON.parse(JSON.stringify(mockProposal));

    // Title
    proposal.title = await driver.findElement(By.id("proposal-title")).getAttribute('value');

    // Supervisor
    proposal.supervisor_id = await driver.findElement(By.id("supervisor")).getAttribute('value');

    // Groups
    const groups = await driver.findElement(By.id("groups"));
    const badgesGroups = await groups.findElements(By.className('badge'));
    for (const group of badgesGroups) {
        proposal.groups.push(await group.getText());
    }

    // Keywords
    const keywords = await driver.findElement(By.className("proposal-details-keyword"));
    const badgesKeywords = await keywords.findElements(By.className('badge'));
    for (const keyword of badgesKeywords) {
        proposal.keywords.push(await keyword.getText());
    }

    // Type
    proposal.type = await driver.findElement(By.name("proposal-type")).getAttribute('value');

    // Description
    proposal.description = await driver.findElement(By.id("description")).getText();

    // Required knowledge
    proposal.required_knowledge = await driver.findElement(By.name("required-knowledge")).getAttribute('value');

    // Notes
    proposal.notes = await driver.findElement(By.name("additional-notes")).getAttribute('value');

    // Expiration date
    let date = await driver.findElement(By.className("proposal-details-expiration")).getText();
    proposal.expiration_date = date.replace("Expires on ", "");
    const parsedDate = parse(proposal.expiration_date, 'dd/MM/yyyy', new Date());
    proposal.expiration_date = format(parsedDate, 'yyyy-MM-dd');

    // Level
    proposal.level = await driver.findElement(By.name("proposal-level")).getText();

    // Programmes
    const programmes = await driver.findElement(By.name("proposal-programmes"));
    const badgesProgrammes = await programmes.findElements(By.className('badge'));
    for (const program of badgesProgrammes) {
        proposal.programmes.push(await program.getText());
    }

    return proposal;
};

// it copies the data from an editing proposal page
const copyFromCopiedProposalPage = async () => {
    let proposal = JSON.parse(JSON.stringify(mockProposal));

    // Title
    proposal.title = await driver.findElement(By.name("title")).getAttribute('value');

    // Supervisor
    proposal.supervisor_id = await driver.findElement(By.id("supervisor")).getAttribute('value');

    // Groups
    const listGroups = await driver.findElement(By.id("groups"));
    let itemsGroups = await listGroups.findElements(By.className('list-group-item'));
    for (const groupItem of itemsGroups) {
        const group = await groupItem.getText();
        proposal.groups.push(group);
    }

    // Keywords
    const keywords = await driver.findElement(By.id("proposal-keywords-list"));
    const badgesKeywords = await keywords.findElements(By.className('list-group-item'));
    for (const keyword of badgesKeywords) {
        let keywordFormatted = await keyword.getText();
        proposal.keywords.push(keywordFormatted.split('\n')[0]);
    }

    // Type
    proposal.type = await driver.findElement(By.name("proposal-type")).getAttribute('value');

    // Description
    proposal.description = await driver.findElement(By.name("description")).getText();

    // Required knowledge
    proposal.required_knowledge = await driver.findElement(By.name("required-knowledge")).getAttribute('value');

    // Notes
    proposal.notes = await driver.findElement(By.name("additional-notes")).getAttribute('value');

    // Expiration date
    const date = await driver.findElement(By.id("expiration-date")).getAttribute('value');
    proposal.expiration_date = dayjs(date).format("YYYY-MM-DD");

    // Level
    proposal.level = await driver.findElement(By.name("proposal-level")).getAttribute('value');

    // Programmes
    const programmes = await driver.findElement(By.id("proposal-programmes-list"));
    const badgesProgrammes = await programmes.findElements(By.className('list-group-item'));
    for (const program of badgesProgrammes) {
        const programFormatted = await program.getText();
        proposal.programmes.push(programFormatted.split(' - ')[0]);
    }

    return proposal;
};

// it fills all fields of a proposal
const fillProposalForm = async (proposal) => {
    // Title
    const title = await driver.findElement(By.name("title"));
    title.clear();
    title.sendKeys(proposal.title);

    // Description
    const description = await driver.findElement(By.name("description"));
    description.clear();
    description.sendKeys(proposal.description);

    // Level
    let selectElement = await driver.findElement(By.name("proposal-level"));
    let select = new Select(selectElement);
    await select.selectByVisibleText(proposal.level);

    // Programmes
    for (const programme of proposal.programmes) {
        const selectElement = await driver.findElement(By.name("proposal-programmes"));
        const select = new Select(selectElement);
        await select.selectByVisibleText(programme);
        await driver.sleep(200);
    }

    // Type
    const type = await driver.findElement(By.name("proposal-type"));
    type.clear();
    type.sendKeys(proposal.type);

    // Expiration date
    /*const date = await driver.findElement(By.id("expiration-date"));
    //await date.clear();
    await driver.executeScript("arguments[0].scrollIntoView();", date);

    driver.sleep(1000);
    await date.click();
    await date.sendKeys(proposal.expiration_date, Key.RETURN);
    console.log(await date.getAttribute('value'));

    await driver.executeScript((element, value) => {
        element.value = value;
        const event = new Event('input', { bubbles: true });
        element.dispatchEvent(event);
    }, date, proposal.expiration_date);*/

    // Keywords
    const listItems = await driver.findElement(By.id('proposal-keywords-list'));
    let items = await listItems.findElements(By.className('list-group-item'));
    while (items?.length > 0) {
        items = await listItems.findElements(By.className('list-group-item'));
        if (items.length === 0) break;

        const deleteButton = await items[0].findElement(By.className('btn btn-danger btn-sm'));
        await driver.executeScript("arguments[0].scrollIntoView();", deleteButton);
        await driver.executeScript("arguments[0].click();", deleteButton);
    }
    for (const keyword of proposal.keywords) {
        await driver.findElement(By.name("proposal-keywords")).sendKeys(keyword);

        // simulate click with js
        await driver.executeScript(
            "document.getElementById('add-keyword-btn').click()"
        );
    }

    // Required knowledge
    const knowledge = await driver.findElement(By.name("required-knowledge"));
    knowledge.clear();
    knowledge.sendKeys(proposal.required_knowledge);

    // Notes
    const notes = await driver.findElement(By.name("additional-notes"));
    notes.clear();
    notes.sendKeys(proposal.notes);
};

const emptyProposalForm = async () => {
    // Title
    const title = await driver.findElement(By.name("title"));
    title.clear();
    title.sendKeys(' ');

    // Description
    const description = await driver.findElement(By.name("description"));
    description.clear();
    description.sendKeys(' ');

    // Level
    let selectElement = await driver.findElement(By.name("proposal-level"));
    let select = new Select(selectElement);
    await select.selectByIndex(1);
    await select.selectByIndex(2);

    // Type
    const type = await driver.findElement(By.name("proposal-type"));
    type.clear();
    type.sendKeys(' ');

    // Expiration date
    const date = await driver.findElement(By.id("expiration-date"));
    await date.clear();

    // Keywords
    const listItems = await driver.findElement(By.id('proposal-keywords-list'));
    let items = await listItems.findElements(By.className('list-group-item'));
    while (items?.length > 0) {
        items = await listItems.findElements(By.className('list-group-item'));
        if (items.length === 0) break;

        const deleteButton = await items[0].findElement(By.className('btn btn-danger btn-sm'));
        await driver.executeScript("arguments[0].scrollIntoView();", deleteButton);
        await driver.executeScript("arguments[0].click();", deleteButton);
    }

    // Required knowledge
    const knowledge = await driver.findElement(By.name("required-knowledge"));
    knowledge.clear();
    knowledge.sendKeys(' ');

    // Notes
    const notes = await driver.findElement(By.name("additional-notes"));
    notes.clear();
    notes.sendKeys(' ');
};

describe("End to end tests for Copy Proposal", () => {
    beforeAll(async () => {
        driver = await new Builder().forBrowser("chrome").build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test("Should show (or redirect to) not authorized page if not logged in yet", async () => {
        await driver.get(baseURL + "/proposals/P002/copy");

        const alert = await driver.findElement(By.className("alert"));

        // Find the h3 element within the div
        const h3Alert = await alert.findElement(By.css("h3"));

        const textAlert = await h3Alert.getText();
        expect(textAlert).toEqual("Access Not Authorized");
    }, 20000);

    test("Click on 'copy proposal' button from the proposals list", async () => {
        await doLogin("michael.wilson@example.com", "T002", driver);

        await driver.get(baseURL + "/proposals");
        await driver.sleep(500);

        let viewProposalPage = await driver.findElement(By.id("show-details-proposal"));
        await viewProposalPage.click();
        await driver.sleep(500);

        // Reading the proposal from the page
        const originalProposal = await copyFromViewProposalPage();

        await driver.get(baseURL + "/proposals");
        await driver.sleep(500);

        // Click on actions list
        let actionsList = await driver.findElement(By.id("dropdown-proposal-actions"));
        await actionsList.click();

        // Click on Copy Proposal button
        let copyButton = await driver.findElement(By.id("copy-proposal-id"));
        await copyButton.click();

        await driver.sleep(500);

        // Taking all data from the proposal page copied
        const copiedProposal = await copyFromCopiedProposalPage();

        await doLogout(driver);

        assert(deepEqual(originalProposal, copiedProposal), "The proposal copied is not the same to the original proposal!");
    }, 20000);

    test("Try to modify the fields of a proposal and checks if they are changed", async () => {
        await doLogin("michael.wilson@example.com", "T002", driver);

        await driver.get(baseURL + "/proposals");
        await driver.sleep(500);

        // Click on actions list
        let actionsList = await driver.findElement(By.id("dropdown-proposal-actions"));
        await actionsList.click();

        // Click on Copy Proposal button
        let copyButton = await driver.findElement(By.id("copy-proposal-id"));
        await copyButton.click();

        await driver.sleep(500);

        // Taking all data from the proposal page copied
        let copiedProposal = JSON.parse(JSON.stringify(mockProposal));
        copiedProposal.title = "Hello, this is a test";
        copiedProposal.keywords = ["key_1", "key 2", "key 3"];
        copiedProposal.type = "This is a new type";
        copiedProposal.description = "This is a new test description";
        copiedProposal.required_knowledge = "These are the requirements: 1. requirement 1; 2. requirement 2;";
        copiedProposal.notes = "Any notes";
        copiedProposal.expiration_date = "2024-06-30";
        copiedProposal.level = "Bachelor";
        copiedProposal.programmes = ["Bachelor of Science", "Bachelor of Business"];

        copiedProposal.groups = ["G002"];
        copiedProposal.supervisor_id = "Michael Wilson";

        await fillProposalForm(copiedProposal);

        // Click on add proposal
        await driver.sleep(500);
        await driver.executeScript("document.getElementById('add-proposal-btn').click()");
        await driver.sleep(1000);

        // Check if the save message is present
        let alert;
        try {
            alert = await driver.findElement(By.className('fade alert alert-success alert-dismissible show'));
        } catch (e) { }

        expect(alert !== undefined).toEqual(true);
        expect(await alert.getText()).toEqual("The thesis proposal has been added correctly!");

        // Copy the data from the view proposal page
        const resultSavedCopiedProposal = await copyFromViewProposalPage();

        await doLogout(driver);

        assert(deepEqual(copiedProposal, resultSavedCopiedProposal), "The modified proposal is not the same to the proposal saved!");
    }, 30000);

    test("Should not allow to save an empty proposal", async () => {
        await doLogin("michael.wilson@example.com", "T002", driver);

        await driver.get(baseURL + "/proposals");
        await driver.sleep(500);

        // Click on actions list
        let actionsList = await driver.findElement(By.id("dropdown-proposal-actions"));
        await actionsList.click();

        // Click on Copy Proposal button
        let copyButton = await driver.findElement(By.id("copy-proposal-id"));
        await copyButton.click();

        // Emptying the proposal fields
        await driver.sleep(500);
        await emptyProposalForm();

        // click on add proposal
        await driver.executeScript("document.getElementById('add-proposal-btn').click()");
        await driver.sleep(1000);

        let alert;
        try {
            alert = await driver.findElement(By.className("fade alert alert-danger alert-dismissible show"));
        } catch (e) { }

        await doLogout(driver);

        expect(alert !== undefined).toEqual(true);
    }, 20000);

    test("Should not allow to save a proposal with an empty title", async () => {
        await doLogin("michael.wilson@example.com", "T002", driver);

        await driver.get(baseURL + "/proposals");
        await driver.sleep(500);

        // Click on actions list
        let actionsList = await driver.findElement(By.id("dropdown-proposal-actions"));
        await actionsList.click();

        // Click on Copy Proposal button
        let copyButton = await driver.findElement(By.id("copy-proposal-id"));
        await copyButton.click();

        // Emptying the proposal title
        await driver.sleep(500);
        const title = await driver.findElement(By.name("title"));
        title.clear();
        title.sendKeys(' ');

        // click on add proposal
        await driver.sleep(1000);
        await driver.executeScript("document.getElementById('add-proposal-btn').click()");
        await driver.sleep(1000);

        let alert;
        try {
            alert = await driver.findElement(By.className("fade alert alert-danger alert-dismissible show"));
        } catch (e) { }

        await doLogout(driver);

        expect(alert !== undefined).toEqual(true);
    }, 20000);
});