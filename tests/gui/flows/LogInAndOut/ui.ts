import pages from '@pages'
import { multiPack, ui } from '@actions'

multiPack('Login and Logout flow', () => {
  const HomePage = pages.homePage
  const Header = pages.header
  const LoginModal = pages.loginModal

  ui('user navigates to homepage', async () => HomePage.open())
  ui('login modal is opened', async () => {
    await Header.openLoginModal()
    await LoginModal.isExists()
  })
  ui('user is logged in', async () => {
    await LoginModal.typeLogin()
    await LoginModal.typePassword()
    await LoginModal.submitLogin()
    await Header.checkAccountMenuExists()
  })
  ui('personal manager is displayed', async () => Header.checkManagerExists())
  ui('account label is displayed', async () => Header.checkAccountMenuExists())
  ui('mini basket is displayed', async () => Header.checkMiniBasketExists())
  ui('account menu is shown', async () => Header.expandAccountMenu())
  ui('user is logged out', async () => Header.clickLogout())
})
