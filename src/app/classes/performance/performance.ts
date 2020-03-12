import Page from '@classes/util/page'

/*
 * Info from Chrome browser
 */
export default class Performance extends Page {
  async getNavigation(URL: string,
          page = this._page): Promise<PerformanceTiming[]> {
    const client = await page.target().createCDPSession()
    await client.send('Network.enable')
    await client.send('Network.clearBrowserCache')

    await page.goto(URL, { timeout: 0 })

    const performance = JSON.parse(
      await page.evaluate(() => JSON.stringify(performance.getEntriesByType('navigation'))),
    )
    return performance
  }

  async getTimeToInteract(URL: string, page = this._page) {
    const navigation: PerformanceTiming[] = await this.getNavigation(URL, page)
    return navigation[0].domInteractive
  }
}
