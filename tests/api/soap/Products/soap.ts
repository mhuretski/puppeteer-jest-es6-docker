import { productResponseMask } from '@soapData/masks'
import { DataSoap, multiSoapTest } from '@app/global/actions'
import request from '@soapData/description.error'
import { SOAP } from 'src/app/const/properties/constants'

const data: DataSoap[] = [
  {
    name: 'description absence',
    request: request,
    responseMask: productResponseMask,
    expect: [
      { tag: 'ERROR_CODE', expected: 'REQUIRED_FIELD_MISSED' },
      { tag: 'STATUS_OWC', expected: 'ERROR' },
      { tag: 'INVENTORY_ITEM_ID', expected: '593' },
    ],
  },
]
multiSoapTest('Products Pack', SOAP.addProduct, data)
