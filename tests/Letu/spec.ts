import { singlePack, test } from '@actions'
import po from '@pages'
import { browser } from '@config/jest.settings'

singlePack('products', () => {
  test('letu test', async () => {
    const LetuPage = po.rest

    const path = 'https://www.letu.ru/product/l-etual-podarochnaya-korobka-l-etual-srednyaya/60800005/sku/75200005'
    await LetuPage.open(path, true, undefined)

    await LetuPage.clickWithResponse('.btn.btn-lg.btn-primary', true, 'addItemToOrder')
    await LetuPage.clickWithResponse('a[href="cart"]', true, 'cart')
    await LetuPage.clickWithResponse('.alert.alert-info .pseudolink', true, 'storesByCity')
    await LetuPage.clickWithResponse('.btn-rd.btn-rd-big.btn-rd-block', true, 'updateShippingDetails')
    await LetuPage.clickWithResponse('label[data-bind*="courier"', true, 'updateShippingDetails', 'orderDelivery')
    await LetuPage.clickWithResponse('.products-list-table-actions-button-block', true, 'checkout', 'checkoutDelivery')

    const selector = 'select[data-bind*="deliveryDates"]'
    await LetuPage.selectWithResponse(selector, 3)

    const delivery = await LetuPage.getText('.checkout-form-text.font-bold')
    expect(delivery).toContain('Курьерская доставка')
    const date = await LetuPage.getText(selector)
    expect(date).toContain('27.01.2020')

    await browser.close()
  })
})
