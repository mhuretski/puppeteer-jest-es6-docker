import Rest from '@classes/util/rest'

const firstCarouselItemSelector = 'div[aria-hidden="false"]'

const selectors = {
  banner: {
    container: '#bodyBanner',
    scrollButtons: (position = 0) => `.slider-lead-navs-item-${position}`,
    itemButtons: '#bodyBanner .slider-lead-item-content-action',
  },
  categories: {
    container: '#bodyCategories',
    itemButtons: '#bodyCategories .page-content-categories-item',
  },
  recommendation: {
    container: '#bodyRecommendation',
    allCultures: '#bodyRecommendationAllCultures',
    cultureButton: `#bodyRecommendation ${firstCarouselItemSelector}`,
    itemsContainer: '#recommendedItemsContainer',
    closeItemsButton: '#recommendationCloseItemsButton',
    allProductsLink: '#recommendationToAllProductsLink',
    productItemButton: '#recommendedItemsContainer .card-product',
  },
  technologies: {
    container: '#bodyTech',
    goToAll: '#bodyTechGoToExploreAll',
    itemButtons: '#bodyTech .section-articles-item',
  },
  FAQ: {
    container: '#bodyFAQ',
    askAgro: '#bodyFAQAskAgro',
    askManager: '#bodyFAQAskManager',
    loggedContactManager: '#bodyFAQContactManLogged',
    contactUsUnlogged: '#bodyFAQContactUsUnlogged',
    contactUsLogged: '#bodyFAQContactUsLogged',
  },
  bestSellers: {
    container: '#bodyBestSellers',
    itemButtons: `#bodyBestSellers ${firstCarouselItemSelector}`,
  },
}

export default class HomePage extends Rest {
  static getSelectors = () => selectors

  async openPersonalManagerModal() {
    await super.click(selectors.FAQ.loggedContactManager)
  }

  async openBanner(position = 0) {
    await super.click(selectors.banner.scrollButtons(position))
    await super.clickOn(selectors.banner.itemButtons, position)
  }

  async clickOnCategory(position = 0) {
    await super.clickOn(selectors.categories.itemButtons, position)
  }

  async clickOnBestSeller(position = 0) {
    await super.clickOn(
      selectors.bestSellers.itemButtons, position,
    )
  }

  async expandCulture(position = 0) {
    await super.clickOn(
      selectors.recommendation.cultureButton, position,
    )
  }

  async closeRecommendation() {
    await super.click(selectors.recommendation.closeItemsButton)
  }

  async openProductFromRecommendation(position = 0) {
    await super.clickOn(
      selectors.recommendation.productItemButton, position,
    )
  }

  async openAllProductsPageFromRecommendation() {
    await super.clickAndWaitEndecaContent(
      selectors.recommendation.allProductsLink)
  }

  async clickOnAskAgro() {
    await super.clickAndWaitEndecaContent(selectors.FAQ.askAgro)
  }

  async clickOnAskManager() {
    await super.clickAndWaitEndecaContent(selectors.FAQ.askManager)
  }

  async openContactUsLogged() {
    await super.click(selectors.FAQ.contactUsLogged)
  }

  async openContactUsUnlogged() {
    await super.click(selectors.FAQ.contactUsUnlogged)
  }

  async clickOnTechnologiesLink(position = 0) {
    await super.clickOn(
      selectors.technologies.itemButtons, position,
    )
  }

  async clickOnTechnologiesResearchResult() {
    await super.click(selectors.technologies.goToAll)
  }
}
