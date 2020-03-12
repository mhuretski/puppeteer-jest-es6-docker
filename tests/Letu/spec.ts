import { singlePack, test } from '@actions'
import po from '@pages'
import { browser } from '@config/jest.settings'
import { CURRENT_DATE } from '@const/global/constants'

singlePack('products', () => {
  test('letu test', async () => {
    const LetuPage = po?.rest

    const path = 'https://www.letu.ru/product/l-etual-podarochnaya-korobka-l-etual-srednyaya/60800005/sku/75200005'
    await LetuPage.open(path, true, 'networkidle0')

    await LetuPage.clickWithResponse('.btn.btn-lg.btn-primary', true, 'addItemToOrder')
    await LetuPage.clickWithResponse('a[href="cart"]', true, 'cart')
    await LetuPage.clickWithResponse('.alert.alert-info .pseudolink', true, 'storesByCity')
    await LetuPage.clickWithResponse('.btn-rd.btn-rd-big.btn-rd-block', true, 'updateShippingDetails')
    await LetuPage.clickWithResponse('label[data-bind*="courier"', true, 'updateShippingDetails', 'orderDelivery')
    await LetuPage.clickWithResponse('.products-list-table-actions-button-block', true, 'checkout', 'checkoutDelivery')

    const selector = 'select[data-bind*="deliveryDates"]'
    await LetuPage.selectWithResponse(selector, 3, ['updateShippingDetails'])

    const delivery = await LetuPage.getText('.checkout-form-text.font-bold')
    expect(delivery).toContain('Курьерская доставка')
    const siteDates = await LetuPage.getText(selector)

    const date = new Date()
    const parsedDate = date.toLocaleDateString().split('/')
    const day = parseInt(parsedDate[1])
    const nextDay = `${(day.toString().length === 1) ? ('0' + day) : day}.${(parsedDate[0].length === 1) ? ('0' + parsedDate[0]) : parsedDate[0]}.${parsedDate[2]}`

    expect(CURRENT_DATE).toEqual(nextDay)

    expect(siteDates).toContain(CURRENT_DATE)

    await browser.close()
  })
})
