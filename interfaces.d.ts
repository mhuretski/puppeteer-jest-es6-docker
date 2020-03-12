import { Browser } from 'puppeteer'

declare global {
  namespace NodeJS {
    interface Global {
      puppBrowser: Promise<Browser>
    }
  }
}

declare interface UpdatedGlobal extends NodeJS.Global {
  reservedTestUsers: number[]
}

export interface User {
  login: string,
  password: string
}

export interface UserHashed extends User {
  hashed?: HashedPassword
}

export interface HashedPassword {
  password: string,
  passwordSalt: string
}

export interface ReserveUser {
  (position: number): User
}

export interface FunctionWithBooleanParameter {
  (loggedInUser: boolean): void
}

export interface ChromeHTMLElement extends Element {
  scrollIntoViewIfNeeded(): void;

  click(): void;
}

export interface NodeListOf<Node> {
  length: number;

  item(index: number): Node;

  forEach(
    callbackfn: (
      value: Node, key: number, parent: NodeListOf<Node>
    ) => void, thisArg?: any
  ): void;

  [index: number]: Node;
}

interface DYN_ADMIN {
  PROD_SCHEME_URL: string,
  username: string,
  password: string,
}

interface SOAP {
  baseURL: string,
  addProduct: string,
  addOrganization: string,
  username: string,
  password: string,
}

interface EmailData {
  title: string,
}

interface OrderEmailData extends EmailData {
  orderIdTitle: string,
}

interface Email {
  orderConfirmation: OrderEmailData,
  passwordRecovery: EmailData
}

export interface StartProperties {
  MAIN_PAGE: string,
  defaultLoginValue: string,
  defaultPasswordValue: string,
  DYN_ADMIN: DYN_ADMIN,
  SOAP: SOAP,
  EMAIL: Email,
  TEST_USERS: UserHashed[]
}

export interface EmailPreviewItem {
  i: number,
  time: string,
  from?: string,
  title: string,
  body?: string
}

export interface DeviceSpecificEmailSelectors {
  container: string,
  specificKeys: any,
  spinner: string,
  preview: {
    list: string,
    item: {
      container: string,
      time: Function,
      from: Function,
      title: Function,
      body: Function,
      textSelector: Function,
    },
    promo?: string,
  }
}

interface PasswordRecoverySelectors extends EmailData {
  recoveryLink: string,
}

interface EmailTemplate {
  orderConfirmation: OrderEmailData,
  passwordRecovery: PasswordRecoverySelectors
}

export interface GoogleEmailSelectors {
  login: {
    email: string,
    emailNextButton: string,
    password: string,
    passwordNextButton: string,
    next: string,
    authorized: Function,
  },
  mail: {
    mobile: DeviceSpecificEmailSelectors,
    desktop: DeviceSpecificEmailSelectors,
  },
  template: EmailTemplate,
  loader?: any,
}

export interface AddToBasketInterface {
  addToBasket: Function
}
