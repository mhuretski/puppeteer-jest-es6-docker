import { performance, test } from '@app/global/actions'

/**
 * @typedef {Object} NetworkConditionsPerformance
 * @property {string} output
 * @property {string} throttlingMethod
 * @property {string} extends
 * @property {string} logLevel
 * @property {boolean} disableNetworkThrottling
 * @property {string} connection
 * @property {number} throttlingRate
 * @property {string} emulatedFormFactor
 * @property {string} [port]
 */
/**
 * Corresponds to "Dense 4G 25th percentile" in
 * https://docs.google.com/document/d/1Ft1Bnq9-t4jK5egLSOc28IL4TvR-Tt0se_1faTA4KTY/edit#heading=h.bb7nfy2x9e5v
 * @param {'mobile' | 'desktop'} emulatedFormFactor
 * @param {string} connection
 * @param {number} throttlingRate rate of throttling CPU [0-8]
 * @return {NetworkConditionsPerformance}
 */
export interface NetworkConditionsPerformance {
    extends?: string
    connection: string
    throttlingRate?: number
    disableNetworkThrottling?: boolean
    throttlingMethod?: string
    output?: string
    logLevel?: string
    emulatedFormFactor?: 'mobile' | 'desktop'
    port?: string
}

export const setNetworkOptions = (
    emulatedFormFactor: 'mobile' | 'desktop',
    connection: string,
    throttlingRate = 4
): NetworkConditionsPerformance => {
    return {
        extends: 'lighthouse:default',
        connection: connection,
        throttlingRate: throttlingRate,
        disableNetworkThrottling: true,
        throttlingMethod: 'provided',
        output: 'html',
        logLevel: 'silent',
        emulatedFormFactor: emulatedFormFactor,
    }
}

export interface ExpectedResults {
    'first-contentful-paint': number
    'first-cpu-idle': number
    interactive: number
    'mainthread-work-breakdown': number
    'bootup-time': number
}

export const expectedResults = (
    firstContentfulPaint: number,
    interactive: number,
    firstCpuIdle: number,
    bootupTime: number,
    mainthreadWorkBreakdown: number
): ExpectedResults => {
    return {
        'first-contentful-paint': firstContentfulPaint,
        interactive: interactive,
        'first-cpu-idle': firstCpuIdle,
        'bootup-time': bootupTime,
        'mainthread-work-breakdown': mainthreadWorkBreakdown,
    }
}

export interface PerfPackOptions {
    networkCondition: NetworkConditionsPerformance
    expectedResults: ExpectedResults
}

export interface PerformanceSetup {
    URL: string
    options: PerfPackOptions
    writeReport: boolean
}

export const defaultPerfPackOptions: PerfPackOptions[] = [
    {
        networkCondition: setNetworkOptions('desktop', 'WiFi', 0),
        expectedResults: expectedResults(0.26, 0.55, 0.44, 0.9, 0.9),
    },
    {
        networkCondition: setNetworkOptions('desktop', 'Regular3G', 2),
        expectedResults: expectedResults(0.26, 0.55, 0.44, 0.9, 0.9),
    },
    {
        networkCondition: setNetworkOptions('mobile', 'WiFi', 0),
        expectedResults: expectedResults(0.26, 0.55, 0.44, 0.9, 0.9),
    },
    {
        networkCondition: setNetworkOptions('mobile', 'Regular3G', 4),
        expectedResults: expectedResults(0.26, 0.55, 0.44, 0.9, 0.9),
    },
]

export const defaultNetworkCondition: NetworkConditionsPerformance = setNetworkOptions('desktop', 'WiFi', 0)

export const defaultExpectedResults: ExpectedResults = expectedResults(0.26, 0.53, 0.44, 0.9, 0.9)

const checkLhrAudit = (key: string, expectedResults: ExpectedResults) => {
    if (performance && performance.lhr && performance.lhr.audits) {
        expect(performance.lhr.audits[key].score).toBeGreaterThanOrEqual(expectedResults['first-contentful-paint'])
    } else throw new Error(`Error! No performance results for key "${key}"`)
}

export const performancePackTestsTemplate = (name: string, expectedResults = defaultExpectedResults) => {
    test(`${name} first contentful paint}`, () => {
        checkLhrAudit('first-contentful-paint', expectedResults)
    })

    test(`${name} time to interactive`, () => {
        checkLhrAudit('interactive', expectedResults)
    })

    test(`${name} first cpu idle`, () => {
        checkLhrAudit('first-cpu-idle', expectedResults)
    })

    test(`${name} js boot-up`, () => {
        checkLhrAudit('bootup-time', expectedResults)
    })

    test(`${name} mainthread work`, () => {
        checkLhrAudit('mainthread-work-breakdown', expectedResults)
    })
}
