import Rest from '@classes/util/rest'

const container = '#alertType'

const selectors = {
  type: {
    container: container,
    success: `${container}.success`,
    info: `${container}.info`,
  },
  message: '#alertMessage',
  close: '#alertMessageClose',
}

export default class Alert extends Rest {
  static getSelectors = () => selectors

  async checkSuccessAlertPresence() {
    await super.waitFor(selectors.type.success)
    return selectors.type.success
  }

  async getAlertText() {
    return super.getText(selectors.message)
  }

  async closeAlert() {
    await super.click(selectors.close)
    await super.waitElementAbsence(selectors.type.container)
  }
}
