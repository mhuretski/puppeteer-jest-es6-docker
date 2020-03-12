import { uiProps } from '@config/puppet.settings'
import puppeteer from 'puppeteer'
import mkdirp from 'mkdirp'
import path from 'path'
import fs from 'fs'
import { DEFAULT_BROWSER_PATH_DIR, WS_ENDPOINT } from '@const/global/constants'

// noinspection JSUnusedGlobalSymbols
export default async () => {
  const browser = await puppeteer.launch(uiProps)

  // @ts-ignore
  global.__BROWSER_GLOBAL__ = browser

  mkdirp.sync(DEFAULT_BROWSER_PATH_DIR)
  fs.writeFileSync(
    path.join(DEFAULT_BROWSER_PATH_DIR, WS_ENDPOINT), browser.wsEndpoint(),
  )
}
