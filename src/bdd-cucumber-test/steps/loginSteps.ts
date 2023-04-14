import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";

import { expect } from "@playwright/test";
import { fixture } from "../../hooks/pageFixture";

setDefaultTimeout(60 * 1000 * 2)

Given('User navigates to the login page', async function () {
    await fixture.page.goto(process.env.BASEURL);
    fixture.logger.info("Navigated to the application")
})

When('User enter the username as {string}', async function (username) {
    await fixture.page.locator("input[name='username']").type(username);
})

When('User enter the password as {string}', async function (password) {
    await fixture.page.locator("input[name='password']").type(password);
})

When('User click on the login button', async function () {
    await fixture.page.locator("button#submit").click();
    await fixture.page.waitForLoadState();
    fixture.logger.info("Waiting for 2 seconds")
    await fixture.page.waitForTimeout(2000);
})

Then('Login should be success and the message displayed on the page should be {string}', async function (message) {
    const successMesssage = await fixture.page.locator("//p[@class='has-text-align-center']");
    await expect(successMesssage).toBeVisible();
    fixture.logger.info("Login success message: " + message);
    expect(successMesssage.textContent()).toEqual(message)
})

When('Login should fail and the message displayed on the page should be {string}', async function (message) {
    const failureMesssage = fixture.page.locator("div#error");
    await expect(failureMesssage).toBeVisible();
    fixture.logger.info("Login failed message: " + message);
    expect(failureMesssage.textContent()).toEqual(message)
})
