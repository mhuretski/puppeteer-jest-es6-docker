'use strict'
import { productResponseMask } from '@soap'
import { multiSoapTest } from '@app/global/actions'

const data = [
  {
    name: 'attempt to recreate SKU INVENTORY_ITEM_ID and SEGMENT1 are unique combination',
    requestFile: 'tests/api/soap/data/existing_sku.xml',
    responseMask: productResponseMask,
    expect: [
      { tag: 'ERROR_CODE', expected: 'Can\'t recreate sku' },
      { tag: 'STATUS_OWC', expected: 'ERROR' },
      { tag: 'INVENTORY_ITEM_ID', expected: '555444111' },
    ],
  },
]
multiSoapTest('Products Pack', 'webservice/addProduct', data)
