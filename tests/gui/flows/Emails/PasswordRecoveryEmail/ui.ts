import pages from '@pages'
import { multiPack, test, ui } from '@actions'
import { defaultEmailWaitTimer, defaultTimeout } from '@const/global/timers'
import openHomepage from '@precondition/open.homepage'
import { GET_USER } from '@const/global/users.reserve'
import generatePassword from '@components/shared/util/password.generator'

const user = 0

multiPack('Password Recovery Email', () => {
  const Header = pages.header
  const LoginModal = pages.loginModal
  const Email = pages.googleEmail
  const ResetPasswordPage = pages.resetPasswordPage
  const Alert = pages.alert
  const ProfileAdapterRepository = pages.profileAdapterRepository

  openHomepage(pages)
  test('send recovery password email', async () => {
    await Header.openLoginModal()
    await LoginModal.forgotPassword()
    await LoginModal.typeEmailToRecoverPassword(GET_USER(user).login)
    await LoginModal.sendPassword(GET_USER(user).login)
    await LoginModal.backToLogin()
  }, defaultTimeout * 2)
  test('open mailbox', async () => {
    await Email.openMailbox(user)
  })
  /*
   * UI isn't checked because of google pixel issue.
   * Sometimes content is rendered with +-1 pixel size difference.
   * Existence is checked and its key components.
   */
  test('password recovery email', async () => {
    return Email.openPasswordRecovery()
  }, defaultEmailWaitTimer)
  ui('follow reset password link', async () => {
    await Email.clickPasswordRecoveryLink()
    await Header.waitForSpinnerToDisappear()
    await Header.waitForLogo()
  })

  const newPassword = generatePassword()
  test('change password', async () => {
    await ResetPasswordPage.typePasswordToFirstField(newPassword)
    await ResetPasswordPage.typePasswordToSecondField(newPassword)
    await ResetPasswordPage.submitNewPassword(newPassword)
  }, defaultTimeout * 2)
  ui('success message presence', async () => Alert.checkSuccessAlertPresence())
  test('close alert', async () => Alert.closeAlert())
  test('login with new credentials', async () => {
    await Header.openLoginModal()
    await LoginModal.typeLogin(GET_USER(user).login)
    await LoginModal.typePassword(newPassword)
    await LoginModal.submitLogin()
    await LoginModal.isHidden()
    await LoginModal.waitForAnimation()
    await Header.checkLogoExists()
  })

  test('login to dyn admin', async () =>
    ProfileAdapterRepository.open())
  test('change password', async () => {
    await ProfileAdapterRepository.openThis()
    await ProfileAdapterRepository.updatePasswordForUser(user)
  })
})
