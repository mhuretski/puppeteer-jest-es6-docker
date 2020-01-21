import { singlePack, test } from '@actions'
import po from '@pages'
import { browser } from '@config/jest.settings'

singlePack('products', () => {
  test('letu test', async () => {
    const LetuPage = po.rest
    const letuClick = async (selector: string, waitSpinner = true,
      ...rest: Array<string>) => {
      const rests: Array<Promise<any>> = []
      rest.forEach(obj => rests.push(LetuPage.waitForResponseURLToContain(obj)))
      await LetuPage.clickPuppeteer(selector)
      await Promise.all(rests).catch(e => console.log(e))
      if (waitSpinner) {
        await LetuPage.waitForSpinnerToDisappear()
      }
    }

    const path = 'https://www.letu.ru/product/l-etual-podarochnaya-korobka-l-etual-srednyaya/60800005/sku/75200005'
    await LetuPage.open(path, true, undefined)

    await letuClick('.btn.btn-lg.btn-primary', true, 'addItemToOrder')
    await letuClick('a[href="cart"]', true, 'cart')
    await letuClick('.alert.alert-info .pseudolink', true, 'storesByCity')
    await letuClick('.btn-rd.btn-rd-big.btn-rd-block', true, 'updateShippingDetails')
    await letuClick('label[data-bind*="courier"', true, 'updateShippingDetails', 'orderDelivery')
    await letuClick('.products-list-table-actions-button-block', true, 'checkout', 'checkoutDelivery')

    const delivery = await LetuPage.getText('.checkout-form-text.font-bold')
    expect(delivery).toContain('Курьерская доставка')

    const result = await LetuPage.getText('.score-section_big .score-section__ltext')
    expect(result).toContain('Итого')

    await browser.close()
  })
})
