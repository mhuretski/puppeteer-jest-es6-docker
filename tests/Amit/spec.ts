import pages from '@pages'
import { singlePack, test } from '@actions'
import { AccountPageSelectors } from '@components/page/account.page'

singlePack('Login and Logout flow', () => {
    const HomePage = pages.homePage
    const Header = pages.header
    const LoginModal = pages.loginModal
    const Checker = pages.checker

    test('user navigates to homepage', async () => HomePage.open())
    test('login modal is opened', async () => {
        await Header.openLoginModal()
        await LoginModal.isExists()
    })
    test('user is logged in', async () => {
        await LoginModal.typeLogin()
        await LoginModal.typePassword()
        await LoginModal.submitLogin()
        await Header.waitForSpinnerToDisappear()
    })
    test('user is shown', async () => Header.checkUserIsShown())
    test('dashboard is opened', async () => Checker.toBeDefined(AccountPageSelectors.title))
    test('account menu is expanded', async () => Header.expandAccountMenu())
    test('user is logged out', async () => Header.clickLogout())
})
