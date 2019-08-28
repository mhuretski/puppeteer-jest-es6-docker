'use strict'
import Listing from '@components/page/listing/listing'
import { MAIN_PAGE } from '@const/properties/constants'
import { defaultSpinnerPresenceTimerOnFirstPageLoad } from '@const/global/timers'

const selectors = {
  autoCorrect: {
    container: '#autoCorrect',
    searchByOriginalTerms: '#searchByOriginalTerms',
  },
}

export default class SearchPage extends Listing {
  static getSelectors = () => selectors

  async searchByOriginalTerms() {
    await super.click(selectors.autoCorrect.searchByOriginalTerms)
  }

  async open(path = `${MAIN_PAGE}search`,
          spinnerPresenceTimeout = defaultSpinnerPresenceTimerOnFirstPageLoad) {
    await super.open(path, spinnerPresenceTimeout)
  }
}
