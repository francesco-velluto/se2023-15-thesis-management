"use strict";

const { By } = require("selenium-webdriver");

const baseURL = `http://localhost:${process.env.FRONTEND_PORT}`;

module.exports = {    
    doLogin: async (username, password, driver) => {
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
        const submitButton = await driver.findElement(By.css("div.cdc80f5fa button"))
        await submitButton.click();
    
        await driver.sleep(500);
    },
    
    doLogout: async (driver) => {
        await driver.get(baseURL);
        await driver.sleep(1000);
    
        // click on the drop menu
        const logoutDropdown = await driver.findElement(By.id("dropdown-basic"));
        await logoutDropdown.click();
    
        // click on logout
        const logout = await driver.findElement(By.id("logout-id"));
        await logout.click();
    
        await driver.sleep(1000);
    }
}