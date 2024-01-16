const dayjs = require("dayjs");
const { Builder, By, Select, Button, until } = require("selenium-webdriver");
const app = require("../../app");
const { doLogin, doLogout } = require("./utils");
const path = require("path");


const baseURL = `http://localhost:${process.env.FRONTEND_PORT}`;
const pdfTestPath = "./uploads/PROVA.pdf";
let driver;

describe("End to end test for applicant CV (student part)", () =>{

    const deletePrecedentApplication = async (driver) =>{
        //login as professor Michael Wilson
        await doLogin("michael.wilson@example.com", "T002", driver);
        await driver.sleep(200);
    
        //go to the application to reject
        await driver.get(baseURL + "/applications/5");
        await driver.sleep(200);
    
        // click reject button
        let rejectButton = await driver.findElement(By.css("#reject-application"));
        await driver.sleep(200);
        await driver.executeScript("arguments[0].click();", rejectButton);
        await driver.sleep(200);
    
        // click reject button
        let confirmRejectionButton = await driver.findElement(By.css("#confirm-reject-application"));
        await driver.sleep(200);
        await driver.executeScript("arguments[0].click();", confirmRejectionButton);
        await driver.sleep(200);
    
        //logout
        await doLogout(driver);
    
    
    };

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

    test("Shouldn't apply to a proposal if already applied", async () =>{
        await doLogin("john.smith@example.com", "S001", driver);

        await driver.get(baseURL + "/proposals");

        await driver.sleep(500);
        let showDetailsButton = await driver.findElement(By.className("show-details-button"));

        await showDetailsButton.click();
        await driver.sleep(200);

        let applyButton = await driver.findElement(By.css("#apply-button"));
        
        let disabledProp = await applyButton.getAttribute("disabled");
        expect(disabledProp).toBe("true");
        await driver.sleep(200);

        await doLogout(driver);
    }, 20000);

    test("Should show the apply popup and do not upload the file if there is no filename", async() =>{

        //reject the pending application of studentofpolito
        await deletePrecedentApplication(driver);

        //login
        await doLogin("studentofpolito@gmail.com", "S011", driver);

        //go to the proposal to apply to
        await driver.get(baseURL + "/proposals/P029");
        await driver.sleep(200);

        let applyButton = await driver.findElement(By.css("#apply-button"));
        expect(await applyButton.getText()).toEqual("Apply");

        await driver.executeScript(
            "document.getElementById('apply-button').click()"
        );
        await driver.sleep(200);

        //modal form
        let modalHeader = await driver.findElement(By.className("modal-title"));
        expect(await modalHeader.getText()).toEqual("Add a PDF file (optional)");

        //insert the file
        let fileInput = driver.findElement(By.css('input[type="file"]'));
        const myFile = await path.resolve(pdfTestPath);

        await fileInput.sendKeys(myFile);
        await driver.sleep(200);

        let inputDivMessage = await driver.findElement(By.className("upload-message"));
        expect(await inputDivMessage.getText()).toEqual("File dropped. Click \"Upload\" to proceed.");
        await driver.sleep(200);

        //apply button disabled
        let uploadButton = await driver.findElement(By.css("#upload-button"));
        expect(await uploadButton.getText()).toEqual("Upload");
        await driver.sleep(200);

        expect(await uploadButton.getAttribute('disabled')).toBe("true");
        await driver.sleep(200);

        await doLogout(driver);

   
    }, 50000);

    test("Should show the apply popup and do not upload the file if there is no file", async() =>{
        //login
        await doLogin("studentofpolito@gmail.com", "S011", driver);

        //go to proposal to apply to
        await driver.get(baseURL + "/proposals/P029");
        await driver.sleep(200);

        //click the apply button
        let applyButton = await driver.findElement(By.css("#apply-button"));
        expect(await applyButton.getText()).toEqual("Apply");

        await driver.executeScript(
            "document.getElementById('apply-button').click()"
        );
        await driver.sleep(200);

        //modal form
        let modalHeader = await driver.findElement(By.className("modal-title"));
        expect(await modalHeader.getText()).toEqual("Add a PDF file (optional)");

        //textbox filename
        let fileTextbox = driver.findElement(By.css('#filename'));
        await fileTextbox.sendKeys("Test");
        await driver.sleep(200);

        //upload button disabled
        let uploadButton = await driver.findElement(By.css("#upload-button"));
        expect(await uploadButton.getText()).toEqual("Upload");

        expect(await uploadButton.getAttribute('disabled')).toBe("true");

        await doLogout(driver);

   
    }, 20000);

    test("Should delete the file selected end clear the textbox if the trash icon is clicked", async() =>{
        //login
        await doLogin("studentofpolito@gmail.com", "S011", driver);

        //go to the proposal to apply to
        await driver.get(baseURL + "/proposals/P001");
        await driver.sleep(200);

        //click the apply button
        let applyButton = await driver.findElement(By.css("#apply-button"));
        expect(await applyButton.getText()).toEqual("Apply");

        await driver.executeScript(
            "document.getElementById('apply-button').click()"
        );
        await driver.sleep(200);

        //modal form
        let modalHeader = await driver.findElement(By.className("modal-title"));
        expect(await modalHeader.getText()).toEqual("Add a PDF file (optional)");

        // fill the textbox
        let fileTextbox = await driver.findElement(By.css('#filename'));
        await fileTextbox.sendKeys("Test");
        await driver.sleep(200);

        // enter the file
        let fileInput = driver.findElement(By.css('input[type="file"]'));
        const myFile = await path.resolve(pdfTestPath);
        await fileInput.sendKeys(myFile);
        await driver.sleep(200);

        // take the trash icon and click it
        let trashIcon = await driver.findElement(By.css("#reset-button"));
        await trashIcon.click();
        await driver.sleep(200);

        //upload button disabled
        let uploadButton = await driver.findElement(By.css("#upload-button"));
        expect(await uploadButton.getText()).toEqual("Upload");

        expect(await uploadButton.getAttribute('disabled')).toBe("true");

        await doLogout(driver);

   
    }, 20000);

    test("Should insert the cv correctly", async() =>{
        //login
        await doLogin("studentofpolito@gmail.com", "S011", driver);

        //go to the proposal to apply to
        await driver.get(baseURL + "/proposals/P001");
        await driver.sleep(200);

        //click the apply button
        let applyButton = await driver.findElement(By.css("#apply-button"));
        expect(await applyButton.getText()).toEqual("Apply");

        await driver.executeScript(
            "document.getElementById('apply-button').click()"
        );
        await driver.sleep(200);

        let modalHeader = await driver.findElement(By.className("modal-title"));
        expect(await modalHeader.getText()).toEqual("Add a PDF file (optional)");

        // fill the textbox
        let fileTextbox = await driver.findElement(By.css('#filename'));
        await fileTextbox.sendKeys("Test");
        await driver.sleep(200);

        // enter the file
        let fileInput = driver.findElement(By.css('input[type="file"]'));
        const myFile = await path.resolve(pdfTestPath);
        await fileInput.sendKeys(myFile);
        await driver.sleep(200);

        //click the upload button to effetively upload the file
        let uploadButton = await driver.findElement(By.css("#upload-button"));
        expect(await uploadButton.getText()).toEqual("Upload");

        await driver.executeScript(
            "document.getElementById('upload-button').click()"
        );
        await driver.sleep(2000);

        /*//details link
        let detailsLink = await driver.findElement(By.className("resume-link"));
        expect(await detailsLink.getText()).toEqual("See preview");
        await driver.sleep(200)

        //confirm application button
        let confirmButton = await driver.findElement(By.css("#confirm-application"));
        expect(await confirmButton.getText()).toBe("Confirm");

        await driver.executeScript(
            "document.getElementById('confirm-application').click()"
        );
        await driver.sleep(200);*/


        //await doLogout(driver);

   
    }, 30000);



});

describe("End to end test for applicant cv (teacher part)", () =>{
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

    test("Should see the career of a student and his CV if go to the details of his application", async () =>{
        
        //login
        await doLogin("michael.wilson@example.com", "T002", driver);
        driver.sleep(200);
        
        //go to applications details
        await driver.get(baseURL + "/applications/1");
        await driver.sleep(200);

        //carrer button
        let careerButton = await driver.findElement(By.css("#career-button"));
        expect(await careerButton.getText()).toBe("Student's Career");

        await driver.executeScript(
            "document.getElementById('career-button').click()"
        );
        await driver.sleep(200);

        //modal title
        let modalTitle = await driver.findElement(By.className("modal-title"));
        expect(await modalTitle.getText()).toEqual("Student's Career");

        //close modal button
        let closeButton = await driver.findElement(By.css("#hide-career-modal"));
        expect(await closeButton.getText()).toEqual("Close");

        await driver.executeScript(
            "document.getElementById('hide-career-modal').click()"
        );
        await driver.sleep(200);

        const actualWindow = await driver.getWindowHandle();

        //preview pdf
        let previewLink = await driver.findElement(By.className("resume-link"));
        expect(await previewLink.getText()).toEqual("See preview");

        await previewLink.click();
        driver.sleep(200);

        //check the new window opened
        const allWindows = await driver.getAllWindowHandles();
        expect(allWindows.length).toBe(2);


        for (const handle of allWindows) {
            if (handle !== actualWindow) {
              await driver.switchTo().window(handle);
              break;
            }
        }

        let actualURL = await driver.getCurrentUrl();
        expect(actualURL).toEqual("http://localhost:3000/applications/file/1");


    }, 30000)
})