import path from 'path'
import { Cookie } from 'puppeteer'
import { writeResult } from '@app/util/writer'

const cookiesPath = path.join(process.cwd(), 'cookies.json')

export const writeCookies = (cookies: Cookie[]) => {
  writeResult(cookies, cookiesPath, true)
}

export const readCookies = () => {
  let cookies: Cookie[] = []
  try {
    cookies = require(cookiesPath)
  } catch (e) {
    console.log('WARNING Cookies not found.', e)
  }
  return cookies
}
