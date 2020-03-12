import pages from '@pages'
import { FunctionWithTestName, multiPack, ui } from '@actions'
import checkWithLogin from '@precondition/guest.and.logged.in'
import BreadcrumbsSelectors from '@components/shared/breadcrumbs'
import { defaultPDPPath } from '@components/shared/util/paths'

const user = undefined
const breadcrumbs = BreadcrumbsSelectors.getSelectors()

multiPack('Breadcrumbs', () => {
  const HomePage = pages.homePage
  const Header = pages.header
  const Breadcrumbs = pages.breadcrumbs

  const execute = () => {
    const breadcrumb = (name: string, fn: FunctionWithTestName,
            expectedAmount = 2) => {
      const returnBreadcrumbs = async () => {
        await fn()
        const receivedAmountOfBreadcrumbs = await Breadcrumbs.countBreadcrumbs()
        expect(receivedAmountOfBreadcrumbs).toEqual(expectedAmount)
        return breadcrumbs.container
      }
      ui(name, returnBreadcrumbs)
    }

    breadcrumb('two column page', async () =>
      HomePage.openRelative('effective-application'))
    breadcrumb('one column page', async () =>
      HomePage.openRelative('about-company'))
    breadcrumb('one column page with collapse', async () =>
      HomePage.openRelative('faq-agronomist'))
    breadcrumb('site map', async () =>
      HomePage.openRelative('site-map'))
    breadcrumb('category', async () => {
      await HomePage.open()
      await HomePage.clickOnCategory(0)
    })
    breadcrumb('npk pdp', async () =>
      HomePage.openRelative(defaultPDPPath), 3)
    breadcrumb('global search', async () =>
      HomePage.openRelative('search'))
    breadcrumb('specific search', async () => {
      await Header.searchFor('NPK')
      await Header.clickSearch()
    })
    ui('go to root', async () => {
      await HomePage.open()
      await HomePage.clickOnCategory(0)
      await Breadcrumbs.clickOnCrumb(0)
    })
    ui('go to category', async () => {
      await HomePage.openRelative(defaultPDPPath)
      await Breadcrumbs.clickOnCrumb(1)
    })
  }

  checkWithLogin(pages, user, execute)
})
