'use strict'
import { PagesMap } from '@classes/pages.map'
import { ui } from '@actions'

const login = (po: PagesMap) => {
  ui('login', async () => {
    await po.homePage.open()
    await po.header.openLoginModal()
    await po.loginModal.typeLogin()
    await po.loginModal.typePassword()
    await po.loginModal.submit()
    let result
    try {
      result = await po.header.checkLogoExists()
    } catch (e) {
      await po.homePage.reload()
      result = await po.header.checkLogoExists()
    }
    expect(result).toBeTruthy()
    return true
  })
}

export default login
