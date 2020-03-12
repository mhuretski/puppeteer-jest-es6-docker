import SITE from '@config/site/mapping'

export const MAIN_PAGE = SITE.MAIN_PAGE
export const defaultLoginValue = SITE.defaultLoginValue
export const defaultPasswordValue = SITE.defaultPasswordValue
export const DYN_ADMIN = {
  PROD_SCHEME_URL: SITE.DYN_ADMIN.PROD_SCHEME_URL,
  username: SITE.DYN_ADMIN.username,
  password: SITE.DYN_ADMIN.password,
  ProfileAdapterRepository: `${SITE.DYN_ADMIN.PROD_SCHEME_URL}nucleus/atg/userprofiling/ProfileAdapterRepository/`,
  OrderRepository: `${SITE.DYN_ADMIN.PROD_SCHEME_URL}nucleus/atg/commerce/order/OrderRepository/`,
  queryItems: (value: string, descriptor: string, idOnly = false) => `<query-items item-descriptor="${descriptor}" id-only="${idOnly}">${value}</query-items>`,
  printItem: (id: string, descriptor: string) => `<print-item id="${id}" item-descriptor="${descriptor}" />`,
  removeItem: (itemId: string, descriptor: string) => `<remove-item id="${itemId}" item-descriptor="${descriptor}" />`,
  updateItem: (id: string,
          descriptor: string,
          updateValuesMap: Map<string, string>) => {
    function setProperty(value: string, name: string) {
      data += `<set-property name="${name}"><![CDATA[${value}]]></set-property>`
    }

    let data = ''
    updateValuesMap.forEach((value, key) => setProperty(value, key))
    return `<update-item id="${id}" item-descriptor="${descriptor}">${data}</update-item>`
  },
}
export const SOAP = SITE.SOAP
export const EMAIL = SITE.EMAIL
