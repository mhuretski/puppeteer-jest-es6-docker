import login from '@precondition/login'
import pages from '@pages'
import Header from '@components/shared/header'
import HomePage from '@components/page/home.page'
import { multiPack, ui } from '@actions'
import openHomepage from '@precondition/open.homepage'

const user = undefined
const headerSelectors = Header.getSelectors()
const FAQSelectors = HomePage.getSelectors().FAQ

multiPack('Personal manager', () => {
  const Check = pages.checker
  const HomePage = pages.homePage
  const PersonalManagerModal = pages.personalManagerModal
  const Header = pages.header
  const AccountPage = pages.accountPage
  const managerModalCheck = (pageName: string) => {
    ui(`notification error message is shown on ${pageName}`, async () =>
      PersonalManagerModal.clickSend())
    ui(`modal is submitted on ${pageName}`, async () => {
      await PersonalManagerModal.typeMessage()
      await PersonalManagerModal.clickSend()
    })
    ui(`modal is closed on ${pageName}`, async () =>
      PersonalManagerModal.clickClose())
  }

  openHomepage(pages)
  ui('absence for non-logged in user on homepage', async () =>
    FAQSelectors.container)
  login(pages, user)
  ui('presence for logged in user on homepage', async () =>
    FAQSelectors.container)
  ui('modal invisibility in header', async () => {})
  ui('modal visibility in header after click', async () => {
    await Header.clickOnPersonalManager()
    return Check.toBeVisible(headerSelectors.modalPersonalManagerName)
  })
  ui('modal invisibility in header after close', async () => {
    await Header.clickOnPersonalManager()
    return Check.toBeInvisible(headerSelectors.modalPersonalManagerName)
  })

  ui('manager modal is opened on homepage', async () =>
    HomePage.openPersonalManagerModal())
  managerModalCheck('homepage')
  ui('account page is opened', async () => Header.openAccountPage())
  ui('manager modal is opened on account page', async () =>
    AccountPage.openPersonalManagerModal())
  managerModalCheck('account page')
})
