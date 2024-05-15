import dotenv from 'dotenv';
dotenv.config();
import puppeteer from 'puppeteer';

//library credentials
const LIBRARY_CARD_NUMBER = process.env.LIBRARY_CARD_NUMBER;
const LIBRARY_CARD_PIN = process.env.LIBRARY_CARD_PIN;

//zoho credentials
const ZOHO_EMAIL = process.env.ZOHO_EMAIL
const ZOHO_PASSWORD = process.env.ZOHO_PASSWORD


const CHECK_FOR_OVERDUE = process.env.CHECK_FOR_OVERDUE
const CHECK_FOR_DUE_SOON = process.env.CHECK_FOR_DUE_SOON
const CHECK_FOR_READY_FOR_PICKUP = process.env.CHECK_FOR_READY_FOR_PICKUP
const CHECK_FOR_IN_TRANSIT = process.env.CHECK_FOR_IN_TRANSIT

//launch the browser
const browser = await puppeteer.launch({ headless: false, args: ['--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36'] });


//open a new page
const page = await browser.newPage();

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

// Submit the form
await page.keyboard.press('Enter');

//wait for page to load
await waitForMultipleElements(page, ".sub-menu-content", 7)

// Get the account information
const titles = await page.$$('.sub-menu-title');
const values = await page.$$('.sub-menu-content');

const data = []

for (let i = 0; i < titles.length; i++) {
    // Get the text content of title and value
    const valueText = await page.evaluate(value => value.textContent, values[i]);
    data.push(valueText)
}

//create an object with data
const accountInfo = {
    overdue: parseInt(data[0]),
    dueSoon: parseInt(data[1]),
    dueLater: parseInt(data[2]),
    readyForPickup: parseInt(data[3]),
    inTransit: parseInt(data[4]),
    activeHolds: parseInt(data[5]),
    inactiveHolds: parseInt(data[6])
}

let notify = false
let message = ""
// check for overdue
if (CHECK_FOR_OVERDUE === "true") {
    if (accountInfo.overdue > 0) {
        notify = true
        message += `You have ${accountInfo.overdue} books overdue. `
    }
}

//check for due soon
if (CHECK_FOR_DUE_SOON === "true") {
    if (accountInfo.dueSoon > 0) {
        notify = true
        message += `You have ${accountInfo.dueSoon} books due soon. `
    }
}

//check for ready for pickup
if (CHECK_FOR_READY_FOR_PICKUP === "true") {
    if (accountInfo.readyForPickup > 0) {
        notify = true
        message += `You have ${accountInfo.readyForPickup} holds ready for pickup. `
    }
}

//check for in transit
if (CHECK_FOR_IN_TRANSIT === "true") {
    if (accountInfo.inTransit > 0) {
        notify = true
        message += `You have ${accountInfo.inTransit} holds in transit. `
    }
}

if (notify) {

}

if (!message){
    message = "look like theres nothing to notify about. You are in good standing at the Toronto Library!"
}

page.goto("https://accounts.zoho.in/signin?servicename=ZohoHome&signupurl=https://www.zoho.com/signup.html")
await page.waitForNavigation({ waitUntil: 'networkidle0' });

//enter email
const zoho_email_input = '#login_id';
await page.waitForSelector(zoho_email_input);
await page.type(zoho_email_input, ZOHO_EMAIL);

// Submit the email
await page.keyboard.press('Enter');
await page.waitForNavigation({ waitUntil: 'networkidle0' });

//enter password
const zoho_password_input = '#password';
await page.waitForSelector(zoho_password_input);
await page.type(zoho_password_input, ZOHO_PASSWORD);

// Submit the password
await page.keyboard.press('Enter');
await page.waitForNavigation({ waitUntil: 'networkidle0' });

// //go to mail
// page.goto("https://mail.zohocloud.ca/zm/#mail/folder/inbox")
// await page.waitForNavigation({ waitUntil: 'networkidle0' });

//compose message
page.goto("https://mail.zohocloud.ca/zm/#compose")
await page.waitForNavigation({ waitUntil: 'networkidle0' });

//get all input components
await page.$$("input[type='text']")

await page.keyboard.type("timwallacedev@gmail.com");
await page.keyboard.press('Tab');
await page.keyboard.press('Tab');
await page.keyboard.type("Toronto Library Notification");
await page.keyboard.press('Tab');

await page.keyboard.type(message);

// Press the 'Control + Shift' to send email
await page.keyboard.down('Control');
await page.keyboard.down('Enter');
await page.keyboard.up('Enter');
await page.keyboard.up('Control');


//close the browser
await browser.close()


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