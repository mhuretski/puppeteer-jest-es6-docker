'use strict'
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

  async waitForAnimation() {
    await this.waitInNodeApp(defaultAnimationWaitTimer)
  }

  async waitForSpinnerToDisappear(
          presenceTimeout = defaultSpinnerWaitToBePresentTimer,
          absenceTimeout = defaultSpinnerWaitTimer) {
    await this.waitElementToDisappear(spinnerS, presenceTimeout, absenceTimeout)
    await this.waitInNodeApp(presenceTimeout)
  }

  async waitElementPresence(element: string,
          timeout = defaultPresenceWaitTimer) {
    await this._page.waitFor(
      (selector: string) => document.querySelector(selector),
      { timeout: timeout },
      element)
  }

  async waitElementToDisappear(element: string,
          presenceTimeout = defaultPresenceWaitTimer,
          absenceTimeout = defaultAbsenceWaitTimer) {
    try {
      await this.waitElementPresence(element, presenceTimeout)
    } catch (e) {
      // Expected
    }
    try {
      await this.waitElementAbsence(element, absenceTimeout)
    } catch (e) {
      throw new Error(`Waiting for "${element}" to disappear exceeded timeout ${absenceTimeout} milliseconds.`)
    }
  }

  async waitElementAbsence(element: string, timeout = defaultSpinnerWaitTimer) {
    return this._page.waitFor(
      (selector: string) => !document.querySelector(selector),
      { timeout: timeout },
      element)
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

  async waitToBeInvisible(selector: string,
          timeout = defaultAnimationWaitTimer) {
    return this.waitToBe(false,
      selector,
      this.isVisible,
      timeout)
  }

  async waitToBeVisible(selector: string,
          timeout = defaultAnimationWaitTimer) {
    return this.waitToBe(true,
      selector,
      this.isVisible,
      timeout)
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

  async isVisibleWithAnimationTimer(selector: string): Promise<boolean> {
    await this.waitForAnimation()
    return this.isVisible(selector)
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

  async isInvisible(selector: string): Promise<boolean> {
    return !(await this.isVisible(selector))
  }

  async isVisible(selector: string): Promise<boolean> {
    return this._page.evaluate(({ selector }) => {
      const existsAtPosition =
        (position: { x: number, y: number }) => {
          let pointContainer: any =
            document.elementFromPoint(position.x, position.y)
          do {
            if (pointContainer === elem) {
              return true
            }
            pointContainer = pointContainer.parentNode
          } while (pointContainer)
        }
      const positionOffsetPercent = (x: number, y: number) => {
        return {
          x: elemBounds.x + elemOffsets.x * x,
          y: elemBounds.y + elemOffsets.y * y,
        }
      }

      const elem: HTMLElement = document.querySelector(selector)
      if (!(elem instanceof Element)) {
        return false
      }
      const style = getComputedStyle(elem)
      if (style) {
        if (style.display === 'none') {
          return false
        }
        if (style.visibility !== 'visible') {
          return false
        }
        if (style.opacity && parseFloat(style.opacity) < 0.1) {
          return false
        }
      }
      if (elem.offsetWidth + elem.offsetHeight +
        elem.getBoundingClientRect().height +
        elem.getBoundingClientRect().width === 0) {
        return false
      }
      const elemBounds = {
        x: elem.getBoundingClientRect().left,
        y: elem.getBoundingClientRect().top,
      }
      const elemOffsets = {
        x: elem.offsetWidth,
        y: elem.offsetHeight,
      }
      const elemCenter = positionOffsetPercent(0.5, 0.5)
      if (elemCenter.x < 0) {
        return false
      }
      if (elemCenter.x > (document.documentElement.clientWidth ||
        window.innerWidth)) {
        return false
      }
      if (elemCenter.y < 0) {
        return false
      }
      if (elemCenter.y > (document.documentElement.clientHeight ||
        window.innerHeight)) {
        return false
      }
      let exists = existsAtPosition(elemCenter)
      if (exists) return exists
      exists = existsAtPosition(positionOffsetPercent(0.75, 0.75))
      if (exists) return exists
      exists = existsAtPosition(positionOffsetPercent(0.25, 0.25))
      if (exists) return exists
      return false
    }, { selector })
  }

  isXpath(selector: string) {
    return selector.startsWith('//')
  }
}
