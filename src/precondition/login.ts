import { PagesMap } from '@classes/pages.map'
import { test } from '@actions'
import { User } from '@interfaces'
import { DEFAULT_USER } from '@const/global/users.reserve'

export let orderId: string

export const loginExecute = async (pages: PagesMap, user?: User) => {
  const Header = pages.header
  const HomePage = pages.homePage
  const LoginModal = pages.loginModal

  await HomePage.open()
  await Header.openLoginModal()
  if (!user) {
    user = DEFAULT_USER
  }
  await LoginModal.typeLogin(user.login)
  await LoginModal.typePassword(user.password)
  const submitEvent: Promise<void> = LoginModal.submitLogin(user)
  orderId = await Header.getOrderId()
  await Promise.resolve(submitEvent)
    .catch(e => console.log('loginExecute', e))
  await LoginModal.waitForAnimation()
  await LoginModal.isHidden()
  await Header.checkLogoExists()
}

const login = (pages: PagesMap, user?: User) => {
  test('login', async () => {
    await loginExecute(pages, user)
  })
}

export default login
