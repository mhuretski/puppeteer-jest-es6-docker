import BaseModal from '@components/modal/common/base.modal'

const selectors = {
  container: '#videoPlayerModalContainer',
}

export default class VideoPlayerModal extends BaseModal {
  static getSelectors = () => selectors
}
