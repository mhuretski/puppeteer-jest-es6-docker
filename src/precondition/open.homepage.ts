import { PagesMap } from '@classes/pages.map'
import { test } from '@actions'
import { MAIN_PAGE } from '@const/properties/constants'

export const openHomepageExecute =
  async (pages: PagesMap, path = MAIN_PAGE) => {
    await pages.homePage.open(path)
    const result = await pages.header.checkLogoExists()
    expect(result).toBeTruthy()
  }

const openHomepage = (pages: PagesMap, path = MAIN_PAGE): void => {
  test('open homepage', async () => {
    await openHomepageExecute(pages, path)
  })
}

export default openHomepage
