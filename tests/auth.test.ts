import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import puppeteer, { Browser, Page } from 'puppeteer';
import MailosaurClient from 'mailosaur';
import dotenv from 'dotenv';

dotenv.config();

const apiKey: string | undefined = process.env.MAILOSAUR_API_KEY;
const serverId: string | undefined = process.env.MAILOSAUR_SERVER_ID;
const mailosaurMail: string | undefined = process.env.MAILOSAUR_TEST_EMAIL;

// Assurez-vous que apiKey, serverId, et mailosaurMail ne sont pas undefined
if (!apiKey || !serverId || !mailosaurMail) {
  throw new Error('Required environment variables are not set');
}

const mailosaur = new MailosaurClient(apiKey);

let browser: Browser;
let page: Page;

beforeAll(async () => {
  browser = await puppeteer.launch({ headless: false });
  page = await browser.newPage();
});

afterAll(async () => {
  await browser.close();
});

describe('User login via magic link', () => {
  it('should login the user using the magic link', async () => {
    await page.goto('http://localhost:3000/login');

    await page.click('#email');
    await page.type('#email', mailosaurMail);
    await page.click('input[type="submit"]');

    await new Promise(resolve => setTimeout(resolve, 10000));

    const criteria = { sentTo: mailosaurMail };
    const options = {
      receivedAfter: new Date(new Date().getTime() - 6 * 60 * 60 * 1000),  //6 dernières heures
    };
    const email = await mailosaur.messages.get(serverId, criteria, options);
    const magicLink = email.html?.links?.[0]?.href;

    if (!magicLink) {
      throw new Error('No magic link found in the email');
    }

    await page.goto(magicLink);

    expect(page.url()).toContain('/confirm?code=');

    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    expect(page.url()).toBe('http://localhost:3000/');
  }, 60000);
});
