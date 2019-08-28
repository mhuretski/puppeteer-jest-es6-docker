'use strict'
import Page from '@classes/util/page'

export default class Coverage extends Page {
  async getCoverage(URL: string, page = this._page) {
    await Promise.all([
      page.coverage.startJSCoverage(),
      page.coverage.startCSSCoverage(),
    ])
    await page.goto(URL)
    const [jsCoverage, cssCoverage] = await Promise.all([
      page.coverage.stopJSCoverage(),
      page.coverage.stopCSSCoverage(),
    ])
    let totalBytes = 0
    let usedBytes = 0
    const coverage = [...jsCoverage, ...cssCoverage]
    for (const entry of coverage) {
      totalBytes += entry.text.length
      for (const range of entry.ranges) {
        usedBytes += range.end - range.start - 1
      }
    }
    const percent = usedBytes / totalBytes * 100
    console.log(`Bytes used: ${percent.toFixed(2)}%`)
    return percent
  }
}
