'use strict'
import { PagesMap } from '@classes/pages.map'
import { ui } from '@actions'

const logout = (po: PagesMap) => {
  ui('logout', async () => {
    const Header = po.header
    await Header.expandAccountMenu()
    await Header.clickLogout()
    return true
  })
}

export default logout
