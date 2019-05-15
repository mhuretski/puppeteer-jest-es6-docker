'use strict';
const writeFileP = require("write-file-p");
const datetime = require("node-datetime");
const currentTime = datetime.create(new Date(), 'y-m-d H-M-S').format();

class MyCustomReporter {

    onTestResult(testSkip, testResultSkip, aggregatedResult) {
        let exportFolder = (process.env.npm_config_exp === undefined) ? 'testResults' : process.env.npm_config_exp;
        let testResult = (aggregatedResult.numFailedTestSuites === 0) ? 'pass' : 'fail';
        writeFileP.sync(`${exportFolder}/run ${currentTime} ${testResult}.json`, JSON.stringify(aggregatedResult));
    }

    getLastError() {
        if (this._shouldFail) {
            let error = new Error('reporter.js reported an error');
            writeFileP.sync(`${exportFolder}/run ${currentTime} error.json`, error);
            return error;
        }
    }

}

module.exports = MyCustomReporter;