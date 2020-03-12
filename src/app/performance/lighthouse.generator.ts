import { perfProps } from '@config/puppet.settings'
import { NETWORK_CONNECTIONS, NetworkProps } from './network.props'
import {
  defaultExpectedResults,
  defaultNetworkCondition,
  ExpectedResults,
  NetworkConditionsPerformance,
  PerformanceSetup,
} from './template'
import puppeteer, { Page, Target } from 'puppeteer'

const lighthouse = require('lighthouse')


/**
 * @param {Page} page
 * @param {object} networkPreset
 * @param {number} throttlingRate
 * @return {promise}
 */
const simulateConditions = async (page: Page, networkPreset: NetworkProps,
  throttlingRate: number = 0) => {
  const client = await page.target().createCDPSession()
  await client.send('Network.enable')
  await client.send('Network.emulateNetworkConditions', networkPreset)
  await client.send('Emulation.setCPUThrottlingRate', { rate: throttlingRate })
}

interface Category {
  id: string;
  title: string;
  description?: string;
  manualDescription?: string;
  score: number | null;
  auditRefs: any[];
}

export interface PerformanceResults {
  report: any,
  lhr: {
    requestedUrl: string;
    finalUrl: string;
    fetchTime: string;
    lighthouseVersion: string;
    audits: any;
    categories: Map<string, Category>;
    categoryGroups?: any;
    configSettings: any;
    runWarnings: string[];
    runtimeError?: { code: string, message: string };
    userAgent: string;
    environment: any;
    timing: any;
    i18n: {
      rendererFormattedStrings: any,
      icuMessagePaths: any
    };
    stackPacks?: any[];
  }
}

/**
 * launch Chrome via Puppeteer, use puppeteer to throttle connection, run
 * lighthouse. Not ideal; throttle via comcast os level util might be better
 * @param {string} url
 * @param {NetworkConditionsPerformance} options
 * @return {promise}
 */
export const getPerformance = async (url: string,
  options: NetworkConditionsPerformance): Promise<PerformanceResults> => {
  const browser = await puppeteer.launch(perfProps)

  browser.on('targetchanged', async (target: Target) => {
    const page = await target.page()
    if (page && page.target().url() === url) {
      await simulateConditions(page,
        NETWORK_CONNECTIONS[options.connection], options.throttlingRate)
    }
  })

  options.port = (new URL(browser.wsEndpoint())).port
  const { report, lhr } = await lighthouse(url, options)

  await browser.close()

  return { report, lhr }
}

/**
 * @param {string} URL
 * @param {NetworkConditionsPerformance} networkCondition
 * @param {{
 * 'first-contentful-paint': number,
 * 'first-cpu-idle': number,
 * 'interactive': number,
 * 'mainthread-work-breakdown': number,
 * 'bootup-time': number
 * }} expectedResults
 * @param {boolean} writeReport
 * @return {{
 * URL: string,
 * options: {
 * networkCondition: NetworkConditionsPerformance,
 * expectedResults: {
 * 'first-contentful-paint': number,
 * 'first-cpu-idle': number,
 * 'interactive': number,
 * 'mainthread-work-breakdown': number,
 * 'bootup-time': number
 * }
 * },
 * writeReport: boolean
 * }}
 */
export interface PerformanceCondition {
  URL: string,
  networkCondition: NetworkConditionsPerformance,
  expectedResults: ExpectedResults,
  writeReport: boolean
}

export const performanceCondition = (URL: string,
        // eslint-disable-next-line max-len
        networkCondition: NetworkConditionsPerformance = defaultNetworkCondition,
        expectedResults: ExpectedResults = defaultExpectedResults,
        writeReport: boolean = true): PerformanceSetup => {
  return {
    URL: URL,
    options: {
      networkCondition: networkCondition,
      expectedResults: expectedResults,
    },
    writeReport: writeReport,
  }
}
