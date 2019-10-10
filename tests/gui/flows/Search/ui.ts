'use strict'
import pages from '@pages'
import { isMobileDevice, multiPack, ui, test } from '@actions'
import checkWithLogin from '@precondition/guest.and.logged.in'
import SearchPage from '@components/page/listing/search.page'
import { leadS, visiblePageS } from '@components/shared/util/constant'
import Breadcrumbs from '@components/shared/breadcrumbs'

const user = undefined
const listingSelectors = SearchPage.getListingSelectors()
const searchSelectors = SearchPage.getSelectors()
const breadcrumbs = Breadcrumbs.getSelectors()

multiPack('Search', () => {
  const SearchModal = pages.searchModal
  const Header = pages.header
  const SearchPage = pages.searchPage

  const checkTypeaheadModal = async (expectedResult: number, text: string) => {
    await Header.reload()
    const responseCount = await Header.searchFor(text)
    expect(responseCount).toBeGreaterThanOrEqual(expectedResult)
    const count = await SearchModal.countItems()
    expect(count).toEqual(expectedResult)
    if (expectedResult === 0) {
      await SearchModal.waitThisToBeInvisible()
    } else {
      await SearchModal.waitThisToBeVisible()
    }
  }

  const execute = (loggedInUser?: boolean) => {
    ui('type in typeahead', async () => {
      const text = 'NPK'
      await checkTypeaheadModal(6, text)
      await SearchModal.forceFocusState(text)
      return visiblePageS
    })
    ui('open item from typeahead search', async () => {
      await SearchModal.clickOnItem(0)
      await SearchModal.waitThisToBeInvisible()
      return visiblePageS
    })
    if (!loggedInUser) {
      ui('no typeahead with invalid search input', async () => {
        const text = 'ololo'
        await checkTypeaheadModal(0, text)
        await SearchModal.forceFocusState(text)
        return visiblePageS
      })
    }
    test('typeahead search result 1 item', async () => {
      await checkTypeaheadModal(1,
        'жидкое')
    })
    test('typeahead search result 2 items', async () => {
      await checkTypeaheadModal(2,
        '15 1000')
    })
    test('typeahead search result 6 items', async () => {
      await checkTypeaheadModal(6, 'NPK')
    })
    test('typeahead search result 0 items', async () => {
      await checkTypeaheadModal(0, 'ololo')
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
    ui('search banner', async () => leadS)
    ui('search breadcrumbs', async () => breadcrumbs.container)
    ui('search auto correct', async () => searchSelectors.autoCorrect.container)
    ui('search products', async () => listingSelectors.products.container)
    ui('search navigation', async () => listingSelectors.navigation.container)
    ui('search pagination', async () => listingSelectors.pagination.container)
    ui('amount of products displayed status', async () => listingSelectors.displayAmount)

    ui('search yours instead of auto corrected', async () => SearchPage.searchByOriginalTerms())
    ui('global search page', async () => SearchPage.openThis())
    ui('open next page', async () => SearchPage.openNextPage())
    ui('open previous page', async () => SearchPage.openPreviousPage())
    ui('open fourth page', async () => SearchPage.openPaginationPage(3))
    ui('open first page', async () => SearchPage.openFirstPage())
    ui('open last page', async () => SearchPage.openLastPage())
  }
  checkWithLogin(pages, user, execute)
})
