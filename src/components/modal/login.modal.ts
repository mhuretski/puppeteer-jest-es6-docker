'use strict'
import AbstractContentObject from '@classes/util/abstract.content.object'
import {
  defaultLoginValue,
  defaultPasswordValue,
} from '@const/properties/constants'

const selectors = {
  emailField: '#inputFieldLabelEmailLogin',
  passField: '#inputFieldLabelPasswordLogin',
  submitBtn: '#modalLoginSubmitButton',
  authorizationTitle: '#modalLoginTitle',
  closeBtn: '#modalLoginCloseButton',
  forgotPassword: '#modalLoginForgotPassword',
  contactUs: '#modalLoginContactUs',
}

export default class LoginModal extends AbstractContentObject {
  static getSelectors = () => selectors;

  async isExists() {
    await super.waitFor(selectors.authorizationTitle)
  }

  async typeLogin(text = defaultLoginValue) {
    await super.type(selectors.emailField, text)
  }

  async typePassword(text = defaultPasswordValue) {
    await super.type(selectors.passField, text)
  }

  async submit() {
    await super.click(selectors.submitBtn)
    await super.waitForSpinnerToDisappear()
  }
}
