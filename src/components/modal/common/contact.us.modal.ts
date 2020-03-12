import BaseModal from '@components/modal/common/base.modal'

const selectors = {
  container: '#contactUsModalContainer',
  selectTheme: '#contactUsModalSelectTheme',
  selectThemeErrorMessage: '#contactUsModalSelectThemeErrorMessage',
  inputFieldForMessage: '#contactUsModalInputFieldForMessage',
  inputFieldForMessageErrorMessage: '#contactUsModalInputFieldForMessageErrorMessage',
  inputFieldForName: '#contactUsModalInputFieldForName',
  inputFieldForNameErrorMessage: '#contactUsModalInputFieldForMessageErrorMessage',
  inputFieldForNameForCompany: '#contactUsModalInputFieldForNameForCompany',
  inputFieldForNameForCompanyErrorMessage: '#contactUsModalInputFieldForNameForCompanyErrorMessage',
  inputFieldForNameForPhone: '#contactUsModalInputFieldForNameForPhone',
  inputFieldForNameForPhoneErrorMessage: '#contactUsModalInputFieldForNameForPhoneErrorMessage',
  inputFieldForNameForEmail: '#contactUsModalInputFieldForNameForEmail',
  inputFieldForNameForEmailErrorMessage: '#contactUsModalInputFieldForNameForEmailErrorMessage',
  sendButton: '#contactUsModalSendOrCloseButton',
}

export default class ContactUs extends BaseModal {
  static getSelectors = () => selectors
}
