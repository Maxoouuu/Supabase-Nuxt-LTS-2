import { describe, it, expect, beforeAll, afterAll } from "vitest";
import puppeteer from "puppeteer";
import MailosaurClient from "mailosaur";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.MAILOSAUR_API_KEY;
const serverId = process.env.MAILOSAUR_SERVER_ID;
const mailosaurMail = process.env.MAILOSAUR_TEST_EMAIL;

const mailosaur = new MailosaurClient(apiKey);

let browser;
let page;

// Utilisez beforeAll et afterAll si vous utilisez Vitest.
beforeAll(async () => {
  browser = await puppeteer.launch({ headless: "new" });
  page = await browser.newPage();
});

afterAll(async () => {
  await browser.close();
});

// Utilisez describe pour regrouper les tests si nécessaire.
describe("User login via magic link", () => {
  it("should login the user using the magic link", async () => {
    await page.goto("http://localhost:3000/login");

    await page.click("#email");
    await page.type("#email", mailosaurMail);
    await page.click('input[type="submit"]');

    await new Promise((resolve) => setTimeout(resolve, 10000));

    const criteria = { sentTo: mailosaurMail };
    const options = {
      receivedAfter: new Date(new Date().getTime() - 6 * 60 * 60 * 1000),  //6 dernières heures
    };
    const email = await mailosaur.messages.get(serverId, criteria, options);
    const magicLink = email.html.links[0].href;

    await page.goto(magicLink);

    expect(page.url()).toContain("/confirm?code=");

    await page.waitForNavigation({ waitUntil: "networkidle0" });

    expect(page.url()).toBe("http://localhost:3000/");
  }, 30000);
});
