import Listing from '@components/page/listing/listing'
import { logoS } from '@components/shared/util/constant'

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

  async openThis() {
    await super.openRelative('search', logoS)
  }
}
