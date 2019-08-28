'use strict'
import { PagesMap } from '@classes/pages.map'
import { test } from '@actions'
import { logo } from '@components/shared/constant'

const emptyBasket = (po: PagesMap) => {
  test('empty basket', async () => {
    const HomePage = po.homePage
    const Basket = po.basket

    await HomePage.openRelative('cart', logo)
    try {
      await Basket.checkBasketIsEmpty()
    } catch (e) {
      await Basket.clearBasket()
    }
    const result = await Basket.checkBasketIsEmpty()
    expect(result).toBeTruthy()
  })
}

export default emptyBasket
