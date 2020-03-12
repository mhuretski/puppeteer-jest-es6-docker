import { PagesMap } from '@classes/pages.map'
import { test } from '@actions'
import { emptyBasketExecute } from '@precondition/empty.basket'
import { addItemToBasketFromPDP } from '@precondition/items.to.basket'
import { defaultTimeout } from 'src/app/const/global/timers'

export const submitOrderExecute = async (pages: PagesMap) => {
  const Basket = pages.basket

  await emptyBasketExecute(pages)
  await addItemToBasketFromPDP(pages)
  await Basket.openThis()
  await Basket.setClosestEndDate()
  const end = await Basket.getEndDate()
  expect(end.length).toEqual(10)
  await Basket.confirmTerms()
  await Basket.submit()
  await Basket.checkSuccess()
}

const submitOrder = (pages: PagesMap): void => {
  test('submit order', async () => {
    await submitOrderExecute(pages)
  }, defaultTimeout * 2)
}

export default submitOrder
