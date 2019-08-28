'use strict'
import Waiter from './waiter'
import { screenExpectOption } from '@config/screenshot.settings'
import { defaultAnimationWaitTimer, defaultWaitTimer } from '@const/global/timers'
import { pageContainer } from '@components/shared/constant'
import { SCREENSHOT } from '@const/global/flags'

export default class Checker extends Waiter {
  it(args: any) {
    return expect(args)
  }

  async its(val: any) {
    await this.screenshot()
    return expect(val)
  }

  async screenshot(selector = pageContainer) {
    if (SCREENSHOT) {
      await super.waitForSpinnerToDisappear()
      await super.waitForImages()
      const screenshot = await this._screenshotElement(selector)
      // @ts-ignore
      expect(screenshot).toMatchImageSnapshot(screenExpectOption)
      return true
    }
  }

  async _screenshotElement(selector: string | undefined) {
    let screen
    if (selector) {
      await super.waitFor(selector)
      const elem = await this._page.$(selector)
      if (elem) screen = await elem.screenshot()
    } else {
      screen = this._page.screenshot()
    }
    return screen
  }

  async toBeGreaterThan(
          value: string | number | undefined,
          than: number,
          screenshot = false) {
    const condition = (value: number, than: number) => value > than
    return this._checkCondition(condition, value, than, screenshot)
  }

  async toBeGreaterThanOrEqual(
          value: string | number | undefined,
          than: number,
          screenshot = false) {
    const condition = (value: number, than: number) => value >= than
    return this._checkCondition(condition, value, than, screenshot)
  }

  async _checkCondition(
          condition: Function,
          value: string | number | undefined,
          than: number,
          screenshot = false) {
    switch (typeof value) {
      case 'number':
        break
      case 'string':
        value = parseInt(value)
        break
      default:
        throw new Error()
    }

    const result = condition(value, than)
    screenshot
      ? (await this.its(value)).toBeGreaterThan(than)
      : this.it(value).toBeGreaterThan(than)
    expect(result).toBeTruthy()
    return result
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
    screenshot
      ? (await this.its(gottenText)).toMatch(text)
      : this.it(gottenText).toMatch(text)
  }

  async toBeDefined(
          selector: string,
          timeout = defaultWaitTimer,
          screenshot = true) {
    const isDefined = async () => {
      try {
        await super.waitFor(selector, timeout)
        return true
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
    screenshot
      ? (await this.its(isVisible)).toBeTruthy()
      : this.it(isVisible).toBeTruthy()
    return isVisible
  }

  async toBeInvisible(selector: string, screenshot = true) {
    const isInvisible = !(await super.isVisibleWithAnimationTimer(selector))
    screenshot
      ? (await this.its(isInvisible)).toBeTruthy()
      : this.it(isInvisible).toBeTruthy()
    return isInvisible
  }
}
