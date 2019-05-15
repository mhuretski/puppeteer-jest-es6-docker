'use strict';
import {
    timeout,
    pageObjects as po,
} from '../src/config/jestProps';
import Header from '../src/page/header';

describe("Login flow in PO", () => {
    test("user can navigate to page", async () => {
        await po.homePage.open();
    }, timeout);
    test('login modal is opened', async () => {
        await po.header.openLoginModal();
        let elemText = await po.loginModal.getText(po.loginModal.locators.authorizationTitle);
        expect(elemText).toEqual('Authorization');
    }, timeout);
    test("user is logged in", async () => {
        await po.loginModal.typeLogin();
        await po.loginModal.typePassword();
        await po.loginModal.submit();
        let elemText = await po.header.getText(Header.getLocators().myAccountMenuBtn);
        expect(elemText).toEqual('My account');
    }, timeout);
});