'use strict'
import AbstractContentObject from '@classes/util/abstract.content.object'

const selectors = {
  type: '#alertType',
  message: '#alertMessage',
  msgCloseBtn: '#alertMessageClose',
}

export default class Alert extends AbstractContentObject {
  static getSelectors = () => selectors;

  async getAlertText() {
    // TODO
  }

  async getAlertColor() {
    // TODO
  }
}
