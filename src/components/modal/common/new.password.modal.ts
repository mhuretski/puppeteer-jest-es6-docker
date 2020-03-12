import BaseModal from '@components/modal/common/base.modal'

const selectors = {
  container: '#newPasswordModalContainer',
}

export default class NewPasswordModal extends BaseModal {
  static getSelectors = () => selectors
}
