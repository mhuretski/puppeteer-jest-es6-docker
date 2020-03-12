import Rest from '@classes/util/rest'

const selectors = {
  profileCardContainer: '#accountPageProfileCardContainer',
  personalManagerContainer: '#accountPagePersonalManagerContainer',
  organizationCardContainer: '#accountPageOrganizationCardContainer',
  actionButtonsContainer: '#accountPageActionsContainer',
  changePassword: '#accountPageUpdatePasswordButton',
  eEditPersonalData: '#accountPageEditPersonalData',
  callMeBack: '#accountPageCallMeBack',
  orderAccountUpdateButton: '#accountPageOrderAccountUpdateButton',
  contactPersonalManagerButton: '#accountPageContactPersonalManagerButton',
  userName: '#accountPageUserName',
  personalManagerName: '#accountPagePersonalManagerName',
}

export default class AccountPage extends Rest {
  static getSelectors = () => selectors

  async openPersonalManagerModal() {
    await super.waitFor(selectors.contactPersonalManagerButton)
    await super.click(selectors.contactPersonalManagerButton)
  }

  async openContactUsModalWithCallMeBack() {
    await super.click(selectors.callMeBack)
  }

  async openContactUsModalWithEditMyData() {
    await super.click(selectors.orderAccountUpdateButton)
  }

  async openChangePasswordModal() {
    await super.click(selectors.changePassword)
  }
}
