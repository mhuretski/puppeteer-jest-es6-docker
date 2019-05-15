'use strict';
import { page, timeout} from '../src/config/jestProps'

describe("Login flow", () => {
    test("user can navigate to page", async () => {
        await page.goto("http://example.devs/");
    }, timeout);
    test('login modal is opened', async () => {
        let loginBtn = '.header-maincontent-actions .header-maincontent-actions-item';
        await page.waitFor(loginBtn);
        await page.click(loginBtn);

        let authorizationTitle = '.root .card-login-title';
        await page.waitFor(authorizationTitle);
        let value = await page.$eval(authorizationTitle, title => title.textContent);

        // await page.screenshot({path: 'result/buddy-screenshot.png'});

        expect(value).toEqual('Authorization');
    }, timeout);
});