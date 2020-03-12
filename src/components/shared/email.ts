import { EMAIL } from '@const/properties/constants'
import { ElementHandle } from 'puppeteer'
import {
  defaultEmailRenderingWaitTimer,
  defaultEmailIterationWait,
  defaultEmailSecurityWaitTimer,
  defaultImagesWaitTimer,
  defaultPresenceWaitTimer,
  defaultSpinnerWaitTimer,
} from '@const/global/timers'
import { EmailPreviewItem, GoogleEmailSelectors, User } from '@interfaces'
import { DEFAULT_USER, GET_USER } from '@const/global/users.reserve'
import Rest from '@classes/util/rest'
import { readCookies, writeCookies } from '@app/util/cookies'

const xpathMobileItemContainer = (position: number) => `//div[@role="listitem"][contains(@class,"ym")][${position}]`
const xpathDesktopItemContainer = (position: number) => `//div[@role="tabpanel"][not(@style)]//tbody/tr[contains(@class,"zE")][${position}]`

const selectors: GoogleEmailSelectors = {
  login: {
    email: '#identifierId',
    emailNextButton: '#identifierNext',
    password: '#password input',
    passwordNextButton: '#passwordNext',
    next: '#next',
    authorized: (email: string) => `a[aria-label*="${email}"]`,
  },
  mail: {
    mobile: {
      container: '[id*="cvcmsgbod"] div',
      specificKeys: {
        orderId: (orderIdTitle: string) => `//div[contains(text(),"${orderIdTitle}")]/ancestor::div[contains(@class,"Ni")]/div[9]//div[contains(@style,"color:#424242")]`,
      },
      spinner: '.Ug',
      preview: {
        list: '[role="list"]',
        item: {
          container: '[role="listitem"].ym',
          time: (position: number) => `${xpathMobileItemContainer(position)}/div[3]/div[1]`,
          from: (position: number) => `${xpathMobileItemContainer(position)}/div[3]/div[2]`,
          title: (position: number) => `${xpathMobileItemContainer(position)}/div[4]/div[3]`,
          body: (position: number) => `${xpathMobileItemContainer(position)}/div[5]`,
          textSelector: (text: string) => `//span[contains(text(),'${text}')]`,
        },
        promo: '#sdppromo',
      },
    },
    desktop: {
      container: '[id*="emailBody"]',
      specificKeys: {
        orderId: '[id*="orderId"]',
      },
      spinner: '#loading:not([style])',
      preview: {
        list: '[role="tabpanel"]:not([style])',
        item: {
          container: '[role="tabpanel"]:not([style]) tr.zE',
          time: (position: number) => `${xpathDesktopItemContainer(position)}/td[9]`,
          from: (position: number) => `${xpathDesktopItemContainer(position)}/td[5]`,
          title: (position: number) => `${xpathDesktopItemContainer(position)}/td[6]//div[@role="link"]/div/div`,
          body: (position: number) => `${xpathDesktopItemContainer(position)}/td[6]//div[@role="link"]/div/span`,
          textSelector: (text: string) => `//span[contains(text(),'${text}')]`,
        },
      },
    },
  },
  template: {
    orderConfirmation: {
      title: EMAIL.orderConfirmation.title,
      orderIdTitle: EMAIL.orderConfirmation.orderIdTitle,
    },
    passwordRecovery: {
      title: EMAIL.passwordRecovery.title,
      recoveryLink: 'a[href*="new-password"] font',
    },
  },
  loader: '#initialView[aria-busy="true"]',
}

export default class GoogleEmail extends Rest {
  static getSelectors = () => selectors

  async login(user: User | undefined | number, isMobile: boolean) {
    await this._page.goto('https://accounts.google.com/ServiceLogin',
      { waitUntil: 'networkidle2' })

    if (!(isMobile)) {
      const cookies = readCookies()
      await super.setCookie(...cookies)
    }

    if (typeof user === 'number') {
      user = GET_USER(user)
    } else if (!user) {
      user = DEFAULT_USER
    }
    await this._fillCredentials(user)
    await this._passSecurityCheck(user, isMobile)

    await this._isLoggedIn(user)

    if (isMobile) {
      const cookies = await super.getCookies()
      writeCookies(cookies)
    }
  }

  async _fillCredentials(user: User) {
    await super.setValue(
      selectors.login.email, user.login)
    await super.clickInBrowser(selectors.login.emailNextButton)
    await this.waitGoogleLoading()
    await super.setValue(selectors.login.password, user.password)
    await super.clickInBrowser(selectors.login.passwordNextButton)
    await this.waitGoogleLoading()
  }

  async _isLoggedIn(user: User) {
    await super.waitFor(selectors.login.authorized(user.login),
      defaultImagesWaitTimer)
  }

  async _passSecurityCheck(user: User, isMobile: boolean) {
    if (!isMobile) {
      const securityAppear = async () => {
        try {
          await super.waitElementPresence(selectors.login.next,
            defaultEmailSecurityWaitTimer)
          return true
        } catch (e) {
          return false
        }
      }

      if (await securityAppear()) {
        await super.clickInBrowser(selectors.login.next)
        await this._fillCredentials(user)
      }
    }
  }

  async waitGoogleLoading() {
    await super.waitElementAbsence(selectors.loader)
  }

  async openMailbox(user: User | undefined | number) {
    const isMobile = await super.isMobile()
    await this.login(user, isMobile)
    await this._page.goto('https://mail.google.com/',
      { waitUntil: 'networkidle2' })
    await this.waitEmailBoxLoaded(isMobile)
    await this._removePromo(isMobile)
  }

  async getOrderConfirmation() {
    return this.openEmailTemplate(
      selectors.template.orderConfirmation.title,
      this.prepareOrderConfirmationEmailForScreen)
  }

  async openPasswordRecovery() {
    return this.openEmailTemplate(
      selectors.template.passwordRecovery.title,
      this.preparePasswordRecoveryEmailForScreen)
  }

  async openEmailTemplate(emailTypeTitle: string,
          prepareForScreen?: Function,
          timeout = defaultEmailIterationWait) {
    let isOpened: true | undefined
    const isMobile = await this.isMobile()
    const numberOfIterations = 10
    for (let i = 0; i < numberOfIterations; i++) {
      isOpened = await this.openEmail(emailTypeTitle, isMobile)
      if (isOpened) {
        if (prepareForScreen) await prepareForScreen.call(this, isMobile)
        return this._device(isMobile).container
      } else {
        await super.waitInNodeApp(timeout)
        await super.reloadInBrowser()
      }
    }
    throw new Error(`Not found new email with tittle "${emailTypeTitle}" within ${timeout * numberOfIterations} milliseconds.`)
  }

  async prepareOrderConfirmationEmailForScreen(isMobile: boolean) {
    await super.waitInNodeApp(defaultEmailRenderingWaitTimer)
    await super.changeElementContentTo(
      'innerText',
      isMobile ?
        this._device(isMobile).specificKeys.orderId(
          selectors.template.orderConfirmation.orderIdTitle) :
        this._device(isMobile).specificKeys.orderId)
  }

  async preparePasswordRecoveryEmailForScreen() {
    const link = await super.getHTML(
      selectors.template.passwordRecovery.recoveryLink)

    if (link) {
      const tagBreakpoint = '<wbr>'
      const arrData = link.split(tagBreakpoint)
      let position: number | undefined
      for (let i = 0; i < arrData.length; i++) {
        if (arrData[i].includes('new-password?')) {
          position = i
          break
        }
      }
      if (position) {
        const stringGenerator = (size: number) => new Array(size + 1).join('#')

        const valueWithConstant = arrData[position]
        const toReplaceFrom = valueWithConstant.indexOf('?') + 1
        if (toReplaceFrom < valueWithConstant.length) {
          const toReplace = valueWithConstant.substring(toReplaceFrom)
          arrData[position] = valueWithConstant.replace(
            toReplace, stringGenerator(toReplace.length))
        }
        for (let i = position + 1; i < arrData.length; i++) {
          arrData[i] = stringGenerator(arrData[i].length)
        }
        const remadeLink = arrData.join(tagBreakpoint)
        await super.changeElementContentTo(
          'innerHTML',
          selectors.template.passwordRecovery.recoveryLink,
          remadeLink)
      }
    }
  }

  async openEmail(emailTypeTitle: string, isMobile: boolean) {
    const table: ElementHandle<Element> | null =
      await super.getElement(
        this._device(isMobile).preview.list)
    if (table) {
      const emailItem =
        await this._getPreviewEmailItemData(emailTypeTitle, isMobile)
      if (emailItem) {
        await this._clickPreview(emailItem, isMobile)
        await this.waitEmailSpinnerToDisappear(isMobile)
        await this.readLetter(isMobile)
        return true
      }
    }
  }

  async clickPasswordRecoveryLink() {
    await super.executeInNewPage(
      super.clickOnLast,
      selectors.template.passwordRecovery.recoveryLink)
  }

  _device(isMobile: boolean) {
    return (isMobile) ? selectors.mail.mobile : selectors.mail.desktop
  }

  async waitEmailBoxLoaded(isMobile: boolean) {
    await super.waitFor(this._device(isMobile).preview.list,
      defaultSpinnerWaitTimer)
  }

  async waitEmailSpinnerToDisappear(isMobile: boolean) {
    if (isMobile) {
      await super.waitElementToDisappear(this._device(isMobile).spinner,
        defaultPresenceWaitTimer,
        defaultSpinnerWaitTimer * 3)
    }
  }

  async readLetter(isMobile: boolean) {
    if (isMobile) {
      await this._page.evaluate((selector) => {
        const res = document.querySelector(selector)
        if (res) {
          res.scrollIntoView()
        }
      }, '#cv_ .Og')
    }
  }

  async _removePromo(isMobile: boolean) {
    if (isMobile) {
      if (selectors.mail.mobile.preview.promo) {
        await super.removeIfExist(selectors.mail.mobile.preview.promo)
      }
    }
  }

  async _getPreviewEmailItemData(emailTitleType: string,
          isMobile: boolean): Promise<EmailPreviewItem | undefined> {
    try {
      await super.waitFor(this._device(isMobile).preview.item.container)
    } catch (e) {
      console.log('waiting for new email...')
      return
    }
    const amount =
      await super.countElements(
        this._device(isMobile).preview.item.container)
    for (let i = 1; i <= amount; i++) {
      const time = await this.getText(
        this._device(isMobile).preview.item.time(i))
      const from = await this.getText(
        this._device(isMobile).preview.item.from(i))
      const title = await this.getText(
        this._device(isMobile).preview.item.title(i))
      const body = await this.getText(
        this._device(isMobile).preview.item.body(i))
      if (title && title.includes(emailTitleType)) {
        return { i, time, from, title, body }
      }
    }
  }

  async _clickPreview(emailItem: EmailPreviewItem, isMobile: boolean) {
    const elemXPath = (await this._page.$x(
      this._device(isMobile).preview.item.title(emailItem.i).concat(
        this._device(isMobile).preview.item.textSelector(emailItem.title)))
    )[0]
    try {
      await elemXPath.click()
    } catch (e) {
      throw new Error(`Couldn't open email item "${emailItem.title.toString()}".`)
    }
  }
}
