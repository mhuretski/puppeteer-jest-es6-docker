const kebabCase = require('lodash/kebabCase')
const {
  perfDir,
  resultDir,
} = require('../const/properties/output.values')
const datetime = require('node-datetime')
const currentTime = datetime.create(new Date(), 'y-m-d H-M-S').format()
const rimraf = require('rimraf')

const fs = require('fs')
const writeFileP = require('write-file-p')

const writeWithAppend = (data, path) => {
  const write = (data) => {
    fs.appendFileSync(path, data)
  }
  write(data)
  write('\n')
}

const writeEmailContent = (data, path) => {
  const write = (data) => {
    fs.appendFileSync(path, data)
  }
  const newLine = () => {
    write('\n')
  }

  if (Array.isArray(data) && data.length) {
    for (let index = 0; index < data.length; index++) {
      write(data[index])
      newLine()
    }
  } else {
    write('')
  }
}

const writeResult = (result, path, stringify = true) => {
  if (stringify) {
    writeFileP.sync(path, JSON.stringify(result))
  } else {
    writeFileP.sync(path, result)
  }
}

const writePerformance = (name, options, result) => {
  const filename = kebabCase(`perf-${name}-${options.emulatedFormFactor}-${options.connection}-throttling-${options.throttlingRate}-${currentTime}`)
  const buildNumber = process.env.npm_config_BUILD_NUMBER
  const buildSpecificDir = (buildNumber) ? `${buildNumber}/` : ''
  const filePath = `${resultDir}/${perfDir}/${buildSpecificDir}${filename}.${options.output}`
  writeFileP.sync(filePath, result)
}

const createResultDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}

const renameFile = (sourcePath, destinationPath) => {
  return fs.renameSync(sourcePath, destinationPath)
}

const removeFile = (path) => {
  return fs.unlinkSync(path)
}

const clearDir = async (pathToDir) => {
  await rimraf(pathToDir, function() {})
}

const readDir = (pathToDir) => {
  return fs.readdirSync(pathToDir)
}

module.exports = {
  writeWithAppend,
  writeEmailContent,
  writeResult,
  writePerformance,
  createResultDir,
  renameFile,
  removeFile,
  clearDir,
  readDir,
}
