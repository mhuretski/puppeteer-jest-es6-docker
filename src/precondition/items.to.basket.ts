import { PagesMap } from '@classes/pages.map'
import { test } from '@actions'
import { logoS } from '@components/shared/util/constant'
import { defaultPDPPath } from '@components/shared/util/paths'
import ToastModal from '@components/modal/toast.modal'
import { AddToBasketInterface } from '@interfaces'

export const addToBasketWithToastVerification =
  async (message: string, page: AddToBasketInterface, toast: ToastModal) => {
    try {
      await page.addToBasket()
    } catch (e) {
      try {
        await toast.checkErrorPresence()
        console.log(message)
      } catch (ex) {
        throw new Error(`${message}\n1. ${e}\n2. ${ex}`)
      }
    }
  }

export const addItemToBasketFromPDP =
  async (pages: PagesMap, relativePathToPDP = defaultPDPPath) => {
    const HomePage = pages.homePage
    const Pdp = pages.productDetailsPage
    const Toast = pages.toastModal

    await HomePage.openRelative(relativePathToPDP, logoS)
    await addToBasketWithToastVerification('Item is not added to Basket from PDP', Pdp, Toast)
  }

export const addItemToBasketFromPLP = async (pages: PagesMap) => {
  const HomePage = pages.homePage
  const Category = pages.productLandingPage
  const Toast = pages.toastModal

  await HomePage.open()
  await HomePage.clickOnCategory()
  await addToBasketWithToastVerification('Item is not added to Basket from PLP', Category, Toast)
}

const checkAmountOfItemsInBasket = async (pages: PagesMap) => {
  await pages.basket.openThis()
  const result = await pages.header.getAmountOfProductsInMiniCart()
  expect(result).toBeGreaterThanOrEqual(2)
}

const addItemsToBasket = (pages: PagesMap) => {
  test('add items to basket from PLP and PDP', async () => {
    await addItemToBasketFromPLP(pages)
    await addItemToBasketFromPDP(pages)
    await checkAmountOfItemsInBasket(pages)
  })
}

export default addItemsToBasket
