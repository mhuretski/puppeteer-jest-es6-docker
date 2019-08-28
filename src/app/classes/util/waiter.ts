'use strict'
import Page from './page'
import { spinner } from 'src/components/shared/constant'
import {
  defaultAnimationWaitTimer,
  defaultDownloadWaitTimer,
  defaultImagesWaitTimer,
  defaultSpinnerPresenceTimer,
  defaultSpinnerWaitTimer,
  defaultWaitTimer,
} from '@const/global/timers'
import { waitToBeExceptionMessage } from '@const/global/error.messages'
import { buildSpecificTempDir } from '@const/global/paths'
import { readDir } from 'src/app/util/writer'


export default class Waiter extends Page {
  async waitInNodeApp(time = defaultWaitTimer) {
    await new Promise(resolve => setTimeout(resolve, time))
  }

  async waitForFileToDownload(downloadPath = buildSpecificTempDir,
          timeout = defaultDownloadWaitTimer) {
    let filename
    while (!filename || filename.endsWith('.crdownload')) {
      filename = readDir(downloadPath)[0]
      // eslint-disable-next-line no-await-in-loop
      await this.waitInNodeApp(timeout)
    }
    return filename
  }

  async waitForAnimation() {
    return new Promise(
      resolve => setTimeout(resolve, defaultAnimationWaitTimer))
  }

  async waitForSpinnerToDisappear(
          presenceTimeout = defaultSpinnerPresenceTimer) {
    await this.waitElementToDisappear(spinner, presenceTimeout)
  }

  async waitElementPresence(element: string,
          timeout = defaultSpinnerPresenceTimer) {
    await this._page.waitFor(
      (selector: string) => document.querySelector(selector),
      { timeout: timeout },
      element)
  }

  async waitElementToDisappear(element: string,
          presenceTimeout = defaultSpinnerPresenceTimer) {
    try {
      await this.waitElementPresence(element, presenceTimeout)
    } catch (e) {
      // Expected
    }
    await this.waitElementAbsence(element, defaultSpinnerWaitTimer)
  }

  async waitElementAbsence(element: string, timeout = defaultSpinnerWaitTimer) {
    await this._page.waitFor(
      (selector: string) => !document.querySelector(selector),
      { timeout: timeout },
      element)
  }

  async waitForImages(timeout = defaultImagesWaitTimer) {
    const imagesHaveLoaded = () =>
      Array.from(document.images).every((i) => i.complete)
    await this._page.waitForFunction(imagesHaveLoaded, { timeout: timeout })
  }

  async waitFor(selector: string, timeout = defaultWaitTimer) {
    await this._page.waitFor(selector, { timeout: timeout })
    return true
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
      // eslint-disable-next-line no-await-in-loop
      const result = await checkFunction.call(this, selector)
      if (result === expectedValue) return
    }
  }

  async isVisibleWithAnimationTimer(selector: string): Promise<boolean> {
    await this.waitForAnimation()
    return this.isVisible(selector)
  }

  async isVisible(selector: string): Promise<boolean> {
    return this._page.evaluate(({ selector }) => {
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
      const elemCenter = {
        x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
        y: elem.getBoundingClientRect().top + elem.offsetHeight / 2,
      }
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
      let pointContainer =
        document.elementFromPoint(elemCenter.x, elemCenter.y)
      do {
        if (pointContainer === elem) {
          return true
        }
        // @ts-ignore
        const { parentNode } = pointContainer
        pointContainer = parentNode
      } while (pointContainer)
      return false
    }, { selector })
  }
}
