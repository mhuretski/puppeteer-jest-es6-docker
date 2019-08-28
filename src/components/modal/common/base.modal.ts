'use strict'
import AbstractContentObject from '@classes/util/abstract.content.object'

const selectors = {
  closeModalXButton: '#closeModalX',
}

export default class BaseModal extends AbstractContentObject {
  async close() {
    await super.click(selectors.closeModalXButton)
    return true
  }
}
