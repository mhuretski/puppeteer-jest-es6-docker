import pages from '@pages'
import { multiPack, ui } from '@actions'
import checkWithLogin from '@precondition/guest.and.logged.in'
import ProductLandingPage from '@components/page/listing/product.landing.page'
import { leadS } from '@components/shared/util/constant'
import Breadcrumbs from '@components/shared/breadcrumbs'

const user = 0
const listingSelectors = ProductLandingPage.getListingSelectors()
const breadcrumbs = Breadcrumbs.getSelectors()

multiPack('Product Landing Page', () => {
  const HomePage = pages.homePage
  const Category = pages.productLandingPage
  const Modal = pages.baseModal

  const execute = (loggedInUser?: boolean) => {
    ui('navigation to categories', async () => HomePage.clickOnCategory(1))
    ui('category banner', async () => leadS)
    ui('category breadcrumbs', async () => breadcrumbs.container)
    ui('category products', async () => listingSelectors.products.container)
    ui('category navigation', async () => listingSelectors.navigation.container)
    ui('category pagination', async () => listingSelectors.pagination.container)
    ui('amount of products displayed status', async () => listingSelectors.displayAmount)
    ui('navigation to PDP', async () => {
      const url = await Category.getURL()
      await Category.goToPDPAndBack(0, url)
    })
    ui('add to Basket or open modal', async () => {
      if (loggedInUser) {
        await Category.addToBasket(0)
      } else {
        await Category.openModal(0)
        await Category.screenshot()
        return Modal.close()
      }
    })
    ui('close first facet', async () => {
      await Category.clickOnFacet(0)
      return listingSelectors.navigation.container
    })
    ui('expand second facet', async () => {
      await Category.clickOnFacet(1)
      return listingSelectors.navigation.container
    })
    ui('choose second option in second facet', async () =>
      Category.clickFacetOptionWithoutExpand(1, 1))
    ui('choose second option in second facet again', async () =>
      Category.clickFacetOptionWithoutExpand(1, 1))
    ui('exclude first option in second facet', async () =>
      Category.clickFacetOptionWithoutExpand(1, 0))
    ui('clear facets', async () => {
      await Category.clearFacets()
      return listingSelectors.navigation.container
    })
    ui('sort Last to First', async () => {
      await Category.selectSortByOption(2)
      return listingSelectors.products.container
    })
    ui('sort First to Last', async () => {
      await Category.selectSortByOption(1)
      return listingSelectors.products.container
    })
    ui('sort Default', async () => {
      await Category.selectSortByOption(0)
      return listingSelectors.products.container
    })
    ui('open next page', async () => Category.openNextPage())
    ui('open first page', async () => Category.openPreviousPage())
  }

  checkWithLogin(pages, user, execute)
})
