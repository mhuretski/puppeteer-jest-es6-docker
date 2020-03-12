import { MAIN_PAGE } from '@const/properties/constants'
import { defaultWaitTimer } from '@const/global/timers'
import Snapshot from '@classes/util/snapshot'
import {
  clickTimeoutExceptionMessage,
  itemOutOfBoundExceptionMessage,
  selectExceptionMessage,
} from '@const/global/errors'
import {
  Cookie,
  LoadEvent,
  ElementHandle,
  SetCookie,
} from 'puppeteer'
import { ENTER } from '@const/global/keyboard.keys'
import { buildSpecificTempDir } from '@const/global/paths'
import {
  clearDownloadFolder,
  defaultFileName,
  renameDownloadedFile,
} from '@app/util/downloads'
import { setDownloadProperties } from '@config/puppet.settings'
import path from 'path'
import { ChromeHTMLElement, NodeListOf } from '@interfaces'


export default class Helper extends Snapshot {
  async open(path = MAIN_PAGE,
          waitForSpinner = true,
          waitUntil: LoadEvent = 'networkidle2',
  ) {
    try {
      await this._page.goto(path, { waitUntil: waitUntil })
    } catch (e) {
      console.log(`WARNING Couldn't wait until "${waitUntil} is fired trying to navigate to "${path}".`, e)
    }
    if (waitForSpinner) {
      await super.waitForSpinnerToDisappear()
    }
  }

  async openRelative(path: string,
          selectorToCheck?: string,
          waitForSpinner = true,
          waitUntil: LoadEvent = 'networkidle2',
  ) {
    const openPage = async () => {
      await this.open(`${MAIN_PAGE}${path}`, waitForSpinner, waitUntil)
      if (selectorToCheck) await super.waitFor(selectorToCheck)
    }
    return openPage()
  }

  async reloadInBrowser() {
    await this._page.evaluate(() => {
      location.reload()
    })
    await super.waitForSpinnerToDisappear()
    await super.waitForImages()
  }

  async reload(waitUntil: LoadEvent = 'networkidle2') {
    await this._page.reload({ waitUntil: waitUntil })
    await super.waitForSpinnerToDisappear()
    await super.waitForImages()
  }

  async removeIfExist(selector: string, timeout = defaultWaitTimer):
    Promise<void> {
    try {
      await super.waitFor(selector, timeout)
      await this._page.evaluate((selector) => {
        const elem: HTMLElement = document.querySelector(selector)
        if (elem) elem.remove()
      }, selector)
    } catch (e) {
      // assumed element didn't exist
    }
  }

  async screenshotAndGoBack(url?: string, selector?: string) {
    try {
      await super.screenshot(selector)
    } finally {
      await this.goBackIfNeeded(url)
    }
  }

  async goBack() {
    await this._page.goBack()
    await super.waitForSpinnerToDisappear()
    return true
  }

  async goBackIfNeeded(url?: string) {
    if ((await super.getURL()) !== url) {
      await this.goBack()
    }
    return true
  }

  async goBackInBrowser() {
    await this._page.evaluate(() => window.history.back())
    await super.waitForSpinnerToDisappear()
    await super.waitForImages()
  }

  async goForward() {
    await this._page.goForward()
  }

  async setCookie(...cookies: SetCookie[]) {
    await this._page.setCookie(...cookies)
  }

  async getCookies(): Promise<Cookie[]> {
    return this._page.cookies()
  }

  async clickAndBack(selector: string,
          url?: string,
          timeout = defaultWaitTimer,
          fn?: Function) {
    try {
      await this.click(selector, timeout)
      if (fn) fn()
    } finally {
      await this.goBackIfNeeded(url)
    }
  }

  async clickScreenAndBack(selector: string,
          url?: string,
          timeout = defaultWaitTimer) {
    return this.clickAndBack(selector, url, timeout, super.screenshot)
  }

  async changeElementContentTo(
          whatIsReplaced: 'innerHTML' | 'innerText' | 'textContent',
          selector: string,
          replaceValue: string = '',
          replacePattern: string = '',
          timeout = defaultWaitTimer) {
    await super.waitFor(selector, timeout)

    const isXpath = this.isXpath(selector)
    await this._page.evaluate((whatIsReplaced, selector, isXpath,
            replaceValue, replacePattern) => {
      let elem
      if (isXpath) {
        elem = document.evaluate(selector,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null).singleNodeValue
      } else {
        elem = document.querySelector(selector)
      }

      if (elem) {
        if (replaceValue) {
          elem[whatIsReplaced] = replaceValue
        } else {
          const stringGenerator = (size: number) => new Array(size + 1).join('#')
          if (replacePattern) {
            elem[whatIsReplaced] = elem[whatIsReplaced].replace(
              replacePattern, stringGenerator(replacePattern.length))
          } else {
            elem[whatIsReplaced] = stringGenerator(elem[whatIsReplaced].length)
          }
        }
      }
    }, whatIsReplaced, selector, isXpath, replaceValue, replacePattern)
  }

  async getText(selector: string, timeout = defaultWaitTimer)
    : Promise<string> {
    if (super.isXpath(selector)) {
      const elemXPath = (await this._page.$x(selector))[0]
      return this._page.evaluate(e => e.innerText, elemXPath)
    } else {
      await super.waitFor(selector, timeout)
      const result = await this._page.evaluate((selector) => {
        const elem = document.querySelector(selector)
        if (elem) return elem.innerText
      }, selector)
      return (result) || ''
    }
  }

  async getHTML(elementOrSelector: ElementHandle | string):
    Promise<string | undefined> {
    let element
    if (typeof elementOrSelector === 'string') {
      await this.waitFor(elementOrSelector)
      element = await this._page.$(elementOrSelector)
    } else {
      element = elementOrSelector
    }
    if (element) {
      const htmlContent = await element.getProperty('innerHTML')
      if (htmlContent) {
        // @ts-ignore
        return htmlContent.jsonValue()
      }
    }
  }

  async setValue(
          selector: string,
          text: string,
          timeout = defaultWaitTimer): Promise<void> {
    await super.waitFor(selector, timeout)
    await this._page.evaluate(({ selector, text }) => {
      document.querySelector(selector).value = text
    }, { selector, text })
  }

  async emptyValue(selector: string, timeout = defaultWaitTimer):
    Promise<void> {
    await this.setValue(selector, '', timeout)
  }

  async getValue(selector: string, timeout = defaultWaitTimer):
    Promise<string> {
    await super.waitFor(selector, timeout)
    return this._page.evaluate((selector) => {
      return document.querySelector(selector).value
    }, selector)
  }

  async getIntValue(selector: string, timeout = defaultWaitTimer):
    Promise<number> {
    await super.waitFor(selector, timeout)
    return this._page.evaluate((selector) => {
      return parseInt(document.querySelector(selector).value)
    }, selector)
  }

  async getFloatValue(selector: string, timeout = defaultWaitTimer):
    Promise<number> {
    await super.waitFor(selector, timeout)
    return this._page.evaluate((selector) => {
      return parseFloat(document.querySelector(selector).value)
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

  async hover(selector: string, timeout = defaultWaitTimer) {
    await super.waitFor(selector, timeout)
    await this._page.hover(selector)
  }

  async focus(selector: string, timeout = defaultWaitTimer) {
    await super.waitFor(selector, timeout)
    await this._page.focus(selector)
  }

  async click(selector: string, timeout = defaultWaitTimer) {
    if (super.isXpath(selector)) {
      await this.waitForXPath(selector, timeout)
      const element = (await this._page.$x(selector)).shift()
      if (element) {
        await element.click()
      } else {
        throw new Error(clickTimeoutExceptionMessage(selector, timeout))
      }
    } else {
      await super.waitForElement(selector, timeout)
      await this._page.click(selector)
    }
  }

  /*
   * Click without moving page to center of clicked area.
   * Evaluated in browser.
   */
  async clickInBrowser(selector: string, timeout = defaultWaitTimer) {
    await super.waitFor(selector, timeout)
    const result = await this.clickInBrowserWithoutException(selector)
    if (!result) {
      throw new Error(clickTimeoutExceptionMessage(selector, timeout))
    }
  }

  async clickInBrowserWithoutException(selector: string) {
    return this._page.evaluate((selector: string) => {
      const elem: ChromeHTMLElement | null = document.querySelector(selector)
      if (elem) {
        elem.scrollIntoViewIfNeeded()
        elem.click()
        return true
      }
    }, selector)
  }

  async clickByCoordinatesInBrowser(selector: string,
          timeout = defaultWaitTimer) {
    await super.waitFor(selector, timeout)
    return this._page.evaluate((selector: string) => {
      const simulateClick = (x: number, y: number) => {
        const clickEvent = document.createEvent('MouseEvents')
        clickEvent.initMouseEvent(
          'click', true, true, window, 0,
          0, 0, x, y, false, false,
          false, false, 0, null,
        )
        const elem = document.elementFromPoint(x, y)
        if (elem) elem.dispatchEvent(clickEvent)
      }

      const elem: HTMLElement | null = document.querySelector(selector)
      if (elem) {
        const X = elem.getBoundingClientRect().left + elem.offsetWidth / 2
        const Y = elem.getBoundingClientRect().top + elem.offsetHeight / 2
        simulateClick(X, Y)
        return true
      }
    }, selector)
  }

  async clickOnElementInBrowser(selector: string,
          position = 0,
          timeout = defaultWaitTimer) {
    await this.clickElementFromListInBrowser(selector, position, timeout)
    await super.waitForSpinnerToDisappear()
  }

  async clickAndGetOn(selector: string,
          position = 0,
          timeout = defaultWaitTimer): Promise<ElementHandle> {
    const element = await this.getElementFromList(
      selector, position, timeout)
    await element.click()
    await super.waitForSpinnerToDisappear()
    return element
  }

  async scrollIntoView(selector: string,
          position = 0,
          timeout = defaultWaitTimer) {
    await super.waitFor(selector, timeout)
    await this._page.evaluate((selector: string, position: number) => {
      const elem: any = document.querySelectorAll(selector)
      elem[position].scrollIntoView()
    }, selector, position)
  }

  async countElementsInBrowser(selector: string)
    : Promise<number> {
    return this._page.evaluate((selector) => {
      return document.querySelectorAll(selector).length
    }, selector)
  }

  async countElements(selector: string)
    : Promise<number> {
    return (await this.getElements(selector)).length
  }

  async getElements(selector: string)
    : Promise<ElementHandle[]> {
    return this._page.$$(selector)
  }

  async getElement(selector: string): Promise<ElementHandle | null> {
    await super.waitFor(selector)
    return this._page.$(selector)
  }

  async clickOn(selector: string,
          position = 0,
          timeout = defaultWaitTimer) {
    await this.clickElementFromList(selector, position, timeout)
    await super.waitForSpinnerToDisappear()
  }

  async clickOnLast(selector: string,
          timeout = defaultWaitTimer) {
    const elem = await this.getLastElementFromList(selector, timeout)
    await elem.click()
    await super.waitForSpinnerToDisappear()
  }

  async clickElementFromList(selector: string,
          position = 0,
          timeout = defaultWaitTimer) {
    const element = await this.getElementFromList(
      selector, position, timeout)
    await super.waitForAnimation()
    await element.click()
  }

  async getElementFromList(selector: string,
          position = 0,
          timeout = defaultWaitTimer) {
    await super.waitFor(selector, timeout)
    const elements = await this.getElements(selector)
    if (position >= elements.length) {
      throw new Error(
        itemOutOfBoundExceptionMessage(selector, position, elements.length))
    }
    return elements[position]
  }

  async getLastElementFromList(selector: string,
          timeout = defaultWaitTimer) {
    await super.waitFor(selector, timeout)
    const elements = await this.getElements(selector)
    if (elements.length === 0) {
      throw new Error(`Couldn't find any elements for selector: "${selector}".`)
    }
    return elements[elements.length - 1]
  }

  async getElementFromParentElement(element: ElementHandle,
          selector: string,
          position = 0) {
    const elem = await this.getElementsFromParentElement(
      element, selector)
    if (position >= elem.length) {
      throw new Error(
        itemOutOfBoundExceptionMessage(selector, position, elem.length))
    }
    return elem[position]
  }

  async getElementsFromParentElement(parentElement: ElementHandle,
          selector: string): Promise<ElementHandle[]> {
    return parentElement.$$(selector)
  }

  async clickElementFromListInBrowser(selector: string,
          position = 0,
          timeout = defaultWaitTimer) {
    await super.waitFor(selector, timeout)
    const result = await this._page.evaluate(
      (selector: string, position: number) => {
        const elements: NodeListOf<ChromeHTMLElement> | null =
          document.querySelectorAll(selector)
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

  async scrollDown(distance = 100) {
    await this._page.evaluate(`(async () => {
      await new Promise((resolve, reject) => {
        let totalHeight = 0
        const distance = ${distance}
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight
          window.scrollBy(0, distance)
          totalHeight += distance
          console.log(totalHeight - scrollHeight)
          if (totalHeight >= scrollHeight) {
            clearInterval(timer)
            resolve()
          }
        }, 100)
      })
    })()`, distance)
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
      const select = await this.getElement(selector)
      if (select) {
        option = await this._getSelectValue(selector, option, optionSelector)
      } else {
        throw new Error(selectExceptionMessage(selector, timeout))
      }
    }
    await this._page.select(selector, option)
  }

  async selectByOptionPositionInBrowser(selector: string,
          position: number,
          optionSelector = 'option',
          triggerChangeEvent = true,
          timeout = defaultWaitTimer) {
    await super.waitFor(selector)
    const isChanged = await this._page.evaluate(
      (selector, position, optionSelector, triggerChangeEvent) => {
        const select = document.querySelector(selector)
        const options = select.querySelectorAll(optionSelector)
        if (options && position < options.length) {
          options[position].selected = true
          if (triggerChangeEvent) {
            select.dispatchEvent(new Event('change'))
          }
          return true
        }
      }, selector, position, optionSelector, triggerChangeEvent)
    if (!isChanged) {
      throw new Error(selectExceptionMessage(selector, timeout))
    }
  }

  async _getSelectValue(selector: string,
          option: number,
          optionSelector = 'option'): Promise<string> {
    const optionValues: string[] =
      await this._getSelectOptionValues(selector, optionSelector)
    if (option >= optionValues.length) {
      throw new Error(
        itemOutOfBoundExceptionMessage(
          selector, option, optionValues.length))
    }
    return optionValues[option]
  }

  async _getSelectOptionValues(
          selector: string,
          optionsSelector = 'options',
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

  async pressEnter() {
    await this.pressKeyboardKey(ENTER)
  }

  async pressKeyboardKey(key: string) {
    await this._page.keyboard.press(key)
  }

  _downloadCount: number = 0

  async downloadFile(selector: string,
          downloadDirectory = buildSpecificTempDir,
          savedFileName = defaultFileName,
          convert?: (path: string, fileName?: string)
                       => Promise<string> | string) {
    const specificIterationDir = (++this._downloadCount).toString()
    const downloadFolder = path.join(downloadDirectory, specificIterationDir)
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

  async setUserAgent(userAgent: string) {
    await this._page.setUserAgent(userAgent)
  }

  fileLinuxPathToChromePath(path: string) {
    return `file://${path}`
  }
}
