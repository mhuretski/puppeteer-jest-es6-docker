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

beforeAll(async () => {
  switch (CHECK) {
    case PERF_LAUNCH:
    case API_LAUNCH:
      break
    case SPEC_LAUNCH:
    case UI_LAUNCH:
    case TEST_LAUNCH:
      expect.extend({ toMatchImageSnapshot })
      browser = await puppeteer.launch(puppetProps)
      // console.log(`LOG Browser exists: ${browser !== undefined}`)
      break
    default:
    // jasmine can't throw exception from beforeAll
    // caught it in describes further
      break
  }
})

afterAll(async () => {
  switch (CHECK) {
    case SPEC_LAUNCH:
    case UI_LAUNCH:
    case TEST_LAUNCH:
      await browser.close()
      break
    case PERF_LAUNCH:
    case API_LAUNCH:
    default:
      break
  }
})
