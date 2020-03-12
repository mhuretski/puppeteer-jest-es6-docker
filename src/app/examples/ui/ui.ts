import pages from '@pages'
import { multiPack, singlePack, ui } from '@actions'

/**
 * Example for single run for UI tests.
 * Runs with one default desktop resolution.
 */
singlePack('Package name', () => {
  ui('user can navigate to page (run once)', async () => pages.homePage.open())
  ui('login modal is opened', async () => pages.header.openLoginModal())
  ui('user is logged in', async () => {
    await pages.loginModal.typeLogin()
    await pages.loginModal.typePassword()
    await pages.loginModal.submitLogin()
  })
})

/**
 * Example for multi run for UI tests.
 * Runs for default list of specified devices and desktop resolutions.
 */
multiPack('Login and Logout flow', () => {
  ui('user can navigate to page (run multiple)', async () => pages.homePage.open())
  ui('login modal is opened', async () => pages.header.openLoginModal())
  ui('user is logged in', async () => {
    await pages.loginModal.typeLogin()
    await pages.loginModal.typePassword()
    await pages.loginModal.submitLogin()
  })
})
