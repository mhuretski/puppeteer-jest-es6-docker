'use strict'
import quantity, { itemsToAdd } from '@components/shared/util/quantity'
import { defaultWaitTimer } from '@const/global/timers'
import { logoS } from '@components/shared/util/constant'
import Rest from '@classes/util/rest'

const productsContainer = '#cartItemsContainer'
const product = `${productsContainer} .product-row`
const dateContainer = '#dateContainer'
const startDateContainer = `${dateContainer} #startDateId`
const endDateContainer = `${dateContainer} #endDateId`
const continueShopping = '#continueShopping'
const dateModalContainer = '.DateRangePicker_picker'

const selectors = {
  title: '#basketTitle',
  guestAuthorizationRequest: '#authorizationRequest',
  removeAllItemsInBasketButton: '#removeAllItemsInBasketButton',
  goToCatalogFromEmptyBasket: '#goToCatalogFromEmptyBasket',
  continueShopping: continueShopping,
  submit: '#basketCheckout',
  products: {
    container: productsContainer,
    product: product,
    pdpLink: `${product} a`,
    quantity: {
      container: `${product} ${quantity.container}`,
      increase: `${product} ${quantity.increase}`,
      input: `${product} ${quantity.input}`,
      decrease: `${product} ${quantity.decrease}`,
    },
    remove: '#removeItem',
  },
  date: {
    container: dateContainer,
    errorMessage: '#dateErrorMessage',
    startDate: {
      container: startDateContainer,
      focused: `${startDateContainer}.DateInput_input__focused`,
    },
    endDate: {
      container: endDateContainer,
      focused: `${endDateContainer}.DateInput_input__focused`,
    },
    clear: `${dateContainer} [aria-label="Clear Dates"]`,
    modal: {
      container: dateModalContainer,
      closestAvailableDate: `${dateModalContainer} td[aria-disabled="false"]`,
      startDate: `${dateModalContainer} .CalendarDay__selected_start`,
      endDate: `${dateModalContainer} .CalendarDay__selected_end`,
    },
  },
  success: {
    title: '#orderSuccessTitle',
    continueShopping: continueShopping,
    startFromHomepage: '#startFromHomepage',
  },
}

export default class Basket extends Rest {
  static getSelectors = () => selectors;

  async openThis() {
    await super.openRelative('cart', logoS)
  }

  async itemsInBasketExist() {
    const cartSummary = await super.waitShoppingCartSummaryResponse()
    const response = await cartSummary.json()
    if (response.cartInfo.successResponse) {
      return response.cartInfo.data.shoppingCart.commerceItems.length > 0
    } else {
      throw new Error(`Failed to get cart summary. Response is "${JSON.stringify(response)}"`)
    }
  }

  async clearBasket() {
    const cartSummaryResponse = super.waitShoppingCartSummaryResponse()
    await super.resolveClickWithResponse(selectors.removeAllItemsInBasketButton,
      super.waitRemoveItemFromOrderResponse,
      'Failed deletion from basket.')

    await Promise.resolve(cartSummaryResponse)
  }

  async checkBasketIsEmpty() {
    return super.waitFor(selectors.goToCatalogFromEmptyBasket)
  }

  async checkSuccess() {
    await super.waitFor(selectors.success.title)
    await super.waitFor(selectors.success.startFromHomepage)
    await super.waitFor(selectors.success.continueShopping)
  }

  async continueShopping() {
    await super.clickPuppeteer(selectors.continueShopping)
  }

  async goToCatalogFromEmptyBasket() {
    await super.clickPuppeteer(selectors.goToCatalogFromEmptyBasket)
  }

  async submit() {
    await super.clickPuppeteer(selectors.submit)
  }

  async removeDates() {
    await super.clickPuppeteer(selectors.date.clear)
    return selectors.date.container
  }

  async setClosestStartDate() {
    await this._chooseClosestDate('startDate')
  }

  async setClosestEndDate() {
    await this._chooseClosestDate('endDate')
  }

  async _chooseClosestDate(date: 'startDate' | 'endDate') {
    if (await super.isInvisible(selectors.date.modal.container)) {
      await super.clickPuppeteer(selectors.date[date].container)
      await super.waitForAnimation()
    }
    await super.clickPuppeteer(selectors.date.modal.closestAvailableDate)
    if (await super.isInvisible(selectors.date.modal.container)) {
      await super.clickPuppeteer(selectors.date[date].container)
    }
    await super.clickPuppeteer(selectors.date.modal[date])
  }

  async removeItem(position = 0) {
    const before = await this.getAmountOfProducts()
    const cartSummaryRest = super.waitShoppingCartSummaryResponse()

    await super.resolveClickWithResponse(selectors.products.remove,
      super.waitRemoveItemFromOrderResponse,
      `Item at position ${position} is not removed from basket.`)

    await Promise.resolve(cartSummaryRest)
    await this.waitAmountOfProductsToBe(before - 1)
  }

  async waitAmountOfProductsToBe(number: number, timeout = defaultWaitTimer) {
    let amount = await this.getAmountOfProducts()

    const start = new Date().getTime()
    while (new Date().getTime() - start < timeout) {
      if (amount === number) {
        return
      } else {
        amount = await this.getAmountOfProducts()
      }
    }
    expect(amount).toEqual(number)
  }

  async getAmountOfProducts(): Promise<number> {
    try {
      return await super.countElementsPuppeteer(selectors.products.product)
    } catch (e) {
      return 0
    }
  }

  async getStartDate(): Promise<string> {
    await super.waitElementAbsence(selectors.date.startDate.focused)
    return super.getValue(selectors.date.startDate.container)
  }

  async getEndDate(): Promise<string> {
    await super.waitElementAbsence(selectors.date.endDate.focused)
    return super.getValue(selectors.date.endDate.container)
  }

  async checkErrorMessagePresence() {
    const result = await super.waitFor(selectors.date.errorMessage)
    expect(result).toBeTruthy()
  }

  async increaseQuantity(amount = 1, position = 0) {
    for (let i = 0; i < amount; i++) {
      await super.clickOnPuppeteer(
        selectors.products.quantity.increase, position)
    }
  }

  async decreaseQuantity(amount = 1, position = 0) {
    for (let i = 0; i < amount; i++) {
      await super.clickOnPuppeteer(
        selectors.products.quantity.decrease, position)
    }
  }

  async setQuantityOfItem(number: number, position = 0) {
    await itemsToAdd(this, number, position, selectors.products.quantity.input)
  }

  async screenshotQuantity(position = 0) {
    await super.screenshot(selectors.products.quantity.container, position)
    return true
  }

  async getCurrentQuantity(position = 0, timeout = defaultWaitTimer) {
    return super.getIntValue(selectors.products.quantity.input, timeout)
  }

  async waitDateErrorMessageAbsence() {
    return super.waitElementAbsence(selectors.date.errorMessage)
  }
}
