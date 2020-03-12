import pages from '@pages'
import { multiPack, test } from '@actions'
import { defaultEmailWaitTimer } from '@const/global/timers'
import submitOrder from '@precondition/submit.order'
import loggedIn from '@precondition/logged.in'

const user = 0

multiPack('Order Email', () => {
  const Email = pages.googleEmail

  const execute = () => {
    submitOrder(pages)
    /*
     * UI isn't checked because of google pixel issue.
     * Sometimes content is rendered with +-1 pixel size difference.
     * Existence is checked and its key components.
     */
    test('open mailbox', async () => {
      await Email.openMailbox(user)
    })
    test('order confirmation email', async () => {
      await Email.getOrderConfirmation()
    }, defaultEmailWaitTimer)
  }
  loggedIn(pages, user, execute)
})
