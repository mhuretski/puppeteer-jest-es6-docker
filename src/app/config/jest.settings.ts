import {
  API_LAUNCH,
  PERF_LAUNCH,
  SPEC_LAUNCH,
  TEST_LAUNCH,
  UI_LAUNCH,
} from '@const/properties/init.values'
import { toMatchImageSnapshot } from '@config/screenshot.settings'
import { Browser } from 'puppeteer'
import { CHECK } from '@const/global/flags'

export let browser: Browser
export const checkBrowserConnectionBeforeAll =
  (browser: Browser, where: string) => {
    if (browser === undefined) {
      console.log(`ERROR Browser does not exist in ${where}.`)
    } else if (!browser.isConnected()) {
      console.log(`ERROR Browser is not connected in ${where}.`)
    }
  }

beforeAll(async () => {
  switch (CHECK) {
    case SPEC_LAUNCH:
    case UI_LAUNCH:
    case TEST_LAUNCH:
      expect.extend({ toMatchImageSnapshot })
      // @ts-ignore
      browser = await global.puppBrowser
      checkBrowserConnectionBeforeAll(browser, 'jest.settings')
      break
    case PERF_LAUNCH:
    case API_LAUNCH:
    default:
      break
  }
})
