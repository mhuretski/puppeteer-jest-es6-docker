import { defaultResponseWaitTimer, defaultWaitTimer } from '@const/global/timers'
import { defaultPasswordValue } from '@const/properties/constants'
import Rest from '@classes/util/rest'

const selectors = {
  submitNewPassword: '#resetPwdConfirmBtn button',
  inputFieldLabelPassNew1: '#inputFieldLabelPassNew1',
  inputFieldLabelPassNew2: '#inputFieldLabelPassNew2',
}

export default class ResetPasswordPage extends Rest {
  static getSelectors = () => selectors

  async typePasswordToFirstField(passwordValue = defaultPasswordValue,
          timeout = defaultWaitTimer) {
    await super.type(selectors.inputFieldLabelPassNew1, passwordValue, timeout)
  }

  async typePasswordToSecondField(passwordValue = defaultPasswordValue,
          timeout = defaultWaitTimer) {
    await super.type(selectors.inputFieldLabelPassNew2, passwordValue, timeout)
  }

  async submitNewPassword(passwordValue = defaultPasswordValue) {
    await super.resolveClickWithResponse(selectors.submitNewPassword,
      super.waitNewPasswordResponse,
      `Failed to submit new password "${passwordValue}".`,
      0,
      defaultResponseWaitTimer * 2)
    await super.waitForSpinnerToDisappear()
  }
}
