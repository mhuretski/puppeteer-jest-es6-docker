import pages from '@pages'
import { multiPack, ui } from '@actions'
import login from '@precondition/login'
import AccountPageObject from '@components/page/account.page'

const user = undefined
const accountSelectors = AccountPageObject.getSelectors()

multiPack('Account page', () => {
  const Modal = pages.baseModal
  const Header = pages.header
  const AccountPage = pages.accountPage

  login(pages, user)
  ui('open account page', async () => Header.openAccountPage())
  ui('profile container is shown', async () =>
    AccountPage.scrollTo(accountSelectors.profileCardContainer))
  ui('personal manager container is shown', async () =>
    AccountPage.scrollTo(accountSelectors.personalManagerContainer))
  ui('organizations container is shown', async () =>
    AccountPage.scrollTo(accountSelectors.organizationCardContainer))
  ui('buttons are is shown', async () =>
    AccountPage.scrollTo(accountSelectors.actionButtonsContainer))

  ui('open call me back', async () => AccountPage.openContactUsModalWithCallMeBack())
  ui('close call me back', async () => Modal.close())
  ui('open edit my data', async () => AccountPage.openContactUsModalWithEditMyData())
  ui('close edit my data', async () => Modal.close())
  ui('open change password', async () => AccountPage.openChangePasswordModal())
  ui('close change password', async () => Modal.close())
  ui('open personal manager modal', async () => AccountPage.openPersonalManagerModal())
  ui('close personal manager modal', async () => Modal.close())
})
