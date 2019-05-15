'use strict';
import AbstractPage from "./abstract.page";
import {
    defaultLoginValue,
    defaultPasswordValue
} from '../const/constants';

const locators = {
    emailField: '#inputFieldLabelEmailLogin',
    passField: '#inputFieldLabelPasswordLogin',
    loginSubmitBtn: ".card-login-subcontent button[type='button']",
    authorizationTitle: '.root .card-login-title',
};

export default class LoginModal extends AbstractPage {

    constructor() {
        super(locators);
    }

    async typeLogin(text = defaultLoginValue) {
        await this._page.waitFor(locators.emailField);
        await this._page.type(locators.emailField, text);
    }

    async typePassword(text = defaultPasswordValue) {
        await this._page.waitFor(locators.passField);
        await this._page.type(locators.passField, text);
    }

    async submit() {
        await this._page.waitFor(locators.loginSubmitBtn);
        await this._page.click(locators.loginSubmitBtn);
    }

}