'use strict'
import { alertS } from '@components/shared/util/constant'
import Rest from '@classes/util/rest'

const toastContainer = alertS

const selectors = {
  container: toastContainer,
  text: `${toastContainer} .rrt-text`,
  error: `${toastContainer} .rrt-error`,
  success: `${toastContainer} .rrt-success`,
}

export default class ToastModal extends Rest {
  static getSelectors = () => selectors

  async getToastText() {
    return super.getText(selectors.text)
  }

  async checkErrorPresence() {
    return super.waitFor(selectors.error)
  }

  async checkErrorAbsence() {
    return super.waitElementToDisappear(selectors.error)
  }

  async checkSuccessPresence() {
    return super.waitFor(selectors.success)
  }

  async waitSuccessAbsence() {
    return super.waitElementToDisappear(selectors.success)
  }
}
