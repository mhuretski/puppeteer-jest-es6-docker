import { singlePack, test } from '@actions'
import pages from '@pages'

const LetuHeader = pages.letuHeader

singlePack('main page', () => {
  test('is header exists', async () => {
    await LetuHeader.open()

    expect(await LetuHeader.checkIsHeaderExists()).toBeTruthy()
  })

  test('is favorites empty', async () => {
    const wishListText = await LetuHeader.getWishListQuantity()

    expect(wishListText).toEqual('0')
  })

  test('is cart empty', async () => {
    const cartLikText = await LetuHeader.getCartLikQuantity()

    expect(cartLikText).toEqual('0')
  })

  test('is guest user', async () => {
    const loginLikText = await LetuHeader.getLoginLinkText()

    expect(loginLikText).toEqual('Войти')
  })
})
