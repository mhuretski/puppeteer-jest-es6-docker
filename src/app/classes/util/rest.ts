'use strict'
import AbstractContentObject from '@classes/util/abstract.content.object'
import { defaultResponseWaitTimer } from '@const/global/timers'
import { Response } from 'puppeteer'

export default class Rest extends AbstractContentObject {
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
    const responseJson = await cartSummary.json()
    return responseJson.cartInfo.data.shoppingCart.id
  }

  async isErrorResponse(response: Promise<Response>) {
    try {
      return (await (await response).json()).isError !== false
    } catch (e) {
      return true
    }
  }

  async getResponse(response: Promise<Response>,
          timeout?: number): Promise<string> {
    try {
      return `Response is "${await (await response).text()}".`
    } catch (e) {
      return `No response received${(timeout) ? ` within ${timeout} milliseconds.` : '.'}`
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
    // noinspection ES6MissingAwait
    const response = waitForResponse.call(this, timeout)
    const clicked = super.clickOnPuppeteer(selector, position)
    await this.checkResponseForErrors(errorMessage, response, timeout)
    await Promise.all([
      response,
      clicked,
    ])
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
