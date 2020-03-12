import Page from '@classes/util/page'
import {
  NETWORK_CONNECTIONS,
  NetworkProps,
} from '@app/performance/network.props'

export default class Throttling extends Page {
  static getNetworkPresets = () => NETWORK_CONNECTIONS

  defineNetworkPreset(offline = false,
          latency = 200,
          downloadThroughput = 780,
          uploadThroughput = 330): NetworkProps {
    return {
      // Whether chrome should simulate
      // the absence of connectivity
      offline: false,
      // Simulated latency (ms)
      latency: latency, // 200 ms
      // Simulated download speed (kb/s)
      downloadThroughput: downloadThroughput * 1024 / 8, // 780 kb/s
      // Simulated upload speed (kb/s)
      uploadThroughput: uploadThroughput * 1024 / 8, // 330 kb/s
    }
  }

  async simulateConditions(networkPreset: NetworkProps,
          throttlingRate = 4, page = this._page) {
    const client = await page.target().createCDPSession()
    await client.send('Network.enable')
    await client.send('Network.emulateNetworkConditions', networkPreset)
    await client.send('Emulation.setCPUThrottlingRate', { rate: throttlingRate })
  }
}
