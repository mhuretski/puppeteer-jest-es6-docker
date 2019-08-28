'use strict'
import SITE from '@config/site/mapping'

export const MAIN_PAGE = SITE.MAIN_PAGE
export const defaultLoginValue = SITE.defaultLoginValue
export const defaultPasswordValue = SITE.defaultPasswordValue
export const DYN_ADMIN = {
  PROD_SCHEME_URL: SITE.DYN_ADMIN.PROD_SCHEME_URL,
  username: SITE.DYN_ADMIN.username,
  password: SITE.DYN_ADMIN.password,
  ProfileAdapterRepository: SITE.DYN_ADMIN.ProfileAdapterRepository,
  queryItems: (value: string, descriptor: string, idOnly = false) => `<query-items item-descriptor="${descriptor}" id-only="${idOnly}">${value}</query-items>`,
  removeItem: (itemId: string, descriptor: string) => `<remove-item id="${itemId}" item-descriptor="${descriptor}" />`,
}
export const SOAP = SITE.SOAP
