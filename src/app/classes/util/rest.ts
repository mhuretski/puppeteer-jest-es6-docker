import Helper from '@classes/util/helper'
import { defaultResponseWaitTimer, defaultWaitTimer } from '@const/global/timers'
import { Response } from 'puppeteer'


export default class Rest extends Helper {
  async clickWithResponse(selector: string, waitSpinner = true,
          ...rest: Array<string>) {
    const rests: Array<Promise<any>> = []
    rest.forEach(obj => rests.push(super.waitForResponseURLToContain(obj)))
    await super.click(selector)
    await Promise.all(rests).catch(e => console.log('clickWithResponse', e))
    if (waitSpinner) {
      await super.waitForSpinnerToDisappear()
    }
  }

  async selectWithResponse(selector: string,
          position: number,
          rests: Array<string> = [],
          waitSpinner = true,
          optionSelector = 'option',
          timeout = defaultWaitTimer) {
    const restArr: Array<Promise<any>> = []
    rests.forEach(
      obj => restArr.push(super.waitForResponseURLToContain(obj)))
    await super.selectOption(
      selector, position, optionSelector, timeout)
    await Promise.all(rests).catch(e => console.log('selectWithResponse', e))
    if (waitSpinner) {
      await super.waitForSpinnerToDisappear()
    }
  }

  async clickAndWaitEndecaContent(selector: string,
          position = 0,
          errorMessage = 'Invalid Endeca response.',
          timeout = defaultResponseWaitTimer) {
    await this.resolveClickWithResponse(selector, this.waitEndecaResponse,
      errorMessage, position, timeout)
  }

  async waitAndGetOrderId(): Promise<string> {
    const currentPage = this._page.url()
    const orderId = this.getOrderId()
    await super.openRelative('cart')
    await super.open(currentPage)
    return orderId
  }

  async getOrderId(): Promise<string> {
    const cartSummary = await this.waitShoppingCartSummaryResponse()
    const responseJson: any = await cartSummary.json()
    return responseJson?.cartInfo?.data?.shoppingCart?.id
  }

  async isErrorResponse(response: Promise<Response>) {
    try {
      const resolvedResponse = await Promise.resolve(response)
        .catch(e => console.log('isErrorResponse', e))
      if (!resolvedResponse) return false
      const responseJson: any = await resolvedResponse.json()
      return responseJson.errorResponse || responseJson.isError
    } catch (e) {
      return true
    }
  }

  async getResponse(response: Promise<Response>,
          timeout?: number): Promise<string> {
    const defaultError = `No response received${(timeout) ? ` within ${timeout} milliseconds.` : '.'}`
    try {
      const resolvedResponse = await Promise.resolve(response).catch(e => console.log('getResponse', e))
      const resultText = (resolvedResponse) ?
        await resolvedResponse.text() :
        null
      if (resultText) {
        return `Response is "${resultText}".`
      } else return defaultError
    } catch (e) {
      return defaultError
    }
  }

  async checkResponseForErrors(message: string,
          response: Promise<Response>, timeout?: number): Promise<void> {
    if (await this.isErrorResponse(response)) {
      throw new Error(`${message} ${await this.getResponse(response, timeout)}`)
    }
  }

  async resolveClickWithResponse(selector: string,
          waitForResponse: (timeout?: number) => Promise<Response>,
          errorMessage = 'Invalid response.',
          position = 0,
          timeout = defaultResponseWaitTimer) {
    await super.scrollIntoView(selector, position)
    const response: any = waitForResponse.call(this, timeout)

    const clicked = super.clickOn(selector, position)
    await this.checkResponseForErrors(errorMessage, response, timeout)
    await Promise.all([clicked, response])
      .catch(e => console.log('resolveClickWithResponse', e))
  }

  async waitRemoveItemFromOrderResponse(
          timeout = defaultResponseWaitTimer): Promise<Response> {
    return super.waitForResponseURLToContain('removeItemFromOrder', timeout)
  }

  async waitAddItemToOrderResponse(
          timeout = defaultResponseWaitTimer): Promise<Response> {
    return super.waitForResponseURLToContain('addItemToOrder', timeout)
  }

  async waitShoppingCartSummaryResponse(
          timeout = defaultResponseWaitTimer): Promise<Response> {
    return super.waitForResponseURLToContain('shoppingCartSummary', timeout)
  }

  async waitForgotPasswordResponse(
          timeout = defaultResponseWaitTimer): Promise<Response> {
    return super.waitForResponseURLToContain('forgotPassword', timeout)
  }

  async waitEndecaResponse(
          timeout = defaultResponseWaitTimer): Promise<Response> {
    return super.waitForResponseURLToContain('getPage', timeout)
  }

  async waitNewPasswordResponse(
          timeout = defaultResponseWaitTimer): Promise<Response> {
    return super.waitForResponseURLToContain('newPassword', timeout)
  }

  async waitLoginResponse(
          timeout = defaultResponseWaitTimer): Promise<Response> {
    return super.waitForResponseURLToContain('login', timeout)
  }
}
