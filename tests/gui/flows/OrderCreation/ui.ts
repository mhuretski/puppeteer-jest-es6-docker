import pages from '@pages'
import { exist, multiPack, test, ui } from '@actions'
import Basket from '@components/page/basket.page'
import { orderId } from '@precondition/login'
import emptyBasket from '@precondition/empty.basket'
import itemsToBasket from '@precondition/items.to.basket'
import { DYN_ADMIN } from '@const/properties/constants'
import loggedIn from '@precondition/logged.in'

const user = 1
const basketSelectors = Basket.getSelectors()

multiPack('Order creation', () => {
  const Basket = pages.basket

  const execute = () => {
    emptyBasket(pages)
    itemsToBasket(pages)
    test('open basket', async () => Basket.openThis())
    test('set valid end date', async () => {
      await Basket.setClosestEndDate()
      const end = await Basket.getEndDate()
      expect(end.length).toEqual(10)
    })
    ui('submit order front', async () => {
      await Basket.confirmTerms()
      await Basket.submit()
      await Basket.checkSuccess()
    })
    exist('front title', basketSelectors.success.title)
    exist('front start from homepage', basketSelectors.success.startFromHomepage)
    exist('front continue shopping', basketSelectors.success.continueShopping)
    test('order existence in system', async () => {
      await pages.orderRepository.open(DYN_ADMIN.OrderRepository)
      const status = await pages.orderRepository.getOrderStatus(orderId)
      expect(status).toBe('SUBMITTED')
    })
  }

  loggedIn(pages, user, execute)
})
