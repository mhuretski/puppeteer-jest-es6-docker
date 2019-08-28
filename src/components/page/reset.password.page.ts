'use strict'
import AbstractContentObject from '@classes/util/abstract.content.object'

const selectors = {
  resetPwdConfirmBtn: '#resetPwdConfirmBtn',
  inputFieldLabelPassNew1: '#inputFieldLabelPassNew1',
  inputFieldLabelPassNew2: '#inputFieldLabelPassNew2',
}

export default class ResetPasswordPage extends AbstractContentObject {
  static getSelectors = () => selectors;
}
