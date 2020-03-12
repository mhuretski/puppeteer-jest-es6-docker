import { DEFAULT_BROWSER_PATH_DIR } from '@const/global/constants'
import rimraf from 'rimraf'

// noinspection JSUnusedGlobalSymbols
export default async () => {
  try {
    // @ts-ignore
    await global.__BROWSER_GLOBAL__.close()
  } catch (e) {
    console.log('ERROR Browser is not closed in teardown')
  }

  rimraf.sync(DEFAULT_BROWSER_PATH_DIR)
}
