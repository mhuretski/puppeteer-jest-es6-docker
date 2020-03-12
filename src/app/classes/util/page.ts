import { Browser, Page as PuppeteerPage } from 'puppeteer'
import { currentDevice, setDevice, updatePuppeteerPageObjects } from '@actions'
import { defaultViewport } from '@config/puppet.settings'


export default class Page {
  // @ts-ignore
  _page: PuppeteerPage

  // @ts-ignore
  _browser: Browser

  constructor(_page?: PuppeteerPage, _browser?: Browser) {
    if (_page) this._page = _page
    if (_browser) this._browser = _browser
  }

  getPage(): PuppeteerPage {
    return this._page
  }

  setPage(value: PuppeteerPage) {
    this._page = value
  }

  setBrowser(value: Browser) {
    this._browser = value
  }

  set(browser: Browser, page: PuppeteerPage) {
    this.setBrowser(browser)
    this.setPage(page)
  }

  async getURL(): Promise<string> {
    return this._page.url()
  }

  async executeInNewPage(newTargetAction: Function, options: any) {
    // save this to know that this was the opener
    const pageTarget = this._page.target()
    const newTargetActionPromise = newTargetAction.call(this, options)
    // check that you opened this page
    const newTarget = await this._browser.waitForTarget(
      target => target.opener() === pageTarget)
    // get the page object
    const newPage = await newTarget.page()

    await Promise.resolve(newTargetActionPromise)
      .catch(e => console.log('executeInNewPage', e))
    try {
      await this._page.close()
    } finally {
      updatePuppeteerPageObjects(newPage)
      this.setPage(newPage)

      if (currentDevice) {
        await setDevice(currentDevice)
      } else {
        await this._page.setViewport(defaultViewport)
      }
    }
  }

  async isMobile(): Promise<boolean> {
    return this._page.viewport()?.isMobile || false
  }
}
