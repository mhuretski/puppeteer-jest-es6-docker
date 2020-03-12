import devices, { Device } from 'puppeteer/DeviceDescriptors'
import mobiles from '@config/devices/pool/mobile.props'
import desktop from '@config/devices/pool/desktop.props'

export const desktopName = 'Desktop'
export const desktopUserAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36'

const desktopDevices: Device[] = desktop.map(resolution => {
  return {
    name: `${desktopName} ${resolution.width}x${resolution.height}`,
    userAgent: desktopUserAgent,
    viewport: {
      width: resolution.width,
      height: resolution.height,
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false,
      isLandscape: false,
    },
  }
})

const mobileDevices: Device[] = mobiles.map(mobile => devices[mobile])

const devicePool: Device[] = mobileDevices.concat(desktopDevices)

export default devicePool
