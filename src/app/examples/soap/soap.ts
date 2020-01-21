import {
  DataSoap,
  multiSoapTest,
  singlePack,
  test,
} from '@app/global/actions'
import {
  getInstance,
  getResponseTag,
} from '@soap'
import request from '@soapData/description.error'
import { SOAP } from '@const/properties/constants'
import { productResponseMask } from '@app/soap/masks'

/**
 * Example for single soap run
 */
singlePack('products', () => {
  test('soap test 1', async () => {
    const soap = getInstance(SOAP.addProduct)

    const res = await soap(request, productResponseMask)

    expect(getResponseTag(res, 'STATUS_OWC')).toContain('ERROR')
    expect(getResponseTag(res, 'INVENTORY_ITEM_ID')).toContain('593')
    expect(getResponseTag(res, 'ERROR_CODE')).toContain('REQUIRED_FIELD_MISSED')
  })
})

/**
 * Example for multi soap run
 */
const data: DataSoap[] = [
  {
    name: 'soap test example 1',
    request: request,
    responseMask: productResponseMask,
    expect: [
      { tag: 'ERROR_CODE', expected: 'REQUIRED_FIELD_MISSED' },
      { tag: 'STATUS_OWC', expected: 'ERROR' },
      { tag: 'INVENTORY_ITEM_ID', expected: '593' },
    ],
  },
  {
    name: 'soap test example 2',
    request: request,
    responseMask: productResponseMask,
    expect: [
      { tag: 'ERROR_CODE', expected: 'REQUIRED_FIELD_MISSED' },
      { tag: 'STATUS_OWC', expected: 'ERROR' },
      { tag: 'INVENTORY_ITEM_ID', expected: '593' },
    ],
  },
]
multiSoapTest('Products Pack', 'webservice/addProduct', data)
