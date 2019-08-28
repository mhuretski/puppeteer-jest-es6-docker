'use strict'
import Listing from './listing/listing'
import quantity from '@components/shared/quantity'
import { BACKSPACE, DELETE, LEFT, RIGHT } from '@const/global/keyboard.keys'
import { defaultWaitTimer } from '@const/global/timers'
import { buildSpecificTempDir } from '@const/global/paths'

import { convertPDFToJPG, defaultFileName } from '@app/util/downloads'
import { image } from '@components/shared/constant'

const cropsContainer = '#pdpCrops'
const thumbnailContainer = '#pdpImageThumbnails'
const addToCartContainer = '#pdpAddToCart'

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
    disabled: `${addToCartContainer} button[disabled]`,
    contactUs: '#pdpContactUs',
    quantity: quantity,
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

export default class ProductDetailsPage extends Listing {
  static getSelectors = () => selectors

  async addToBasket(isMobile: boolean) {
    isMobile
      ? await super.tap(selectors.actions.addToCart)
      : await super.clickPuppeteer(selectors.actions.addToCart)
    await super.waitElementToDisappear(selectors.actions.disabled)
  }

  async openModal() {
    await super.clickPuppeteer(selectors.actions.contactUs)
  }

  async increase(amount = 1) {
    for (let i = 0; i < amount; i++) {
      // eslint-disable-next-line no-await-in-loop
      await super.clickPuppeteer(selectors.actions.quantity.increase)
    }
  }

  async decrease(amount = 1) {
    for (let i = 0; i < amount; i++) {
      // eslint-disable-next-line no-await-in-loop
      await super.clickPuppeteer(selectors.actions.quantity.decrease)
    }
  }

  async itemsToAdd(number: number) {
    if (number >= 1 && number <= 99999) {
      const value = number.toString()
      await super.click(selectors.actions.quantity.input)
      await super.pressKeyboardKey(DELETE)
      if (value.length === 1) {
        await super.type(selectors.actions.quantity.input, value)
        await super.pressKeyboardKey(LEFT)
        await super.pressKeyboardKey(BACKSPACE)
      } else {
        await super.type(selectors.actions.quantity.input, value[0])
        await super.pressKeyboardKey(LEFT)
        await super.pressKeyboardKey(BACKSPACE)
        await super.pressKeyboardKey(RIGHT)
        await super.type(selectors.actions.quantity.input, value.substring(1))
      }
    }
  }

  async getCurrentQuantity(timeout = defaultWaitTimer) {
    return super.getValue(selectors.actions.quantity.input, timeout)
  }

  async viewImage(position = 0, timeout = defaultWaitTimer) {
    const img = await super.getElementFromListPuppeteer(
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

  async checkFile(selector: string,
          downloadFolder = buildSpecificTempDir,
          fileName = defaultFileName,
          convert = convertPDFToJPG) {
    const path = await this.downloadFile(
      selector,
      downloadFolder,
      fileName,
      convert)
    await super.open(path)
    return image
  }
}
