"use strict";

const { By, until } = require("selenium-webdriver");

const baseURL = `http://localhost:${process.env.FRONTEND_PORT}`;

module.exports = {    
    doLogin: async (username, password, driver) => {
        await driver.get(baseURL);
    
        await driver.sleep(4000);
    
        // perform login
        const usernameBox = await driver.wait(until.elementLocated(By.id("username")), 20000);
        usernameBox.clear();
        await driver.sleep(500);
        usernameBox.sendKeys(username);
    
        const passwordBox = await driver.wait(until.elementLocated(By.id("password")), 20000);
        passwordBox.clear();
        await driver.sleep(500);
        passwordBox.sendKeys(password);

        await driver.sleep(2000);
    
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

        await driver.sleep(1000);
    
        // click on logout
        const logout = await driver.findElement(By.id("logout-id"));
        await logout.click();
    
        await driver.sleep(1000);
    }
}