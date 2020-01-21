'use strict'
import Rest from '@classes/util/rest'

const container = '#breadcrumbsId'

const selectors = {
  container: container,
  item: `${container} li`,
}

export default class Breadcrumbs extends Rest {
  static getSelectors = () => selectors

  async clickOnCrumb(position = 0) {
    await (await super.getElementFromListPuppeteer(selectors.item, position))
      .click()
  }

  async countBreadcrumbs() {
    await super.waitFor(selectors.item)
    return super.countElementsPuppeteer(selectors.item)
  }
}
