'use strict'
import { MAIN_PAGE } from '@const/properties/constants'
import Checker from './checker'
import {
  defaultSpinnerPresenceTimerOnFirstPageLoad,
  defaultWaitTimer,
} from '@const/global/timers'
import {
  clickTimeoutExceptionMessage,
  itemOutOfBoundExceptionMessage,
  selectExceptionMessage,
} from '@const/global/error.messages'
import { ElementHandle } from 'puppeteer'
import { ENTER } from '@const/global/keyboard.keys'
import { buildSpecificTempDir } from '@const/global/paths'
import {
  clearDownloadFolder,
  defaultFileName,
  renameDownloadedFile,
} from '@app/util/downloads'
import { setDownloadProperties } from '@config/puppet.settings'

interface ChromeHTMLElement extends Element {
  scrollIntoViewIfNeeded(): void;

  click(): void;
}

interface NodeListOf<Node> {
  length: number;

  item(index: number): Node;

  forEach(
    callbackfn: (
      value: Node, key: number, parent: NodeListOf<Node>
    ) => void, thisArg?: any
  ): void;

  [index: number]: Node;
}

export default class AbstractContentObject extends Checker {
  async open(path = MAIN_PAGE,
          spinnerPresenceTimeout = defaultSpinnerPresenceTimerOnFirstPageLoad
  ) {
    await this._page.goto(path)
    await super.waitForSpinnerToDisappear(spinnerPresenceTimeout)
  }

  async openRelative(path: string,
          selectorToCheck?: string,
          spinnerPresenceTimeout = defaultSpinnerPresenceTimerOnFirstPageLoad,
  ) {
    const openPage = async () => {
      await this.open(`${MAIN_PAGE}${path}`, spinnerPresenceTimeout)
      if (selectorToCheck) await super.waitFor(selectorToCheck)
    }

    try {
      await openPage()
    } catch (e) {
      await openPage()
    }
  }

  async reload() {
    await this._page.evaluate(() => {
      location.reload()
    })
    await super.waitForSpinnerToDisappear()
  }

  async screenshotAndGoBack(selector?: string) {
    await super.screenshot(selector)
    return this.goBack()
  }

  async goBackPuppeteer() {
    await this._page.goBack()
    await super.waitForSpinnerToDisappear()
    return true
  }

  async goBack() {
    await this._page.evaluate(() => window.history.back())
    await super.waitForSpinnerToDisappear()
    return true
  }

  async goForwardPuppeteer() {
    await this._page.goForward()
  }

  async clickAndBack(selector: string,
          timeout = defaultWaitTimer,
          fn?: Function) {
    await this.click(selector, timeout)
    if (fn) fn()
    return this.goBack()
  }

  async clickScreenAndBack(selector: string, timeout = defaultWaitTimer) {
    return this.clickAndBack(selector, timeout, super.screenshot)
  }

  async getText(selector: string, timeout = defaultWaitTimer) {
    await super.waitFor(selector, timeout)
    return this._page.$eval(selector, el => el.textContent)
  }

  async getValue(selector: string, timeout = defaultWaitTimer) {
    await super.waitFor(selector, timeout)
    return this._page.evaluate((selector) => {
      return parseInt(document.querySelector(selector).value)
    }, selector)
  }

  async getAttribute(property: string,
          selectorOrElement: string | ElementHandle<Element>,
          timeout = defaultWaitTimer) {
    if (typeof selectorOrElement === 'string') {
      await super.waitFor(selectorOrElement, timeout)
      return this._page.evaluate((selector, property) => {
        return (document.querySelector(selector).getAttribute(property))
      }, selectorOrElement, property)
    } else {
      return this._page.evaluate(
        (e, property) => e.getAttribute(property), selectorOrElement, property)
    }
  }

  async tap(selector: string, timeout = defaultWaitTimer) {
    await super.waitFor(selector, timeout)
    await this._page.tap(selector)
  }

  async clickPuppeteer(selector: string, timeout = defaultWaitTimer) {
    await super.waitFor(selector, timeout)
    const element = await this._page.$(selector)
    if (element) {
      await element.click()
    } else {
      throw new Error(clickTimeoutExceptionMessage(selector, timeout))
    }
  }

  /*
   * Click without moving page to center of clicked area
   */
  async click(selector: string, timeout = defaultWaitTimer) {
    await super.waitFor(selector, timeout)
    const result = await this._page.evaluate((selector: string) => {
      const elem: ChromeHTMLElement | null = document.querySelector(selector)
      if (elem) {
        elem.scrollIntoViewIfNeeded()
        elem.click()
        return true
      }
    }, selector)
    if (!result) {
      throw new Error(clickTimeoutExceptionMessage(selector, timeout))
    }
  }

  async clickOn(selector: string,
          position = 0,
          timeout = defaultWaitTimer) {
    await this.clickElementFromList(selector, position, timeout)
    await super.waitForSpinnerToDisappear()
  }

  async clickAndGetOnPuppeteer(selector: string,
          position = 0,
          timeout = defaultWaitTimer): Promise<ElementHandle> {
    const element = await this.getElementFromListPuppeteer(
      selector, position, timeout)
    await element.click()
    await super.waitForSpinnerToDisappear()
    return element
  }

  async countElements(selector: string)
    : Promise<number> {
    return this._page.evaluate((selector) => {
      return document.querySelectorAll(selector).length
    }, selector)
  }

  async countElementsPuppeteer(selector: string)
    : Promise<number> {
    return (await this.getElementsPuppeteer(selector)).length
  }

  async getElementsPuppeteer(selector: string)
    : Promise<ElementHandle[]> {
    return this._page.$$(selector)
  }

  async getElementPuppeteer(selector: string): Promise<ElementHandle | null> {
    await super.waitFor(selector)
    return this._page.$(selector)
  }

  async clickOnPuppeteer(selector: string,
          position = 0,
          timeout = defaultWaitTimer) {
    await this.clickElementFromListPuppeteer(selector, position, timeout)
    await super.waitForSpinnerToDisappear()
  }

  async clickElementFromListPuppeteer(selector: string,
          position = 0,
          timeout = defaultWaitTimer) {
    const element = await this.getElementFromListPuppeteer(
      selector, position, timeout)
    await element.click()
  }

  async getElementFromListPuppeteer(selector: string,
          position = 0,
          timeout = defaultWaitTimer) {
    await super.waitFor(selector, timeout)
    const elements = await this.getElementsPuppeteer(selector)
    if (position >= elements.length) {
      throw new Error(
        itemOutOfBoundExceptionMessage(selector, position, elements.length))
    }
    return elements[position]
  }

  async getElementFromParentElementPuppeteer(element: ElementHandle,
          selector: string,
          position = 0) {
    const elem = await this.getElementsFromParentElementPuppeteer(
      element, selector)
    if (position >= elem.length) {
      throw new Error(
        itemOutOfBoundExceptionMessage(selector, position, elem.length))
    }
    return elem[position]
  }

  async getElementsFromParentElementPuppeteer(parentElement: ElementHandle,
          selector: string): Promise<ElementHandle[]> {
    return parentElement.$$(selector)
  }

  async clickElementFromList(selector: string,
          position = 0,
          timeout = defaultWaitTimer) {
    await super.waitFor(selector, timeout)
    const result = await this._page.evaluate(
      (selector: string, position: number) => {
        const elements: NodeListOf<ChromeHTMLElement> | null = document
          .querySelectorAll(selector)
        if (elements.length > position) {
          const elem = elements[position]
          if (elem) {
            elem.scrollIntoViewIfNeeded()
            elem.click()
            return true
          } else {
            return elements.length
          }
        }
      }, selector, position)
    if (typeof result === 'number') {
      throw new Error(
        itemOutOfBoundExceptionMessage(selector, position, result))
    }
  }

  async scrollTo(selector: string, timeout = defaultWaitTimer) {
    await super.waitFor(selector, timeout)
    const result = await this._page.evaluate((selector: string) => {
      const elem: ChromeHTMLElement | null = document.querySelector(selector)
      if (elem) {
        elem.scrollIntoViewIfNeeded()
        return true
      }
    }, selector)
    if (!result) {
      throw new Error(clickTimeoutExceptionMessage(selector, timeout))
    }
  }

  async type(selector: string, text: string, timeout = defaultWaitTimer) {
    await super.waitFor(selector, timeout)
    await this._page.type(selector, text)
  }

  async selectOption(selector: string,
          option: number | string,
          optionSelector = 'option',
          timeout = defaultWaitTimer) {
    if (typeof option !== 'string') {
      const select = await this.getElementPuppeteer(selector)
      if (select) {
        option = await this.getSelectValue(selector, option, optionSelector)
      } else {
        throw new Error(selectExceptionMessage(selector, timeout))
      }
    }
    await this._page.select(selector, option)
  }

  async getSelectValue(selector: string,
          option: number,
          optionSelector = 'option'): Promise<string> {
    const optionValues: string[] =
      await this.getSelectOptionValues(selector, optionSelector)
    if (option >= optionValues.length) {
      throw new Error(
        itemOutOfBoundExceptionMessage(
          selector, option, optionValues.length))
    }
    return optionValues[option]
  }

  async getSelectOptionValues(
          selector: string,
          optionsSelector = 'options'
  ): Promise<string[]> {
    return this._page.evaluate((selector, optionsSelector) => {
      const select = document.querySelector(selector)
      const options: HTMLOptionElement[] =
        select.querySelectorAll(optionsSelector)
      const mappedValues = []
      for (let i = 0; i < options.length; i++) {
        mappedValues.push(options[i].value)
      }
      return mappedValues
    }, selector, optionsSelector)
  }

  async setValueToInput(
          selector: string,
          text: string,
          timeout = defaultWaitTimer) {
    await super.waitFor(selector, timeout)
    await this._page.evaluate(({ selector, text }) => {
      document.querySelector(selector).value = text
    }, { selector, text })
  }

  async pressEnter() {
    await this.pressKeyboardKey(ENTER)
  }

  async pressKeyboardKey(key: string) {
    await this._page.keyboard.press(key)
  }

  async downloadFile(selector: string,
          downloadFolder = buildSpecificTempDir,
          savedFileName = defaultFileName,
          convert?: (path: string, fileName?: string)
                       => Promise<string> | string) {
    await clearDownloadFolder(downloadFolder)
    await setDownloadProperties(this._page, downloadFolder)
    await this.click(selector)
    const filename = await super.waitForFileToDownload(downloadFolder)
    const newFullPath =
      await renameDownloadedFile(filename, downloadFolder, savedFileName)
    if (convert) return convert(newFullPath, savedFileName)
    return newFullPath
  }

  async setOfflineMode(enabled: boolean): Promise<void> {
    await this._page.setOfflineMode(enabled)
  }
}
