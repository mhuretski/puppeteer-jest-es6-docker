'use strict'
import { StartProperties } from './mapping'

const PROD_SCHEME_URL = 'http://example.com:7003/dyn/admin/'
const CONFIG: StartProperties = {
  MAIN_PAGE: 'https://example.com/',
  defaultLoginValue: 'test-email@test.com',
  defaultPasswordValue: 'test-email',
  DYN_ADMIN: {
    PROD_SCHEME_URL: PROD_SCHEME_URL,
    username: 'username',
    password: 'password',
    ProfileAdapterRepository: `${PROD_SCHEME_URL}nucleus/atg/userprofiling/ProfileAdapterRepository/`,
  },
  SOAP: {
    baseURL: 'https://example.com/',
    addProduct: 'webservice/secondExample',
    addOrganization: 'webservice/secondExample',
  },
}

export default CONFIG
