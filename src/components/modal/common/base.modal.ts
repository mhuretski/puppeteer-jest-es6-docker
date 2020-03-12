import Rest from '@classes/util/rest'

const selectors = {
  closeModalXButton: '#closeModalX',
}

export default class BaseModal extends Rest {
  async close() {
    await super.click(selectors.closeModalXButton)
    return true
  }
}
