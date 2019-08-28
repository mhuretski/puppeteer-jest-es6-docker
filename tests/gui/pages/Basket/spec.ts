'use strict'
import pages from '@pages'
import { exist, multiPack, test, ui } from '@actions'
import checkWithLogin from '@precondition/guest.and.logged.in'
import { defaultPDPPath } from '@components/shared/paths'
import { logo } from '@components/shared/constant'
import Basket from '@components/page/basket.page'
import emptyBasket from '@precondition/empty.basket'
import itemsToBasket from '@precondition/items.to.basket'

const basketSelectors = Basket.getSelectors()

multiPack('Basket', () => {
  const Header = pages.header
  const HomePage = pages.homePage
  const Category = pages.productLandingPage
  const Pdp = pages.productDetailsPage
  const Basket = pages.basket
  const Modal = pages.baseModal

  const checkExistence = (loggedInUser?: boolean) => {
    if (loggedInUser) {
      emptyBasket(pages)
      exist('go to catalog from basket', basketSelectors.goToCatalogFromEmptyBasket)
      itemsToBasket(pages)
      test('open basket', async () => Header.openBasket())
      exist('products', basketSelectors.products.container)
      exist('continue shopping', basketSelectors.continueShopping)
      exist('submit order', basketSelectors.submit)
      exist('date panel', basketSelectors.date.container)
      exist('start date', basketSelectors.date.startDate)
      exist('end date', basketSelectors.date.endDate)
      exist('item', basketSelectors.products.product)
      exist('item link to PDP', basketSelectors.products.pdpLink)
      exist('quantity', basketSelectors.products.quantity.container)
      exist('remove button', basketSelectors.products.remove)
    } else {
      exist('authorization request', basketSelectors.guestAuthorizationRequest)
    }
  }

  const executeUI = (loggedInUser?: boolean) => {
    ui('open basket', async () => Header.openBasket())
    if (loggedInUser) {
      ui('npk pdp', async () => HomePage.openRelative(defaultPDPPath, logo))
      ui('view image', async () => {

      })
      ui('download file', async () => Pdp.checkBrochure())
    }
  }

  checkWithLogin(pages, checkExistence, executeUI)
})
