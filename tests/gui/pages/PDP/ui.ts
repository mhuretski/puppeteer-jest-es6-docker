'use strict'
import pages from '@pages'
import { exist, multiPack, test, ui } from '@actions'
import checkWithLogin from '@precondition/guest.and.logged.in'
import { defaultPDPPath } from '@components/shared/paths'
import ProductDetailsPage from '@components/page/product.details.page'
import { alert, logo } from '@components/shared/constant'
import { isMobileDevice } from '@precondition/open.homepage'
import emptyBasket from '@precondition/empty.basket'

const pdpSelectors = ProductDetailsPage.getSelectors()

multiPack('Product Details Page', () => {
  const HomePage = pages.homePage
  const Pdp = pages.productDetailsPage
  const Modal = pages.baseModal

  const checkExistence = (loggedInUser?: boolean) => {
    test('open pdp', async () => HomePage.openRelative(defaultPDPPath, logo))
    exist('main image', pdpSelectors.image.main)
    exist('additional images', pdpSelectors.image.thumbnails.container)
    exist('title', isMobileDevice => (isMobileDevice)
      ? pdpSelectors.data.mobile.title
      : pdpSelectors.data.desktop.title)
    exist('formula', isMobileDevice => (isMobileDevice)
      ? pdpSelectors.data.mobile.formula
      : pdpSelectors.data.desktop.formula)
    exist('description', pdpSelectors.data.description)
    exist('sortPack', pdpSelectors.data.sortPack)
    exist('color', pdpSelectors.data.color)
    exist('crops', pdpSelectors.data.crops.container)
    exist('documents', pdpSelectors.documents.container)
    if (loggedInUser) {
      exist('add to cart', pdpSelectors.actions.addToCart)
      exist('quantity', pdpSelectors.actions.quantity.container)
    } else {
      exist('contact us', pdpSelectors.actions.contactUs)
    }
    exist('composition', pdpSelectors.info.composition)
    exist('advantages', pdpSelectors.info.advantages)
    exist('usage', pdpSelectors.info.usage)
  }

  const executeUI = (loggedInUser?: boolean) => {
    if (loggedInUser) emptyBasket(pages)
    ui('npk pdp', async () => HomePage.openRelative(defaultPDPPath, logo))
    ui('view image', async () => {
      const image = await Pdp.viewImage(1)
      const property = 'src'
      const imageUrl = await Pdp.getAttribute(property, image)
      const mailUrl = await Pdp.getAttribute(property, pdpSelectors.image.main)
      expect(mailUrl).toEqual(imageUrl)
      return pdpSelectors.image.container
    })
    ui('download file', async () => Pdp.checkBrochure())
    if (loggedInUser) {
      ui('increase quantity', async () => {
        await Pdp.increase(2)
        const res = await Pdp.getCurrentQuantity()
        expect(res).toBe(3)
        return pdpSelectors.actions.quantity.container
      })
      ui('decrease quantity', async () => {
        await Pdp.decrease()
        const res = await Pdp.getCurrentQuantity()
        expect(res).toBe(2)
        return pdpSelectors.actions.quantity.container
      })
      ui('add to basket', async () => {
        await Pdp.addToBasket(isMobileDevice)
        const res = await Pdp.getCurrentQuantity()
        expect(res).toBe(1)
        return pdpSelectors.actions.quantity.container
      })
      ui('add max with notification', async () => {
        const amount = 99999
        await Pdp.itemsToAdd(amount)
        const res = await Pdp.getCurrentQuantity()
        expect(res).toBe(amount)
        await Pdp.addToBasket(isMobileDevice)
        return alert
      })
      ui('add max with error', async () => {
        await Pdp.addToBasket(isMobileDevice)
        return pdpSelectors.actions.quantity.container
      })
      emptyBasket(pages)
    } else {
      ui('contact us', async () => Pdp.openModal())
      test('close modal', async () => Modal.close())
    }
  }

  checkWithLogin(pages, checkExistence, executeUI)
})
