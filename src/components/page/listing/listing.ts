'use strict'
import AbstractContentObject from '@classes/util/abstract.content.object'
import { ElementHandle } from 'puppeteer'
import quantity from '@components/shared/quantity'

const productsContainer = '#productItemsList'
const product = `${productsContainer} .product-item`
const navigationContainer = '#navigationFacets'
const navigationFacet = `${navigationContainer} .collapse-element-default`

const selectors = {
  navigation: {
    container: navigationContainer,
    clearFacets: '#clearFacetsButton',
    facet: {
      element: navigationFacet,
      title: `${navigationFacet}-header`,
      checkbox: `${navigationFacet} label`,
    },
  },
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
    actionButton: `${product} .product-item-data-action-button`,
  },
  pagination: {
    container: '#paginationId',
    first: '#firstPagination',
    previous: '#previousPagination',
    next: '#nextPagination',
    last: '#lastPagination',
    item: '#paginationList a',
  },
  sorting: {
    container: '#sortingOption',
    option: 'option',
  },
  displayAmount: '#listingDisplayedAmountOfProducts',
}

export default class Listing extends AbstractContentObject {
  static getListingSelectors = () => selectors;

  async goToPDP(position = 0) {
    await super.clickOnPuppeteer(selectors.products.pdpLink, position)
  }

  async goToPDPAndBack(position = 0) {
    await this.goToPDP(position)
    await super.screenshot()
    return super.goBack()
  }

  async addToBasketOrOpenModal(position = 0) {
    await super.clickOnPuppeteer(selectors.products.actionButton, position)
  }

  async clickOnFacet(position: number): Promise<ElementHandle> {
    return super.clickAndGetOnPuppeteer(
      selectors.navigation.facet.title, position)
  }

  async clickOnFacetOption(facet: ElementHandle, position = 0) {
    const checkbox = await super.getElementFromParentElementPuppeteer(
      facet, selectors.navigation.facet.checkbox, position)
    await checkbox.click()
    await super.waitForSpinnerToDisappear()
  }

  async clickFacetOptionWithExpand(
          facetPosition: number,
          checkboxPosition: number) {
    const facet = await this.clickOnFacet(facetPosition)
    await this.clickOnFacetOption(facet, checkboxPosition)
  }

  async clickFacetOptionWithoutExpand(
          facetPosition: number,
          checkboxPosition: number) {
    const facet = await super.getElementFromListPuppeteer(
      selectors.navigation.facet.element, facetPosition)
    await this.clickOnFacetOption(facet, checkboxPosition)
  }

  /*
   * If @param option is number, function takes position in array.
   * If @param option is string, it's value.
   */
  async selectSortByOption(option: number | string, timeout?: number) {
    await super.selectOption(
      selectors.sorting.container,
      option,
      selectors.sorting.option,
      timeout)
    await super.waitForSpinnerToDisappear()
  }

  async clearFacets() {
    await super.clickPuppeteer(selectors.navigation.clearFacets)
  }

  async openNextPage() {
    await super.clickPuppeteer(selectors.pagination.next)
    await super.waitForSpinnerToDisappear()
  }

  async openPreviousPage() {
    await super.clickPuppeteer(selectors.pagination.previous)
    await super.waitForSpinnerToDisappear()
  }

  async openFirstPage() {
    await super.clickPuppeteer(selectors.pagination.first)
    await super.waitForSpinnerToDisappear()
  }

  async openLastPage() {
    await super.clickPuppeteer(selectors.pagination.last)
    await super.waitForSpinnerToDisappear()
  }

  async openPaginationPage(position = 0) {
    await super.clickOnPuppeteer(selectors.pagination.item, position)
  }
}
