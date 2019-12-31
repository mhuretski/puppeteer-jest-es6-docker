import SITE from '@config/site/mapping'

const request =
  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sec="http://schemas.xmlsoap.org/ws/2002/07/secext">
  <soapenv:Header>
    <sec:Security>
      <sec:UsernameToken>
        <sec:Username>${SITE.SOAP.username}</sec:Username>
        <sec:Password>${SITE.SOAP.password}</sec:Password>
      </sec:UsernameToken>
    </sec:Security>
  </soapenv:Header>
  <soapenv:Body>
    <ser:addProduct>
      <product>
        <INVENTORY_ITEM_ID>593</INVENTORY_ITEM_ID>
        <SEGMENT1>11-241540-00220</SEGMENT1>
        <DESCRIPTION_RU></DESCRIPTION_RU>
        <UOMID>pha_uom_1</UOMID>
        <UOM_US>pha_uom_1</UOM_US>
        <UOM_RU>pha_uom_1_ru</UOM_RU>
        <ITEM_TYPE>product</ITEM_TYPE>
        <PHA_GOST></PHA_GOST>
      </product>
    </ser:addProduct>
  </soapenv:Body>
</soapenv:Envelope>`

export default request
