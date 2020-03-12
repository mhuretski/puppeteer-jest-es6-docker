'use strict'
const NodeEnvironment = require('jest-environment-node')
const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')
const { DEFAULT_BROWSER_PATH_DIR, WS_ENDPOINT } = require('../../const/global/constants')


class PuppeteerEnvironment extends NodeEnvironment {
  setup = async () => {
    await super.setup()

    // get the wsEndpoint
    const wsEndpoint = fs.readFileSync(
      path.join(DEFAULT_BROWSER_PATH_DIR, WS_ENDPOINT),
      'utf8',
    )
    if (!wsEndpoint) {
      throw new Error('wsEndpoint not found')
    }

    // eslint-disable-next-line no-invalid-this
    this.global.puppBrowser = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint,
    })
  }

  teardown = async () => {
    await super.teardown()
  }

  runScript(script) {
    return super.runScript(script)
  }
}

module.exports = PuppeteerEnvironment
