import {
  defaultLoginValue,
  defaultPasswordValue,
} from '@const/properties/constants'
import { defaultResponseWaitTimer } from '@const/global/timers'
import Rest from '@classes/util/rest'
import { User } from '@interfaces'

const selectors = {
  emailField: '#inputFieldLabelEmailLogin',
  passField: '#inputFieldLabelPasswordLogin',
  submitBtn: '#modalLoginSubmitButton',
  authorizationTitle: '#modalLoginTitle',
  closeBtn: '#modalLoginCloseButton',
  forgotPassword: '#modalLoginForgotPassword',
  contactUs: '#modalLoginContactUs',
  resetPasswordInput: '#inputFieldLabelResetPassword',
  sendEmailResetPassword: '#sendEmailResetPassword',
  cancelSendEmailResetPassword: '#cancelSendEmailResetPassword',
  backToLoginFromResetPassword: '#backToLoginFromResetPassword',
}

export default class LoginModal extends Rest {
  static getSelectors = () => selectors

  async isExists() {
    await super.waitFor(selectors.authorizationTitle)
  }

  async isHidden() {
    await super.waitElementAbsence(selectors.closeBtn)
  }

  async typeLogin(text = defaultLoginValue) {
    await super.type(selectors.emailField, text)
  }

  async typePassword(text = defaultPasswordValue) {
    await super.type(selectors.passField, text)
  }

  async forgotPassword() {
    await super.click(selectors.forgotPassword)
  }

  async typeEmailToRecoverPassword(email = defaultLoginValue) {
    await super.type(selectors.resetPasswordInput, email)
  }

  async sendPassword(login: string) {
    await super.resolveClickWithResponse(selectors.sendEmailResetPassword,
      super.waitForgotPasswordResponse,
      `Failed to send forgotten password email to ${login}.`,
      0,
      defaultResponseWaitTimer * 4)
  }

  async backToLogin() {
    await super.click(selectors.backToLoginFromResetPassword)
  }

  async submitLogin(user: User = {
    login: defaultLoginValue,
    password: defaultPasswordValue,
  }) {
    await super.waitForSpinnerToDisappear()
    await super.resolveClickWithResponse(selectors.submitBtn,
      super.waitLoginResponse,
      `Failed to login with credentials "${user.login}" / "${user.password}".`,
      0,
      defaultResponseWaitTimer)
    await super.waitForSpinnerToDisappear()
  }
}
