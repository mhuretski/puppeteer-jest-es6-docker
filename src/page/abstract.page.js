'use strict';
import {MAIN_PAGE} from '../const/constants';

export default class AbstractPage {

    constructor(locators) {
        this.locators = locators;
    }

    /**
     * @param {Page} page
     */
    setPage(page) {
        this._page = page;
    }

    async open(path = MAIN_PAGE) {
        await this._page.goto(path);
    }

    async getText(selector) {
        await this._page.waitFor(selector);
        return await this._page.$eval(selector, el => el.textContent);
    }

}