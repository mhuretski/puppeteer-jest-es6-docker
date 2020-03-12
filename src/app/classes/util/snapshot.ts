import Waiter from '@classes/util/waiter'
import { screenExpectOption } from '@config/screenshot.settings'
import { defaultAnimationWaitTimer } from '@const/global/timers'
import { pageContainerS } from '@components/shared/util/constant'
import { SCREENSHOT } from '@const/global/flags'
import { itemOutOfBoundExceptionMessage } from '@const/global/errors'


export default class Snapshot extends Waiter {
  async isVisibleWithAnimationTimer(selector: string,
          timeout = defaultAnimationWaitTimer): Promise<boolean> {
    await this.waitForAnimation(timeout)
    return this.isVisible(selector)
  }

  async waitToBeInvisible(selector: string,
          timeout = defaultAnimationWaitTimer) {
    return super.waitToBe(false,
      selector,
      this.isVisible,
      timeout)
  }

  async waitToBeVisible(selector: string,
          timeout = defaultAnimationWaitTimer) {
    return super.waitToBe(true,
      selector,
      this.isVisible,
      timeout)
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

  async screenshot(selector = pageContainerS, position = 0) {
    if (SCREENSHOT) {
      await super.waitForSpinnerToDisappear()
      await super.waitForImages()
      const screenshot = await this._screenshotElement(selector, position)
      // @ts-ignore
      expect(screenshot).toMatchImageSnapshot(screenExpectOption)
      return true
    }
  }

  async _screenshotElement(selector: string | undefined, position = 0) {
    let screen
    if (selector) {
      await super.waitFor(selector)
      const elements = await this._page.$$(selector)
      if (position >= elements.length) {
        throw new Error(
          itemOutOfBoundExceptionMessage(selector, position, elements.length))
      }
      screen = await elements[position].screenshot()
    } else {
      screen = this._page.screenshot()
    }
    return screen
  }
}
