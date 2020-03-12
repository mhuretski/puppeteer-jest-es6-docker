import { StartProperties } from '@interfaces'
import {
  DYN_PASSWORD,
  DYN_USERNAME,
  SOAP_PASSWORD,
  SOAP_USERNAME,
} from '@const/global/flags'

const CONFIG: StartProperties = {
  MAIN_PAGE: 'https://example-prod.com/',
  defaultLoginValue: 'test-email@test.com',
  defaultPasswordValue: 'test-email',
  DYN_ADMIN: {
    PROD_SCHEME_URL: 'http://example.com:7003/dyn/admin/',
    username: DYN_USERNAME,
    password: DYN_PASSWORD,
  },
  SOAP: {
    baseURL: 'https://example.com/',
    addProduct: 'webservice/secondExample',
    addOrganization: 'webservice/secondExample',
    username: SOAP_USERNAME,
    password: SOAP_PASSWORD,
  },
  EMAIL: {
    orderConfirmation: {
      title: 'Подтверждение заявки',
      orderIdTitle: 'Номер вашего заказа #',
    },
    passwordRecovery: {
      title: 'Сброс пароля',
    },
  },
  TEST_USERS: [
    {
      login: 'test-email-new@gmail.com',
      password: 'Asdasd123!',
      hashed: {
        password: 'e416a1706647d2dfdc4a84e17481d57a24a47392e1e44c1bbe3278326f8702a33544298208a954f22618e5bf77f212e8b6e00634e4513cf9ea7d855faaa9ab9c',
        passwordSalt: '4a88d103cdbe0b355a2f8928f8f9b84763b2e60b',
      },
    },
    {
      login: 'first-user@mailinator.com',
      password: 'Asdasd123!',
    },
    {
      login: 'second-user@mailinator.com',
      password: 'Asdasd123!',
    },
    {
      login: 'third-user@mailinator.com',
      password: 'Asdasd123!',
    },
  ],
}

export default CONFIG
