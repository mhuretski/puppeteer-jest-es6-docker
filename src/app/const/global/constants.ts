import dateFormat from 'dateformat'
import path from 'path'
import os from 'os'

export const NEW_LINE = '\n'
export const TS_TRACE_FILTER = '.ts:'
export const CURRENT_DATE = dateFormat(new Date(), 'dd.mm.yyyy')
export const DEFAULT_BROWSER_PATH_DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')
export const WS_ENDPOINT = 'wsEndpoint'
