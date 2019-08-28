'use strict'
const fs = require('fs')
const { resolve, join } = require('path')


class Analyzer {
  findPreviousTestRunResult(historyPath) {
    if (fs.existsSync(historyPath)) {
      let latest
      const path = resolve(historyPath)
      const files = fs.readdirSync(path)
      files.forEach(filename => {
        const stat = fs.lstatSync(join(path, filename))
        if (!stat.isDirectory()) {
          if (!latest) {
            latest = { filename, mtime: stat.mtime }
          } else if (stat.mtime > latest.mtime) {
            latest.filename = filename
            latest.mtime = stat.mtime
          }
        }
      })

      if (latest) {
        const fileData = fs.readFileSync(
          resolve(join(path, latest.filename))
        ).toString()
        return JSON.parse(fileData)
      }
    }
  }

  getDataFromRun(runResult) {
    if (runResult && runResult.testResults) {
      const result = []
      runResult.testResults.forEach(suite => {
        suite.testResults.forEach(test => {
          const foundSuite = result.find(suite => {
            if (suite.suiteName === test.ancestorTitles[0]) {
              return suite
            }
          })
          if (foundSuite) {
            foundSuite.tests.push({
              title: test.title,
              status: test.status,
            })
          } else {
            result.push({
              suiteName: test.ancestorTitles[0],
              tests: [{
                title: test.title,
                status: test.status,
              }],
            })
          }
        })
      })
      return result
    }
  }

  compareResults(previous, current) {
    const newFailedTests = () => {
      if (previous && current) {
        const result = []
        let count = 0
        current.forEach(curSuite => {
          curSuite.tests.forEach(curTest => {
            if (curTest.status === 'failed') {
              let isNewFailed = false
              previous.forEach(prevSuite => {
                if (prevSuite.suiteName === curSuite.suiteName) {
                  prevSuite.tests.forEach(prevTest => {
                    if (prevTest.title === curTest.title &&
                        prevTest.status === 'passed') {
                      isNewFailed = true
                    }
                  }
                  )
                }
              })
              if (isNewFailed) {
                result.push(`${++count}. Suite: "${curSuite.suiteName}" Test: "${curTest.title}" - new Fail!`)
              }
            }
          })
        })
        return result
      }
    }

    return newFailedTests()
  }
}

module.exports = new Analyzer()
