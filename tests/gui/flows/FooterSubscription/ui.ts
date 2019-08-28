'use strict'
import pages from '@pages'
import Footer from '@components/shared/footer'
import { singlePack, ui } from '@actions'

const footerSelectors = Footer.getSelectors()

singlePack('Footer subscription', () => {
  ui('prepare before subscribing', async () => {
    return pages.dynAdmin.deleteTestSubscriptionIfExists()
  })
  ui('subscription section existence', async () => {
    await pages.homePage.open()
    return pages.checker.toBeDefined(footerSelectors.subscribeContainer)
  })
  ui('subscribe success front', async () => {
    await pages.footer.typeTestEmail()
    await pages.footer.subscribe()
    return footerSelectors.subscribeContainer
  })
  ui('subscription exists in system', async () => {
    const subscriptionId = await pages.dynAdmin.getFooterSubscriptionId()
    return pages.checker.toBeGreaterThanOrEqual(subscriptionId, 100000)
  })
})
