import Waiter from './waiter'
import { screenExpectOption } from '@config/screenshot.settings'
import { defaultAnimationWaitTimer, defaultWaitTimer } from '@const/global/timers'
import { pageContainerS } from '@components/shared/util/constant'
import { SCREENSHOT } from '@const/global/flags'
import { itemOutOfBoundExceptionMessage } from '@const/global/errors'

export default class Checker extends Waiter {
  it(args: any) {
    return expect(args)
  }

  async its(val: any) {
    await this.screenshot()
    return expect(val)
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

  async toBeGreaterThan(
          value: string | number,
          expected: number,
          screenshot = false,
          selector?: string) {
    const condition = (value: number, expected: number) =>
      expect(value).toBeGreaterThan(expected)
    return this._checkCondition(condition,
      value, expected, screenshot, selector)
  }

  async toBeGreaterThanOrEqual(
          value: string | number | undefined,
          expected: number,
          screenshot = false,
          selector?: string) {
    const condition = (value: number, expected: number) =>
      expect(value).toBeGreaterThanOrEqual(expected)
    return this._checkCondition(condition,
      value, expected, screenshot, selector)
  }

  async toEqual(
          value: string | number | undefined,
          expected: number,
          screenshot = false,
          selector?: string) {
    const condition = (value: number, than: number) =>
      expect(value).toEqual(than)
    return this._checkCondition(condition,
      value, expected, screenshot, selector)
  }

  async _checkCondition(
          condition: Function,
          value: string | number | undefined,
          expected: number,
          screenshot = false,
          selector?: string) {
    switch (typeof value) {
      case 'number':
        break
      case 'string':
        value = parseInt(value)
        break
      default:
        throw new Error()
    }

    if (screenshot) await this.screenshot(selector)
    return condition(value, expected)
  }

  async textToBe(
          text: string,
          selector: string,
          caseSensitive = false,
          timeout = defaultWaitTimer,
          screenshot = true) {
    await super.waitFor(selector, timeout)
    let gottenText = await this._page.$eval(selector, el => el.textContent)
    if (!caseSensitive) {
      if (gottenText) gottenText = gottenText.toLowerCase()
      text = text.toLowerCase()
    }
    screenshot ?
      (await this.its(gottenText)).toMatch(text) :
      this.it(gottenText).toMatch(text)
  }

  async toBeDefined(
          selector: string,
          screenshot = true,
          timeout = defaultWaitTimer) {
    const isDefined = async () => {
      try {
        return await super.waitFor(selector, timeout)
      } catch (e) {
        return false
      }
    }

    const result = await isDefined()
    if (screenshot) {
      await this.screenshot(selector)
    }
    this.it(result).toBeTruthy()
    return result
  }

  async toBeUndefined(
          selector: string,
          timeout = defaultAnimationWaitTimer,
          screenshot = true) {
    const isNotDefined = async () => {
      try {
        await super.waitFor(selector, timeout)
        return false
      } catch (e) {
        return true
      }
    }

    const result = await isNotDefined()
    if (screenshot) {
      await this.screenshot(selector)
    }
    this.it(result).toBeTruthy()
    return result
  }

  async toBeVisible(selector: string, screenshot = true) {
    const isVisible = await super.isVisibleWithAnimationTimer(selector)
    screenshot ?
      (await this.its(isVisible)).toBeTruthy() :
      this.it(isVisible).toBeTruthy()
    return isVisible
  }

  async toBeInvisible(selector: string, screenshot = true) {
    const isInvisible = !(await super.isVisibleWithAnimationTimer(selector))
    screenshot ?
      (await this.its(isInvisible)).toBeTruthy() :
      this.it(isInvisible).toBeTruthy()
    return isInvisible
  }
}
