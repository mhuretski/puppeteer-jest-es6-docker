import BaseModal from '@components/modal/common/base.modal'

const selectors = {
  container: '#personalManagerModalContainer',
  inputField: '#personalManagerModalInputField',
  errorMessage: '#personalManagerModalInputFieldInvalidMessage',
  sendButton: '#personalManagerModalSendButton',
  closeButton: '#personalManagerModalCloseButton',
}

export default class PersonalManagerModal extends BaseModal {
  static getSelectors = () => selectors

  async passFlow(text = 'test') {
    await super.type(selectors.inputField, text)
    await this.clickSend()
    await this.clickClose()
  }

  async typeMessage(text = 'test message') {
    await super.type(selectors.inputField, text)
  }

  async clickSend() {
    await super.click(selectors.sendButton)
  }

  async clickClose() {
    await super.click(selectors.closeButton)
  }
}
