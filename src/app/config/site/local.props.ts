'use strict'
import { StartProperties } from './mapping'

const PROD_SCHEME_URL = 'http://localhost:8180/dyn/admin/'
const CONFIG: StartProperties = {
  MAIN_PAGE: 'http://localhost:3000/',
  defaultLoginValue: 'test-email@test.com',
  defaultPasswordValue: 'test-email',
  DYN_ADMIN: {
    PROD_SCHEME_URL: PROD_SCHEME_URL,
    username: 'username',
    password: 'password',
    ProfileAdapterRepository: `${PROD_SCHEME_URL}nucleus/atg/userprofiling/ProfileAdapterRepository/`,
  },
  SOAP: {
    baseURL: 'http://localhost:8180/',
    addProduct: 'webservice/secondExample',
    addOrganization: 'webservice/secondExample',
  },
}

export default CONFIG
