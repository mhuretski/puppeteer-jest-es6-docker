import {
  multiSoapTest,
  singlePack,
  test,
} from '@app/global/actions'
import {
  getInstance,
  getResponseTag,
  productResponseMask,
} from '@app/soap/soap'

/**
 * Example for single soap run
 */
singlePack('products', () => {
  test('soap test 1', async () => {
    const soap = getInstance('webservice/addProduct')

    const res = await soap('tests/api/soap/data/existing_sku.xml', productResponseMask)

    expect(getResponseTag(res, 'STATUS_OWC')).toContain('ERROR')
    expect(getResponseTag(res, 'INVENTORY_ITEM_ID')).toContain('555444111')
    expect(getResponseTag(res, 'ERROR_CODE')).toContain('Can\'t recreate sku')
  })
})

/**
 * Example for multi soap run
 */
const data = [
  {
    name: 'soap test example 1',
    requestFile: 'tests/api/soap/data/existing_sku.xml',
    responseMask: productResponseMask,
    expect: [
      { tag: 'ERROR_CODE', expected: 'Can\'t recreate sku' },
      { tag: 'STATUS_OWC', expected: 'ERROR' },
      { tag: 'INVENTORY_ITEM_ID', expected: '555444111' },
    ],
  },
  {
    name: 'soap test example 2',
    requestFile: 'tests/api/soap/data/request1.xml',
    responseMask: productResponseMask,
    expect: [
      { tag: 'ERROR_CODE', expected: 'Can\'t recreate sku' },
      { tag: 'STATUS_OWC', expected: 'ERROR' },
      { tag: 'INVENTORY_ITEM_ID', expected: '555444111' },
    ],
  },
]
multiSoapTest('Products Pack', 'webservice/addProduct', data)
