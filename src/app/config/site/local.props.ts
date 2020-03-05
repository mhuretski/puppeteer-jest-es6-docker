'use strict'
import { StartProperties } from '@interfaces'

const CONFIG: StartProperties = {
  MAIN_PAGE: 'http://letu.ru/',
  defaultLoginValue: 'test-email@test.com',
  defaultPasswordValue: 'test-email',
  DYN_ADMIN: {
    PROD_SCHEME_URL: 'http://67.67.68.130:8080/dyn/admin/',
    username: 'admin',
    password: 'admin123',
  },
  SOAP: {
    baseURL: 'http://67.67.68.130:8180/',
    addProduct: 'webservice/addProduct',
    addOrganization: 'webservice/addOrganization',
    username: 'admin',
    password: 'admin123',
  },
  EMAIL: {
    orderConfirmation: {
      title: 'Оредр сделан',
      orderIdTitle: 'Номер вашего заказа #',
    },
    passwordRecovery: {
      title: 'Сброс пароля',
    },
  },
  TEST_USERS: [],
}

export default CONFIG
