import pages from '@pages'
import { multiPack, ui, test, exist } from '@actions'
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
      await Header.searchFor('ololo')
      await Header.clickSearch()
    })
    ui('valid search results with valid input', async () => {
      await Header.searchFor('NPK')
      await Header.clickSearch()
    })
    ui('auto corrected search result', async () => {
      await Header.reload()
      await Header.searchFor('npkk')
      await Header.clickSearch()
    })
    exist('search banner', leadS)
    exist('search breadcrumbs', breadcrumbs.container)
    exist('search auto correct', searchSelectors.autoCorrect.container)
    exist('search products', listingSelectors.products.container)
    exist('search navigation', listingSelectors.navigation.container)
    exist('search pagination', listingSelectors.pagination.container)
    exist('amount of products displayed status', listingSelectors.displayAmount)

    test('search yours instead of auto corrected', async () => SearchPage.searchByOriginalTerms())
    test('global search page', async () => SearchPage.openThis())
    test('open next page', async () => SearchPage.openNextPage())
    test('open previous page', async () => SearchPage.openPreviousPage())
    test('open fourth page', async () => SearchPage.openPaginationPage(3))
    test('open first page', async () => SearchPage.openFirstPage())
    test('open last page', async () => SearchPage.openLastPage())
  }
  checkWithLogin(pages, user, execute)
})
