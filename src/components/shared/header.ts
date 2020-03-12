import { defaultWaitTimer } from '@const/global/timers'
import { logoS } from '@components/shared/util/constant'
import Rest from '@classes/util/rest'

const container = '#headerId'

const selectors = {
  container: container,
  hamburgerMenu: '#headerHamburgerMenu',
  loginBtn: '#headerLoginBtn',
  accountDropdownMenu: '#headerAccountDropdownMenu',
  dropdownAccount: '#headerDropdownAccount',
  dropdownLogout: '#headerDropdownLogout',
  accountMenu: '#headerPersonalAccountLabel',
  searchInput: '#headerSearchInput',
  searchButton: '#headerSearchButton',
  menuItems: `${container} .header-mainmenu-list-item`,
  tel: '#headerTel',
  logo: logoS,
  personalManagerContainer: '#headerPersonalManager',
  modalPersonalManagerName: '#headerModalPersonalManagerName',
  miniBasket: {
    container: '#headerMiniBasket',
    quantity: '#headerMiniBasketQuantity',
  },
}

export default class Header extends Rest {
  static getSelectors = () => selectors

  async searchFor(text: string, timeout = defaultWaitTimer) {
    await super.emptyValue(selectors.searchInput)
    await super.click(selectors.searchInput)
    await super.waitForAnimation()

    const typed: Promise<any> = super.type(selectors.searchInput, text, timeout)
    const URI = `getPage?Ntt=${encodeURI(text)}`
    const response = await super.waitForResponseURLToContain(URI)
    const responseJson = await response.json()
    await Promise.resolve(typed)
      .catch(e => console.log('searchFor', e))
    // @ts-ignore
    return responseJson.result.data.body.contents[0].MainContent[0].totalNumRecs
  }

  async clickSearch() {
    await super.clickInBrowser(selectors.searchButton)
  }

  async hoverCatalogMenu() {
    await super.waitFor(selectors.menuItems)
    await this._page.hover(selectors.menuItems)
  }

  async hoverAccountMenu() {
    await super.hover(selectors.accountMenu)
    await super.waitFor(selectors.dropdownAccount)
  }

  async tapAccountMenu() {
    await super.tap(selectors.accountMenu)
    await super.waitFor(selectors.dropdownAccount)
  }

  async openAccountPage() {
    await this.expandAccountMenu()
    await super.clickInBrowser(selectors.dropdownAccount)
  }

  async openBasket() {
    await super.clickInBrowser(selectors.miniBasket.container)
  }

  async clickHamburgerMenu() {
    await super.clickInBrowser(selectors.hamburgerMenu)
  }

  async clickOnMenuItem(position = 0) {
    await super.clickAndWaitEndecaContent(selectors.menuItems, position)
  }

  async openLoginModal() {
    await super.clickInBrowser(selectors.loginBtn)
  }

  async checkLogoExists() {
    return super.waitFor(selectors.logo)
  }

  async checkManagerExists() {
    return super.waitFor(selectors.personalManagerContainer)
  }

  async checkAccountMenuExists() {
    return super.waitFor(selectors.accountMenu)
  }

  async checkMiniBasketExists() {
    return super.waitFor(selectors.miniBasket.container)
  }

  async expandAccountMenu() {
    if (await super.isMobile()) {
      // await this.tapAccountMenu()
      await super.clickInBrowser(selectors.accountMenu)
    } else {
      await this.hoverAccountMenu()
    }
    await super.waitForAnimation()
  }

  async clickLogout() {
    await super.clickInBrowser(selectors.dropdownLogout)
    await super.waitForSpinnerToDisappear()
    await super.waitFor(selectors.loginBtn)
  }

  async clickOnPersonalManager() {
    await super.clickInBrowser(selectors.personalManagerContainer)
  }

  async getAmountOfProductsInMiniCart(): Promise<number> {
    await this.checkMiniBasketExists()
    try {
      const qty = await super.getText(selectors.miniBasket.quantity)
      if (qty) {
        return parseInt(qty)
      } else {
        return 0
      }
    } catch (e) {
      return 0
    }
  }

  async waitForLogo() {
    await super.waitFor(selectors.logo)
  }
}
