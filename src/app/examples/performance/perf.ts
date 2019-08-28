import { performancePack, singlePack } from '@app/global/actions'
import { expectedResults, setNetworkOptions } from '@app/performance/template'

/**
 * Example for single test run with specified options
 */
const options = {
  URL: 'https://www.google.com/',
  networkCondition: setNetworkOptions('desktop', 'WiFi', 0),
  expectedResults: expectedResults(0.26, 0.55, 0.44, 0.9, 0.9),
  writeReport: true,
}
singlePack('Main page', options)


/**
 * Example for single test run with default options
 */
singlePack('Main page', 'https://www.google.com/')


/**
 * Example pack of test runs with specified pack options
 */
const packOptions = [
  {
    networkCondition: setNetworkOptions('desktop', 'WiFi', 0),
    expectedResults: expectedResults(0.26, 0.55, 0.44, 0.9, 0.9),
  },
  {
    networkCondition: setNetworkOptions('desktop', 'Regular3G', 2),
    expectedResults: expectedResults(0.26, 0.55, 0.44, 0.9, 0.9),
  },
]
performancePack('Main page', 'https://www.google.com/', packOptions, true)


/**
 * Example pack of test runs with default pack options
 */
performancePack('Main page', 'https://www.google.com/')
