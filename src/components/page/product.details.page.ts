import quantity, { itemsToAdd } from '@components/shared/util/quantity'
import { defaultWaitTimer } from '@const/global/timers'
import { buildSpecificTempDir } from '@const/global/paths'
import { convertPDFToJPG, defaultFileName } from '@app/util/downloads'
import { imageS } from '@components/shared/util/constant'
import { AddToBasketInterface } from '@interfaces'
import Rest from '@classes/util/rest'

const cropsContainer = '#pdpCrops'
const thumbnailContainer = '#pdpImageThumbnails'
const addToCartContainer = '#pdpAddToCart button'

const selectors = {
  image: {
    container: '#pdpImageContainer',
    main: '#pdpMainImg',
    thumbnails: {
      container: thumbnailContainer,
      item: `${thumbnailContainer} img`,
    },
  },
  data: {
    container: '#pdpData',
    desktop: {
      title: '#pdpTitle',
      formula: '#pdpFormula',
    },
    mobile: {
      title: '#pdpMobileTitle',
      formula: '#pdpMobileFormula',
    },
    description: '#pdpDescription',
    producer: '#pdpProducer',
    sortPack: '#pdpSortPack',
    color: '#pdpColor',
    crops: {
      container: cropsContainer,
      item: `${cropsContainer} .icon`,
    },
  },
  documents: {
    container: '#pdpDocuments',
    certificate: '#pdpCertificate',
    brochure: '#pdpBrochure',
  },
  actions: {
    addToCart: addToCartContainer,
    disabled: `${addToCartContainer}[disabled]`,
    enabled: '#addToBasketEnabled',
    contactUs: '#pdpContactUs button',
    quantity: {
      container: `div[id*="${quantity.container}"]`,
      increase: `div[id*="${quantity.increase}"] button`,
      input: `input[id*="${quantity.input}"]`,
      decrease: `div[id*="${quantity.decrease}"] button`,
    },
  },
  info: {
    container: '#pdpInfo',
    composition: '#pdpComposition',
    advantages: '#pdpAdvantages',
    usage: '#pdpUsage',
  },
  upsells: {
    container: '#pdpUpsells',
  },
  recommendations: {
    container: '#pdpRecommendations',
  },
}

export default class ProductDetailsPage
  extends Rest implements AddToBasketInterface {
  static getSelectors = () => selectors

  async addToBasket() {
    await super.waitFor(selectors.actions.enabled)
    const clicked = (await super.isMobile()) ?
      super.click(selectors.actions.addToCart) :
      super.click(selectors.actions.addToCart)
    const isAddedResponse = super.waitAddItemToOrderResponse()
    const shoppingCartSummaryResponse = super.waitShoppingCartSummaryResponse()
    await super.checkResponseForErrors('Add to basket response error.', isAddedResponse)

    await super.waitForElement(selectors.actions.disabled)
    await Promise.all([clicked, shoppingCartSummaryResponse])
      .catch(e => console.log('addToBasket', e))
  }

  async waitForAddToBasketButtonAnimation() {
    await super.waitElementToDisappear(selectors.actions.disabled)
    await super.waitFor(selectors.actions.enabled)
  }

  async openModal() {
    await super.click(selectors.actions.contactUs)
  }

  async increase(amount = 1) {
    for (let i = 0; i < amount; i++) {
      await super.click(selectors.actions.quantity.increase)
    }
  }

  async decrease(amount = 1) {
    for (let i = 0; i < amount; i++) {
      await super.click(selectors.actions.quantity.decrease)
    }
  }

  async itemsToAdd(number: number) {
    await itemsToAdd(this, number, 0, selectors.actions.quantity.input)
  }

  async getCurrentQuantity(timeout = defaultWaitTimer) {
    return super.getFloatValue(selectors.actions.quantity.input, timeout)
  }

  async viewImage(position = 0, timeout = defaultWaitTimer) {
    const img = await super.getElementFromList(
      selectors.image.thumbnails.item, position, timeout)
    await img.click()
    return img
  }

  async checkCertificate() {
    return this.checkFile(selectors.documents.certificate)
  }

  async checkBrochure() {
    return this.checkFile(selectors.documents.brochure)
  }

  /*
   * On Windows without docker requires http://www.graphicsmagick.org/INSTALL-windows.html
   */
  async checkFile(selector: string,
          downloadFolder = buildSpecificTempDir,
          fileName = defaultFileName,
          convert = convertPDFToJPG) {
    const path = await this.downloadFile(
      selector,
      downloadFolder,
      fileName,
      convert)
    await super.open(super.fileLinuxPathToChromePath(path))
    return imageS
  }
}
