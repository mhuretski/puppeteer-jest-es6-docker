import { PagesMap } from '@classes/pages.map'
import { test } from '@actions'

export const logoutExecute = async (pages: PagesMap) => {
  const Header = pages.header
  await Header.expandAccountMenu()
  await Header.clickLogout()
  await Header.waitForSpinnerToDisappear()
}

const logout = (pages: PagesMap) => {
  test('logout', async () => {
    await logoutExecute(pages)
  })
}

export default logout
