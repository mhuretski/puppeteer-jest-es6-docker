'use strict';
import puppeteer from "puppeteer";
import {
    debugProps,
    defaultProps,
    viewport
} from "./puppetProperties";
import LoginModal from '../page/login.modal';
import HomePage from '../page/home.page';
import Header from '../page/header';
import Footer from '../page/footer';

export const timeout = process.env.npm_config_debug ? 60000 : 5000;

export let browser;
export let page;

export const pageObjects = {
    header: new Header(),
    footer: new Footer(),
    homePage: new HomePage(),
    loginModal: new LoginModal(),
};

const initPages = page => {
    Object.keys(pageObjects).map(po => pageObjects[po].setPage(page));
};

beforeAll(async () => {
    browser = await puppeteer.launch(process.env.npm_config_debug ? debugProps : defaultProps);
    page = await browser.newPage();
    await page.setViewport(viewport);

    initPages(page);
});

afterAll(() => {
    browser.close();
});