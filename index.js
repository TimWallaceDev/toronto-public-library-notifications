import dotenv from 'dotenv';
dotenv.config();
import puppeteer from 'puppeteer';

const LIBRARY_CARD_NUMBER = process.env.LIBRARY_CARD_NUMBER;
const LIBRARY_CARD_PIN = process.env.LIBRARY_CARD_PIN;

console.log("script initiated")
//launch the browser
const browser = await puppeteer.launch({ headless: false });
console.log("browser has been launched")

//open a new page
const page = await browser.newPage();
console.log("new page opened")

//go to the library website
page.goto("https://account.torontopubliclibrary.ca/signin")

// Enter username
const userID = '#userID';
await page.waitForSelector(userID);
await page.type(userID, LIBRARY_CARD_NUMBER);

//enter password
const passwordInput = '#password';
await page.waitForSelector(passwordInput);
await page.type(passwordInput, LIBRARY_CARD_PIN);
console.log("password entered");

// Submit the form
await page.keyboard.press('Enter');

//wait for page to load
await waitForMultipleElements(page, ".sub-menu-content", 7)


// Get the account information
const titles = await page.$$('.sub-menu-title');
const values = await page.$$('.sub-menu-content');

console.log(titles.length, values.length)

for (let i = 0; i < titles.length; i++) {
    // Get the text content of title and value
    const titleText = await page.evaluate(title => title.textContent, titles[i]);
    const valueText = await page.evaluate(value => value.textContent, values[i]);
    console.log("Title: ", titleText.trim(), " : ", valueText.trim());
}

//create an object with data
const accountInfo = {
    overdue: false,
    dueSoon: false,
    dueLater: false,
    readyForPickup: false,
    inTransit: false,
    activeHolds: false,
    inactiveHolds: false
}


//close the browser
// await browser.close()
console.log("all done")


async function waitForMultipleElements(page, className, count) {
    const elements = await page.$$(className);
    if (elements.length >= count) {
        console.log("found all the elements")
        return elements;
    } else {
        await Promise.all([
            page.waitForSelector(className, { state: 'attached', timeout: 0 }),
            new Promise(resolve => setTimeout(resolve, 1000)) // Pause for 1000 milliseconds
        ]);
        return waitForMultipleElements(page, className, count);
    }
}