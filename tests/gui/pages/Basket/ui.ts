import pages from '@pages'
import { exist, multiPack, test, ui } from '@actions'
import checkWithLogin from '@precondition/guest.and.logged.in'
import Basket from '@components/page/basket.page'
import emptyBasket from '@precondition/empty.basket'
import itemsToBasket from '@precondition/items.to.basket'

const user = 2
const basketSelectors = Basket.getSelectors()

multiPack('Basket', () => {
  const Header = pages.header
  const Basket = pages.basket
  const Search = pages.searchPage

  const checkExistence = (loggedInUser?: boolean) => {
    test('open basket', async () => Basket.openThis())
    if (loggedInUser) {
      emptyBasket(pages)
      exist('go to catalog from basket', basketSelectors.goToCatalogFromEmptyBasket)
      itemsToBasket(pages)
      test('open basket', async () => Header.openBasket())
      exist('products', basketSelectors.products.container)
      exist('continue shopping', basketSelectors.continueShopping)
      exist('submit order', basketSelectors.submit)
      test('date panel', async () => Basket.toBeDefined(basketSelectors.date.container, false))
      test('start date', async () => Basket.toBeDefined(basketSelectors.date.startDate.container, false))
      test('end date', async () => Basket.toBeDefined(basketSelectors.date.endDate.container, false))
      exist('item', basketSelectors.products.product)
      exist('item link to PDP', basketSelectors.products.pdpLink)
      exist('quantity', basketSelectors.products.quantity.container)
      exist('remove button', basketSelectors.products.remove)
    } else {
      exist('authorization request', basketSelectors.guestAuthorizationRequest)
    }
  }

  const executeUI = (loggedInUser?: boolean) => {
    if (loggedInUser) {
      test('open basket', async () => Header.openBasket())
      test('start date is set by default', async () => {
        const start = await Basket.getStartDate()
        expect(start.length).toEqual(10)
      })
      ui('remove dates', async () => {
        await Basket.removeDates()
      })
      emptyBasket(pages, 'remove all items from basket')
      ui('view empty basket', async () => {
        const result = await Basket.checkBasketIsEmpty()
        expect(result).toBeTruthy()
      })
      test('empty mini basket', async () => {
        const amount = await Header.getAmountOfProductsInMiniCart()
        expect(amount).toEqual(0)
      })
      test('go to catalog from empty basket', async () => {
        await Basket.goToCatalogFromEmptyBasket()
        const result = await Search.waitForListingPageElements()
        expect(result).toBeTruthy()
      })
      itemsToBasket(pages)
      test('open basket', async () => Header.openBasket())
      ui('date error appearance after submit', async () => {
        await Basket.confirmTerms()
        await Basket.submit()
        await Basket.checkErrorMessagePresence()
        return basketSelectors.date.errorMessage
      })
      test('remove dates', async () => {
        await Basket.removeDates()
        const start = await Basket.getStartDate()
        expect(start.length).toEqual(0)
        const end = await Basket.getEndDate()
        expect(end.length).toEqual(0)
      })
      test('set valid start date', async () => {
        await Basket.setClosestStartDate()
        const start = await Basket.getStartDate()
        expect(start.length).toEqual(10)
      })
      test('set valid end date', async () => {
        await Basket.setClosestEndDate()
        const end = await Basket.getEndDate()
        expect(end.length).toEqual(10)
      })
      test('error message disappeared', async () => {
        const noErrorMessage = await Basket.waitDateErrorMessageAbsence()
        expect(noErrorMessage).toBeTruthy()
      })
      test('count amount of items', async () => {
        const amount = await Basket.getAmountOfProducts()
        expect(amount).toEqual(2)
      })
      test('remove item from basket', async () => {
        await Basket.removeItem(0)
        const amount = await Basket.getAmountOfProducts()
        expect(amount).toEqual(1)
      })
      ui('increase quantity', async () => {
        await Basket.increaseQuantity(3, 0)
        const res = await Basket.getCurrentFloatQuantity(0)
        expect(res).toBe(1.3)
        return Basket.screenshotQuantity(0)
      })
      ui('decrease quantity', async () => {
        await Basket.decreaseQuantity(2, 0)
        const res = await Basket.getCurrentFloatQuantity(0)
        expect(res).toBe(1.1)
        return Basket.screenshotQuantity(0)
      })
      ui('max quantity', async () => {
        const amount = 99999
        await Basket.setQuantityOfItem(amount, 0)
        const res = await Basket.getCurrentFloatQuantity(0)
        expect(res).toBe(amount)
        return Basket.screenshotQuantity(0)
      })
      test('continue shopping', async () => {
        await Basket.continueShopping()
        const result = await Search.waitForListingPageElements()
        expect(result).toBeTruthy()
      })
      emptyBasket(pages, 'clear basket after all')
    } else {
      ui('basket ui', async () => Basket.openThis())
    }
  }

  checkWithLogin(pages, user, checkExistence, executeUI)
})
