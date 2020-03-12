import pages from '@pages'
import { isMobileDevice, multiPack, ui } from '@actions'
import HomePage from '@components/page/home.page'
import Header from '@components/shared/header'
import Footer from '@components/shared/footer'
import checkWithLogin from '@precondition/guest.and.logged.in'

const user = undefined
const headerSelectors = Header.getSelectors()
const homePageSelectors = HomePage.getSelectors()
const footerSelectors = Footer.getSelectors()

multiPack('Homepage', () => {
  const HomePage = pages.homePage
  const Header = pages.header
  const Footer = pages.footer
  const Modal = pages.baseModal

  const executeUI = (loggedInUser?: boolean) => {
    ui('display banner', async () => homePageSelectors.banner.container)
    ui('display header', async () => headerSelectors.container)
    ui('display categories', async () => homePageSelectors.categories.container)
    if (!loggedInUser) {
      ui('display recommendation', async () => homePageSelectors.recommendation.container)
    }
    ui('display FAQ', async () => homePageSelectors.FAQ.container)
    ui('display technologies', async () => homePageSelectors.technologies.container)
    if (!loggedInUser) {
      ui('display bestSellers', async () => homePageSelectors.bestSellers.container)
    }
    ui('display footer', async () => footerSelectors.container)
  }
  const executeNavigation = (loggedInUser?: boolean) => {
    ui('navigation in header', async () => {
      const url = await HomePage.getURL()
      if (isMobileDevice) {
        await Header.clickHamburgerMenu()
      }
      await Header.clickOnMenuItem(1)
      if (isMobileDevice) {
        await Header.clickHamburgerMenu()
      }
      return Header.screenshotAndGoBack(url)
    })
    ui('navigation in banner', async () => {
      const url = await HomePage.getURL()
      await HomePage.openBanner(0)
      return HomePage.screenshotAndGoBack(url)
    })
    ui('navigation in categories', async () => {
      const url = await HomePage.getURL()
      await HomePage.clickOnCategory(0)
      return HomePage.screenshotAndGoBack(url)
    })
    if (!loggedInUser) {
      ui('open recommendation', async () => {
        await HomePage.expandCulture(0)
        return homePageSelectors.recommendation.container
      })
      ui('close recommendation', async () => {
        await HomePage.closeRecommendation()
        return homePageSelectors.recommendation.container
      })
      ui('navigate to product from recommendation', async () => {
        const url = await HomePage.getURL()
        await HomePage.expandCulture(0)
        await HomePage.openProductFromRecommendation()
        return HomePage.screenshotAndGoBack(url)
      })
      ui('navigate to all products from recommendation', async () => {
        const url = await HomePage.getURL()
        await HomePage.expandCulture(0)
        await HomePage.openAllProductsPageFromRecommendation()
        return HomePage.screenshotAndGoBack(url)
      })
    }
    ui('navigation in FAQ ask agro', async () => {
      const url = await HomePage.getURL()
      await HomePage.clickOnAskAgro()
      return HomePage.screenshotAndGoBack(url)
    })
    ui('navigation in FAQ ask manager', async () => {
      const url = await HomePage.getURL()
      await HomePage.clickOnAskManager()
      return HomePage.screenshotAndGoBack(url)
    })
    if (loggedInUser) {
      ui('FAQ personal manager', async () => {
        await HomePage.openPersonalManagerModal()
        return Modal.close()
      })
    }
    ui('FAQ contact us', async () => {
      if (loggedInUser) {
        await HomePage.openContactUsLogged()
      } else {
        await HomePage.openContactUsUnlogged()
      }
      return Modal.close()
    })
    ui('navigation in technologies links', async () => {
      const url = await HomePage.getURL()
      await HomePage.clickOnTechnologiesLink(0)
      return HomePage.screenshotAndGoBack(url)
    })
    ui('navigation in technologies research results', async () => {
      const url = await HomePage.getURL()
      await HomePage.clickOnTechnologiesResearchResult()
      return HomePage.screenshotAndGoBack(url)
    })
    if (!loggedInUser) {
      ui('navigation in bestSellers', async () => {
        const url = await HomePage.getURL()
        await HomePage.clickOnBestSeller(0)
        return HomePage.screenshotAndGoBack(url)
      })
    }
    ui('navigation in footer', async () => {
      const url = await HomePage.getURL()
      await Footer.clickOnLink(0)
      return Footer.screenshotAndGoBack(url)
    })
  }

  checkWithLogin(pages, user, executeUI, executeNavigation)
})
