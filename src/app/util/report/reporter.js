'use strict'
const datetime = require('node-datetime')
const currentTime = datetime.create(new Date(), 'y-m-d H-M-S').format()
const analyzer = require('./analyzer.js')
const { resultDir, historyDir, emailDir } = require('../../const/properties/output.values')
const { writeResult, writeEmailContent, createDirIfNotExist } = require('../writer')

class Reporter {
  // noinspection JSUnusedGlobalSymbols
  onRunComplete(contexts, results) {
    createDirIfNotExist(resultDir)

    const analyzedContext = this._compareResults(results, `${resultDir}/${historyDir}`)

    const currentTestResultStatus = (results.numFailedTestSuites === 0) ? 'pass' : 'fail'
    writeResult(results, `${resultDir}/${historyDir}/run ${currentTime} ${currentTestResultStatus}.json`)

    const runStatsPath = `${resultDir}/${emailDir}/run.stat`
    const statsInfo = `numFailedTests=${(results.numFailedTests) ? results.numFailedTests : 0}\nnumPassedTests=${(results.numPassedTests) ? results.numPassedTests : 0}`
    writeResult(statsInfo, runStatsPath, false)

    writeEmailContent(analyzedContext, `${resultDir}/${emailDir}/report.stat`)
  }

  _compareResults(currentResult, historyPath) {
    const prevResult =
      analyzer.findPreviousTestRunResult(historyPath)
    const prevResultData = analyzer.getDataFromRun(prevResult)
    const currentResultData = analyzer.getDataFromRun(currentResult)
    return analyzer.compareResults(prevResultData, currentResultData)
  }
}

module.exports = Reporter
