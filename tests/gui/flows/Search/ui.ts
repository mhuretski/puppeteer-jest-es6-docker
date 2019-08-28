'use strict'
import pages from '@pages'
import { multiPack, ui, test } from '@actions'
import checkWithLogin from '@precondition/guest.and.logged.in'
import SearchPage from '@components/page/listing/search.page'
import { isMobileDevice } from '@precondition/open.homepage'
import { lead, visiblePage } from '@components/shared/constant'
import Breadcrumbs from '@components/shared/breadcrumbs'

const listingSelectors = SearchPage.getListingSelectors()
const searchSelectors = SearchPage.getSelectors()
const breadcrumbs = Breadcrumbs.getSelectors()

multiPack('Search', () => {
  const SearchModal = pages.searchModal
  const Header = pages.header
  const SearchPage = pages.searchPage

  const execute = (loggedInUser?: boolean) => {
    ui('type in typeahead', async () => {
      const text = 'NPK'
      await Header.searchFor(text)
      await SearchModal.waitThisToBeVisible()
      await SearchModal.forceFocusState(text)
      return visiblePage
    })
    ui('open item from typeahead search', async () => {
      await SearchModal.clickOnItem(0)
      await SearchModal.waitThisToBeInvisible()
      return visiblePage
    })
    if (!loggedInUser) {
      ui('no typeahead with invalid search input', async () => {
        const text = 'ololo'
        await Header.searchFor('ololo')
        await SearchModal.waitThisToBeInvisible()
        await SearchModal.forceFocusState(text)
        return visiblePage
      })
    }
    test('typeahead search result 1 item', async () => {
      await Header.reload()
      await Header.searchFor('Карбамид фасовка приллы')
      const count = await SearchModal.countItems()
      expect(count).toEqual(1)
    })
    test('typeahead search result 2 items', async () => {
      await Header.reload()
      await Header.searchFor('Карбамид фасовка')
      const count = await SearchModal.countItems()
      expect(count).toEqual(2)
    })
    test('typeahead search result 6 items', async () => {
      await Header.reload()
      await Header.searchFor('NPK')
      const count = await SearchModal.countItems()
      expect(count).toEqual(6)
    })
    test('typeahead search result 0 items', async () => {
      await Header.reload()
      await Header.searchFor('ololo')
      const count = await SearchModal.countItems()
      expect(count).toEqual(0)
    })
    ui('empty search results with invalid input', async () => {
      await Header.reload()
      await Header.searchFor('ololo')
      if (isMobileDevice) {
        await Header.clickSearch()
      } else {
        await Header.pressEnter()
      }
    })
    ui('valid search results with valid input', async () => {
      await Header.searchFor('NPK')
      await Header.clickSearch()
    })

    ui('auto corrected search result', async () => {
      await Header.searchFor('npkk')
      await Header.clickSearch()
    })
    ui('search banner', async () => lead)
    ui('search breadcrumbs', async () => breadcrumbs.container)
    ui('search auto correct', async () => searchSelectors.autoCorrect.container)
    ui('search products', async () => listingSelectors.products.container)
    ui('search navigation', async () => listingSelectors.navigation.container)
    ui('search pagination', async () => listingSelectors.pagination.container)
    ui('amount of products displayed status', async () => listingSelectors.displayAmount)

    ui('search yours instead of auto corrected', async () => SearchPage.searchByOriginalTerms())
    ui('global search page', async () => SearchPage.openRelative('search'))
    ui('open next page', async () => SearchPage.openLastPage())
    ui('open first page', async () => SearchPage.openFirstPage())
    ui('open third page', async () => SearchPage.openPaginationPage(2))
  }

  checkWithLogin(pages, execute)
})
