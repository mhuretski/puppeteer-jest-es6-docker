'use strict'
import {
  API_LAUNCH,
  PERF_LAUNCH,
  SPEC_LAUNCH,
  TEST_LAUNCH,
  UI_LAUNCH,
} from '@const/properties/init.values'
import { uiProps as puppetProps } from './puppet.settings'
import { toMatchImageSnapshot } from './screenshot.settings'
import puppeteer, { Browser } from 'puppeteer'
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
    case PERF_LAUNCH:
    case API_LAUNCH:
      break
    case SPEC_LAUNCH:
    case UI_LAUNCH:
    case TEST_LAUNCH:
      try {
        expect.extend({ toMatchImageSnapshot })
        browser = await puppeteer.launch(puppetProps)
          .catch(e => {
            console.log('ERROR browser beforeAll 1st attempt', e)
            return puppeteer.launch(puppetProps)
          })
      } catch (e) {
        console.log('ERROR browser beforeAll 2nd attempt', e)
      } finally {
        checkBrowserConnectionBeforeAll(browser, 'jest.settings')
      }
      break
    default:
      // jasmine can't throw exception from beforeAll
      break
  }
})

afterAll(async done => {
  switch (CHECK) {
    case SPEC_LAUNCH:
    case UI_LAUNCH:
    case TEST_LAUNCH:
      try {
        if (browser !== undefined && browser.isConnected()) {
          await browser.close()
        } else {
          console.log(`WARNING Browser wasn't properly closed.`)
        }
      } catch (e) {
        console.log('WARNING Failed to close browser.', e)
        process.exit()
      } finally {
        if (browser !== undefined && browser.isConnected()) {
          await browser.close()
        }
        done()
      }
      break
    case PERF_LAUNCH:
    case API_LAUNCH:
    default:
      done()
      break
  }
})
