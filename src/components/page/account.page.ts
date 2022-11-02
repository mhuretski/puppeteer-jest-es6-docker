import Rest from '@classes/util/rest'

export const AccountPageSelectors = {
    title: "[class*='accountPageNavigation-titlePage']",
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
    static getSelectors = () => AccountPageSelectors

    async openPersonalManagerModal() {
        await super.waitFor(AccountPageSelectors.contactPersonalManagerButton)
        await super.click(AccountPageSelectors.contactPersonalManagerButton)
    }

    async openContactUsModalWithCallMeBack() {
        await super.click(AccountPageSelectors.callMeBack)
    }

    async openContactUsModalWithEditMyData() {
        await super.click(AccountPageSelectors.orderAccountUpdateButton)
    }

    async openChangePasswordModal() {
        await super.click(AccountPageSelectors.changePassword)
    }
}
