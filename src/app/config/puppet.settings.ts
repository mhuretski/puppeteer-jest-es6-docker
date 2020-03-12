import { LaunchOptions, Page, Viewport } from 'puppeteer'
import { DEBUG } from '@const/global/flags'
import { buildSpecificTempDir } from '@const/global/paths'

export const defaultViewport: Viewport = {
  width: 1200,
  height: 1080,
}

export const uiProps: LaunchOptions = {
  headless: !DEBUG,
  // slowMo: isDebug ? 150 : 0,
  args: [
    // '--enable-logging',
    '--disable-web-security',
    '--no-sandbox',
    `--window-size=${defaultViewport.width},${defaultViewport.height}`,
    '--disable-setuid-sandbox',
    '--ignore-certificate-errors',
    '--enable-features=NetworkService',
  ],
  ignoreHTTPSErrors: true,
}

export const perfProps: LaunchOptions = {
  headless: !DEBUG,
  defaultViewport: null,
  args: [
    '--disable-gpu',
  ],
}

export const setDownloadProperties = async (page: Page,
  downloadPath = buildSpecificTempDir) => {
  const client = await page.target().createCDPSession()
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: downloadPath,
  })
}
