import Page from './page'
import { spinnerS } from '@components/shared/util/constant'
import {
  defaultAnimationWaitTimer,
  defaultDownloadWaitTimer,
  defaultImagesWaitTimer,
  defaultResponseWaitTimer,
  defaultPresenceWaitTimer,
  defaultSpinnerWaitTimer,
  defaultWaitTimer,
  defaultSpinnerWaitToBePresentTimer,
  defaultAbsenceWaitTimer,
} from '@const/global/timers'
import { waitToBeExceptionMessage } from '@const/global/errors'
import { buildSpecificTempDir } from '@const/global/paths'
import { readDir } from 'src/app/util/writer'
import { LoadEvent, Response } from 'puppeteer'


export default class Waiter extends Page {
  async waitInNodeApp(time = defaultWaitTimer) {
    await new Promise(resolve => setTimeout(resolve, time))
  }

  async waitInBrowser(time = defaultWaitTimer) {
    return this._page.evaluate(`(async (time) => {
      await new Promise(resolve => setTimeout(resolve, time))
    })(${time})`, time)
  }

  async waitForFileToDownload(downloadPath = buildSpecificTempDir,
          timeout = defaultDownloadWaitTimer) {
    let filename
    const times = 10
    for (let i = 0; i < times; i++) {
      if (!filename) {
        filename = readDir(downloadPath)[0]
        await this.waitInNodeApp(timeout)
      } else {
        break
      }
    }
    while (filename && filename.endsWith('.crdownload')) {
      filename = readDir(downloadPath)[0]
      await this.waitInNodeApp(timeout)
    }
    if (!filename) throw new Error(`File not loaded to ${downloadPath} within ${timeout * times} milliseconds.`)
    return filename
  }

  async waitForAnimation(timeout = defaultAnimationWaitTimer) {
    await this.waitInNodeApp(timeout)
  }

  async waitForSpinnerToDisappear(
          presenceTimeout = defaultSpinnerWaitToBePresentTimer,
          absenceTimeout = defaultSpinnerWaitTimer) {
    await this.waitElementToDisappear(spinnerS, presenceTimeout, absenceTimeout)
    await this.waitInNodeApp(presenceTimeout)
  }

  async waitElementPresence(selector: string,
          timeout = defaultPresenceWaitTimer) {
    await this._page.waitFor(
      (selector: string) => document.querySelector(selector),
      { timeout: timeout },
      selector)
  }

  async waitElementToDisappear(selector: string,
          presenceTimeout = defaultPresenceWaitTimer,
          absenceTimeout = defaultAbsenceWaitTimer) {
    try {
      await this.waitElementPresence(selector, presenceTimeout)
    } catch (e) {
      // Expected
    }
    try {
      await this.waitElementAbsence(selector, absenceTimeout)
    } catch (e) {
      throw new Error(`Waiting for "${selector}" to disappear exceeded timeout ${absenceTimeout} milliseconds.`)
    }
  }

  async waitElementAbsence(selector: string,
          timeout = defaultSpinnerWaitTimer) {
    if (this.isXpath(selector)) {
      return this._page.waitFor(
        (selector: string) => !document.evaluate(selector,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null).singleNodeValue,
        { timeout: timeout },
        selector)
    } else {
      return this._page.waitFor(
        (selector: string) => !document.querySelector(selector),
        { timeout: timeout },
        selector)
    }
  }

  async waitForImages(timeout = defaultImagesWaitTimer) {
    const imagesHaveLoaded = () =>
      Array.from(document.images).every((i) => i.complete)
    await this._page.waitForFunction(imagesHaveLoaded, { timeout: timeout })
  }

  async waitFor(selector: string,
          timeout = defaultWaitTimer) {
    if (this.isXpath(selector)) {
      await this.waitForXPath(selector, timeout)
    } else {
      await this.waitForElement(selector, timeout)
    }
    return true
  }

  async waitForXPath(selector: string, timeout = defaultWaitTimer) {
    return this._page.waitForXPath(selector, { timeout: timeout })
  }

  async waitForElement(selector: string, timeout = defaultWaitTimer) {
    return this._page.waitFor(selector, { timeout: timeout })
  }

  async waitToBe(expectedValue: boolean,
          selector: string,
          checkFunction: (selector: string) => boolean | Promise<boolean>,
          timeout = defaultAnimationWaitTimer) {
    const timeLimit = Date.now() + timeout
    while (true) {
      if (Date.now() - timeLimit > 0) {
        throw new Error(
          waitToBeExceptionMessage(selector, timeout, expectedValue))
      }
      const result = await checkFunction.call(this, selector)
      if (result === expectedValue) return
    }
  }

  async waitForTextToBe(text: string, selector: string,
          timeout = defaultWaitTimer) {
    await this._page.waitForFunction(
      (selector, text) =>
        document.querySelector(selector).innerText.includes(text),
      { timeout: timeout },
      selector, text)
  }

  async withNavigationWait(...executables: Array<Promise<any>>) {
    await Promise.all([executables, [this.waitForNavigation()]])
      .catch(e => console.log('withNavigationWait', e))
  }

  async waitForNavigation(loadEvent?: LoadEvent,
          timeout = defaultSpinnerWaitTimer) {
    await this._page.waitForNavigation({
      waitUntil: loadEvent,
      timeout: timeout,
    })
  }

  async waitForRequestURLToContain(text: string, timeout = defaultWaitTimer) {
    return this._page.waitForRequest(request =>
      request.url().includes(text),
    { timeout: timeout })
  }

  async waitForResponseURLToContain(text: string,
          timeout = defaultResponseWaitTimer): Promise<Response> {
    return this._page.waitForResponse(response =>
      response.url().includes(text),
    { timeout: timeout })
  }

  isXpath(selector: string) {
    return selector.startsWith('//')
  }
}
