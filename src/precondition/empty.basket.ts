import { PagesMap } from '@classes/pages.map'
import { test } from '@actions'

export const emptyBasketExecute = async (pages: PagesMap) => {
  const Header = pages.header
  const Basket = pages.basket

  // noinspection ES6MissingAwait
  const openBasket = Basket.openThis()
  const itemsExist = await Basket.itemsInBasketExist()
  await Promise.resolve(openBasket)
    .catch(e => console.log('emptyBasketExecute', e))
  if (itemsExist) {
    await Basket.clearBasket()
  }
  const result = await Basket.checkBasketIsEmpty()
  expect(result).toBeTruthy()
  const amount = await Header.getAmountOfProductsInMiniCart()
  expect(amount).toBeLessThanOrEqual(0)
}

const emptyBasket = (pages: PagesMap, name: string = 'empty basket') => {
  test(name, async () => {
    await emptyBasketExecute(pages)
  })
}

export default emptyBasket
