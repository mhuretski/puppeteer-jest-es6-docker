import pages from '@pages'
import Footer from '@components/shared/footer'
import { singlePack, ui, test } from '@actions'

const footerSelectors = Footer.getSelectors()

singlePack('Footer subscription', () => {
  const ProfileAdapterRepository = pages.profileAdapterRepository
  const HomePage = pages.homePage
  const Footer = pages.footer

  test('login to dyn admin', async () =>
    ProfileAdapterRepository.open())
  test('prepare before subscribing', async () => {
    await ProfileAdapterRepository.openThis()
    await ProfileAdapterRepository.deleteTestSubscriptionIfExists()
  })
  test('subscription section existence', async () => {
    await HomePage.open()
    await HomePage.toBeDefined(footerSelectors.subscribeContainer)
  })
  ui('subscribe success front', async () => {
    await Footer.typeTestEmail()
    await Footer.subscribe()
    return footerSelectors.subscribeContainer
  })
  test('subscription exists in system', async () => {
    await ProfileAdapterRepository.openThis()
    const subscriptionId =
      await ProfileAdapterRepository.getFooterSubscriptionId()
    await ProfileAdapterRepository.toBeGreaterThanOrEqual(subscriptionId,
      100000)
  })
})
