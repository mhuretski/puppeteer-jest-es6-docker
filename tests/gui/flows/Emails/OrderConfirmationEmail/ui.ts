'use strict'
import pages from '@pages'
import { multiPack, ui } from '@actions'
import { defaultEmailWaitTimer } from '@const/global/timers'
import submitOrder from '@precondition/submit.order'
import loggedIn from '@precondition/logged.in'

const user = 0

multiPack('Order Email', () => {
  const Email = pages.googleEmail

  const execute = () => {
    submitOrder(pages)
    ui('order confirmation email', async () => {
      await Email.openMailbox(user)
      return Email.getOrderConfirmation()
    }, defaultEmailWaitTimer)
  }
  loggedIn(pages, user, execute)
})
