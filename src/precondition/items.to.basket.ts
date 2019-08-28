'use strict'
import { PagesMap } from '@classes/pages.map'
import { test } from '@actions'
import { logo } from '@components/shared/constant'
import { defaultPDPPath } from '@components/shared/paths'
import { isMobileDevice } from '@precondition/open.homepage'

const addItemsToBasket = (po: PagesMap) => {
  test('add items to basket from PLP and PDP', async () => {
    const Header = po.header
    const HomePage = po.homePage
    const Category = po.productLandingPage
    const Pdp = po.productDetailsPage

    await HomePage.open()
    await HomePage.clickOnCategory()
    await Category.addToBasketOrOpenModal()

    await HomePage.openRelative(defaultPDPPath, logo)
    await Pdp.addToBasket(isMobileDevice)

    const result = await Header.getAmountOfProductsInMiniCart()
    expect(result).toBeGreaterThanOrEqual(2)
  })
}

export default addItemsToBasket
