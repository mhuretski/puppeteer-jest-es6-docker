'use strict'
import { PagesMap } from '@classes/pages.map'
import { ui } from '@actions'
import { MAIN_PAGE } from '@const/properties/constants'

export let isMobileDevice: boolean

const openHomepage = (po: PagesMap, path = MAIN_PAGE): void => {
  ui('open homepage', async () => {
    await po.homePage.open(path)
    isMobileDevice = await po.default.isMobile()
    const result = await po.header.checkLogoExists()
    expect(result).toBeTruthy()
    return true
  })
}

export default openHomepage
