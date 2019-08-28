'use strict'
import { Page as PuppeteerPage } from 'puppeteer'
import { desktopUserAgent } from '@config/devices/device.settings'

export default class Page {
  // @ts-ignore
  _page: PuppeteerPage

  getPage(): PuppeteerPage {
    return this._page
  }

  setPage(value: PuppeteerPage) {
    this._page = value
  }

  constructor(_page?:PuppeteerPage) {
    if (_page) this._page = _page
  }

  async isMobile(): Promise<boolean> {
    const userAgent = await this._page.evaluate(() => navigator.userAgent)
    return !(userAgent === desktopUserAgent)
  }
}
