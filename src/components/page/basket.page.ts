'use strict'
import AbstractContentObject from '@classes/util/abstract.content.object'
import quantity from '@components/shared/quantity'

const productsContainer = '#cartItemsContainer'
const product = `${productsContainer} .product-row`
const dateContainer = '#dateContainer'
const continueShopping = '#continueShopping'

const selectors = {
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
    startDate: '#startDateId',
    endDate: '#endDateId',
    closestAvailableDate: 'td[aria-disabled="false"]',
  },
  success: {
    title: '#orderSuccessTitle',
    continueShopping: continueShopping,
    startFromHomepage: '#startFromHomepage',
  },
}

export default class Basket extends AbstractContentObject {
  static getSelectors = () => selectors;

  async clearBasket() {
    await super.clickPuppeteer(selectors.removeAllItemsInBasketButton)
  }

  async checkBasketIsEmpty() {
    return super.waitFor(selectors.goToCatalogFromEmptyBasket)
  }
}
