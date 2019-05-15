'use strict';
import AbstractPage from "./abstract.page";

const locators = {
    loginBtn: '.header-maincontent-actions .header-maincontent-actions-item',
    myAccountMenuBtn: '.dropdown-menu-right span.caption',
    searchField: '#header-search',
    catalogMenuBtn: '.header-mainmenu-list .component-dropdown-mainmenu-link',
};

export default class Header extends AbstractPage {

    constructor() {
        super(locators);
    }

    static getLocators() {
        return locators;
    }

    async hoverMenu() {
        await this._page.waitFor(locators.catalogMenuBtn);
        await this._page.hover(locators.catalogMenuBtn);
    }

    async openLoginModal() {
        await this._page.waitFor(locators.loginBtn);
        await this._page.click(locators.loginBtn);
    }

}