import pages from '@pages'
import { exist, multiPack, test, ui } from '@actions'
import checkWithLogin from '@precondition/guest.and.logged.in'
import { defaultPDPPath } from '@components/shared/util/paths'
import ProductDetailsPage from '@components/page/product.details.page'
import { alertS, logoS } from '@components/shared/util/constant'
import emptyBasket from '@precondition/empty.basket'
import { addToBasketWithToastVerification } from '@precondition/items.to.basket'

const user = 3
const pdpSelectors = ProductDetailsPage.getSelectors()

multiPack('Product Details Page', () => {
  const HomePage = pages.homePage
  const Pdp = pages.productDetailsPage
  const Toast = pages.toastModal
  const Modal = pages.baseModal

  const checkExistence = (loggedInUser?: boolean) => {
    test('open pdp', async () => HomePage.openRelative(defaultPDPPath, logoS))
    exist('main image', pdpSelectors.image.main)
    exist('additional images', pdpSelectors.image.thumbnails.container)
    exist('title', isMobileDevice => (isMobileDevice) ?
      pdpSelectors.data.mobile.title :
      pdpSelectors.data.desktop.title)
    exist('formula', isMobileDevice => (isMobileDevice) ?
      pdpSelectors.data.mobile.formula :
      pdpSelectors.data.desktop.formula)
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
    ui('npk pdp', async () => HomePage.openRelative(defaultPDPPath, logoS))
    ui('view image', async () => {
      const image = await Pdp.viewImage(1)
      const property = 'src'
      const imageUrl = await Pdp.getAttribute(property, image)
      const mailUrl = await Pdp.getAttribute(property, pdpSelectors.image.main)
      expect(mailUrl).toEqual(imageUrl)
      return pdpSelectors.image.container
    })
    ui('download file', async () => Pdp.checkBrochure())
    test('npk pdp reopen', async () => HomePage.openRelative(defaultPDPPath, logoS))
    if (loggedInUser) {
      ui('increase quantity', async () => {
        await Pdp.increase(2)
        const res = await Pdp.getCurrentQuantity()
        expect(res).toBe(1.2)
        return pdpSelectors.actions.quantity.container
      })
      ui('decrease quantity', async () => {
        await Pdp.decrease()
        const res = await Pdp.getCurrentQuantity()
        expect(res).toBe(1.1)
        return pdpSelectors.actions.quantity.container
      })
      ui('add to basket', async () => {
        await Pdp.addToBasket()
        const res = await Pdp.getCurrentQuantity()
        expect(res).toBe(1)
        return pdpSelectors.actions.quantity.container
      })
      ui('add max', async () => {
        const amount = 99999
        await Pdp.itemsToAdd(amount)
        const res = await Pdp.getCurrentQuantity()
        expect(res).toBe(amount)
        await Pdp.addToBasket()
        return pdpSelectors.actions.addToCart
      })
      ui('success notification is shown', async () => {
        await Toast.checkSuccessPresence()
        const res = await Pdp.getCurrentQuantity()
        expect(res).toBe(1)
        return alertS
      })
      ui('error notification is shown', async () => {
        await Toast.waitSuccessAbsence()
        await addToBasketWithToastVerification('Toast is not shown', Pdp, Toast)
        return alertS
      })
      emptyBasket(pages)
    } else {
      ui('contact us', async () => Pdp.openModal())
      test('close modal', async () => Modal.close())
    }
  }

  checkWithLogin(pages, user, checkExistence, executeUI)
})
