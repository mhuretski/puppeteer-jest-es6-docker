'use strict'
const fs = require('fs')
const { resolve, join } = require('path')

class Analyzer {
    findPreviousTestRunResult(historyPath) {
        if (fs.existsSync(historyPath)) {
            let latest
            const path = resolve(historyPath)
            const files = fs.readdirSync(path)
            files.forEach((filename) => {
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
                const fileData = fs.readFileSync(resolve(join(path, latest.filename))).toString()
                return JSON.parse(fileData)
            }
        }
    }

    getDataFromRun(runResult) {
        if (runResult && runResult.testResults) {
            const result = []
            runResult.testResults.forEach((suite) => {
                suite.testResults.forEach((test) => {
                    const foundSuite = result.find((suite) => {
                        if (suite.ancestorTitles && test.ancestorTitles) {
                            if (suite.ancestorTitles.length === 1 && test.ancestorTitles.length === 1) {
                                if (suite.ancestorTitles[0] === test.ancestorTitles[0]) {
                                    return suite
                                }
                            } else if (suite.ancestorTitles.length > 1 && test.ancestorTitles.length > 1) {
                                if (
                                    suite.ancestorTitles[0] === test.ancestorTitles[0] &&
                                    suite.ancestorTitles[1] === test.ancestorTitles[1]
                                ) {
                                    return suite
                                }
                            }
                        }
                    })
                    if (foundSuite) {
                        foundSuite.tests.push({
                            title: test.title,
                            status: test.status,
                        })
                    } else {
                        result.push({
                            ancestorTitles: test.ancestorTitles,
                            tests: [
                                {
                                    title: test.title,
                                    status: test.status,
                                },
                            ],
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
                current.forEach((curSuite) => {
                    curSuite.tests.forEach((curTest) => {
                        if (curTest.status === 'failed') {
                            let isNewFailed = false
                            previous.forEach((prevSuite) => {
                                const sameSuites = this._compareArrays(
                                    prevSuite.ancestorTitles,
                                    curSuite.ancestorTitles
                                )
                                if (sameSuites) {
                                    prevSuite.tests.forEach((prevTest) => {
                                        if (prevTest.title === curTest.title && prevTest.status === 'passed') {
                                            isNewFailed = true
                                        }
                                    })
                                }
                            })
                            if (isNewFailed) {
                                result.push(this._reportData(curSuite, curTest, ++count))
                            }
                        }
                    })
                })
                return result
            }
        }

        return newFailedTests()
    }

    _reportData(curSuite, curTest, count) {
        if (curSuite.ancestorTitles.length > 1) {
            return `${count}. Suite: "${curSuite.ancestorTitles[0]} > ${curSuite.ancestorTitles[1]}" Test: "${curTest.title}" - new Fail!`
        } else {
            return `${count}. Suite: "${curSuite.ancestorTitles[0]}" Test: "${curTest.title}" - new Fail!`
        }
    }

    _compareArrays(arr1, arr2) {
        if (!arr1 || !arr2) {
            return false
        }

        if (arr1.length !== arr2.length) {
            return false
        }

        for (let i = 0, l = arr1.length; i < l; i++) {
            if (arr1[i] instanceof Array && arr2[i] instanceof Array) {
                if (!this._compareArrays(arr1[i], arr2[i])) {
                    return false
                }
            } else if (arr1[i] !== arr2[i]) {
                return false
            }
        }
        return true
    }
}

module.exports = new Analyzer()
