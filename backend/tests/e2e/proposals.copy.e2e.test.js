const dayjs = require("dayjs");
const { Builder, By, Select } = require("selenium-webdriver");
const app = require("../../app");
const assert = require('assert');

/*
 * Template of a proposal,
 * if you need to change some field, just copy with spread operator:
 * const myReqBody = { ...mockProposalReq, title: "new title" };
 */
let mockOriginalProposal = {
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

let mockCopiedProposal = {
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

const doLogin = async (username, password) => {
    await driver.get(baseURL);

    await driver.sleep(2000);

    // perform login
    const usernameBox = await driver.findElement(By.id("username"));
    usernameBox.clear();
    usernameBox.sendKeys(username);

    const passwordBox = await driver.findElement(By.id("password"));
    passwordBox.clear();
    passwordBox.sendKeys(password);

    // click submit button
    const submitButton = await driver.findElement(By.css("div.ca8d7aabd button"))
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

describe("End to end tests for Copy Proposal", () => {
    beforeAll(async () => {
        driver = await new Builder().forBrowser("chrome").build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test("Click on 'copy proposal' button from the proposals list", async () => {
        await doLogin("michael.wilson@example.com", "T002");

        await driver.get(baseURL + "/proposals");
        await driver.sleep(500);

        let viewProposalPage = await driver.findElement(By.id("show-details-proposal"));
        await viewProposalPage.click();
        await driver.sleep(500);

        /** reading the proposal from the page */

        // Title
        mockOriginalProposal.title = await driver.findElement(By.id("proposal-title")).getText();

        // Supervisor
        mockOriginalProposal.supervisor_id = await driver.findElement(By.id("supervisor")).getAttribute('value');

        // Groups
        let groups = await driver.findElement(By.id("groups"));
        let badgesGroups = await groups.findElements(By.className('badge'));
        for (const group of badgesGroups) {
            mockOriginalProposal.groups.push(await group.getText());
        }

        // Keywords
        let keywords = await driver.findElement(By.className("proposal-details-keyword"));
        let badgesKeywords = await keywords.findElements(By.className('badge'));
        for (const keyword of badgesKeywords) {
            mockOriginalProposal.keywords.push(await keyword.getText());
        }
        
        // Type
        mockOriginalProposal.type = await driver.findElement(By.name("proposal-type")).getAttribute('value');
        
        // Description
        mockOriginalProposal.description = await driver.findElement(By.id("description")).getText();
        
        // Required knowledge
        mockOriginalProposal.required_knowledge = await driver.findElement(By.name("required-knowledge")).getAttribute('value');
        
        // Notes
        mockOriginalProposal.notes = await driver.findElement(By.name("additional-notes")).getAttribute('value');
        
        // Expiration date
        let date = await driver.findElement(By.className("proposal-details-expiration")).getText();
        mockOriginalProposal.expiration_date = date.replace("Expires on ", "");
        
        // Level
        mockOriginalProposal.level = await driver.findElement(By.name("proposal-level")).getText();

        // Programmes
        let programmes = await driver.findElement(By.name("proposal-programmes"));
        let badgesProgrammes = await programmes.findElements(By.className('badge'));
        for (const program of badgesProgrammes) {
            mockOriginalProposal.programmes.push(await program.getText());
        }

        await driver.get(baseURL + "/proposals");
        await driver.sleep(500);


        // Click on actions list
        let actionsList = await driver.findElement(By.id("dropdown-proposal-actions"));
        await actionsList.click();

        // Click on Copy Proposal button
        let copyButton = await driver.findElement(By.id("copy-proposal-id"));
        await copyButton.click();

        await driver.sleep(500);


        /** Taking all data from the proposal page copied */

        // Title
        mockCopiedProposal.title = await driver.findElement(By.name("title")).getAttribute('value');

        // Supervisor
        mockCopiedProposal.supervisor_id = await driver.findElement(By.id("supervisor")).getAttribute('value');

        // Groups
        let listGroups = await driver.findElement(By.id("groups"));
        let itemsGroups = await listGroups.findElements(By.className('list-group-item'));
        for (const group of itemsGroups) {
            mockCopiedProposal.groups.push(await group.getText());
        }

        // Keywords
        keywords = await driver.findElement(By.id("proposal-keywords-list"));
        badgesKeywords = await keywords.findElements(By.className('list-group-item'));
        for (const keyword of badgesKeywords) {
            let keywordFormatted = await keyword.getText();
            mockCopiedProposal.keywords.push(keywordFormatted.split('\n')[0]);
        }
        
        // Type
        mockCopiedProposal.type = await driver.findElement(By.name("proposal-type")).getAttribute('value');
        
        // Description
        mockCopiedProposal.description = await driver.findElement(By.name("description")).getText();
        
        // Required knowledge
        mockCopiedProposal.required_knowledge = await driver.findElement(By.name("required-knowledge")).getAttribute('value');
        
        // Notes
        mockCopiedProposal.notes = await driver.findElement(By.name("additional-notes")).getAttribute('value');
        
        // Expiration date
        date = await driver.findElement(By.id("expiration-date")).getAttribute('value');
        mockCopiedProposal.expiration_date = dayjs(date).format("DD/MM/YYYY");

        // Level
        mockCopiedProposal.level = await driver.findElement(By.name("proposal-level")).getAttribute('value');

        // Programmes
        programmes = await driver.findElement(By.id("proposal-programmes-list"));
        badgesProgrammes = await programmes.findElements(By.className('list-group-item'));
        for (const program of badgesProgrammes) {
            const programFormatted = await program.getText();
            mockCopiedProposal.programmes.push(programFormatted.split(' - ')[0]);
        }

        console.log(mockOriginalProposal);
        console.log(mockCopiedProposal);

        assert(deepEqual(mockOriginalProposal, mockCopiedProposal), "The proposal copied is not the same to the original proposal!");

        await doLogout();
    }, 20000);
});




