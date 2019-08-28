'use strict'
import AbstractContentObject from '@classes/util/abstract.content.object'
import { defaultWaitTimer } from '@const/global/timers'
import { logo, visiblePage } from '@components/shared/constant'

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
  logo: logo,
  personalManagerContainer: '#headerPersonalManager',
  modalPersonalManagerName: '#headerModalPersonalManagerName',
  miniBasket: '#headerMiniBasket',
  miniBasketQuantity: '#headerMiniBasketQuantity',
}

export default class Header extends AbstractContentObject {
  static getSelectors = () => selectors;

  async searchFor(text: string, timeout = defaultWaitTimer) {
    await super.type(selectors.searchInput, text, timeout)
    return visiblePage
  }

  async clickSearch() {
    await super.click(selectors.searchButton)
  }

  async hoverCatalogMenu() {
    await super.waitFor(selectors.menuItems)
    await this._page.hover(selectors.menuItems)
  }

  async hoverAccountMenu() {
    await super.waitFor(selectors.accountMenu)
    await this._page.hover(selectors.accountMenu)
    await super.waitFor(selectors.dropdownAccount)
  }

  async tapAccountMenu() {
    await super.tap(selectors.accountMenu)
    await super.waitFor(selectors.dropdownAccount)
  }

  async openAccountPage() {
    await this.expandAccountMenu()
    await super.click(selectors.dropdownAccount)
  }

  async openBasket() {
    await super.click(selectors.searchButton)
  }

  async clickHamburgerMenu() {
    await super.click(selectors.hamburgerMenu)
  }

  async clickOnMenuItem(position = 0) {
    await super.clickOnPuppeteer(selectors.menuItems, position)
  }

  async openLoginModal() {
    await super.click(selectors.loginBtn)
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
    return super.waitFor(selectors.miniBasket)
  }

  async expandAccountMenu() {
    if (await super.isMobile()) {
      // await this.tapAccountMenu()
      await super.click(selectors.accountMenu)
    } else {
      await this.hoverAccountMenu()
    }
    await super.waitForAnimation()
  }

  async clickLogout() {
    await super.click(selectors.dropdownLogout)
    await super.waitForSpinnerToDisappear()
    await super.waitFor(selectors.loginBtn)
  }

  async clickOnPersonalManager() {
    await super.click(selectors.personalManagerContainer)
  }

  async getAmountOfProductsInMiniCart(): Promise<number> {
    try {
      const qty = await super.getText(selectors.miniBasketQuantity)
      if (qty) {
        return parseInt(qty)
      } else {
        return 0
      }
    } catch (e) {
      return 0
    }
  }
}
