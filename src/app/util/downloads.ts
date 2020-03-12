import { buildSpecificTempDir } from '@const/global/paths'
import {
  clearDir,
  createDirIfNotExist,
  exists,
  removeFile,
  renameFile,
} from './writer'
import path from 'path'

const PDFImage = require('pdf-image').PDFImage

export const defaultFileName = '1'

export const clearDownloadFolder =
  async (pathToFolder = buildSpecificTempDir) => {
    if (exists(pathToFolder)) {
      const lastChar = pathToFolder.charAt(pathToFolder.length - 1)
      if (lastChar !== '*') {
        pathToFolder = path.join(pathToFolder, '*')
      }
      await clearDir(pathToFolder)
    } else {
      createDirIfNotExist(pathToFolder)
    }
  }

export const renameDownloadedFile =
  (filename: string, downloadFolder = buildSpecificTempDir,
          newName = defaultFileName) => {
    const filePath = path.resolve(downloadFolder, filename)
    const newFullFileName = `${newName}${path.extname(filePath)}`
    const newDirPath = path.dirname(filePath)
    const newFullPath = path.join(newDirPath, newFullFileName)

    renameFile(filePath, newFullPath)
    return newFullPath
  }

export const convertPDFToJPG = async (fullPath: string,
  fileName = defaultFileName) => {
  const dirPath = path.dirname(fullPath)

  const pdfImage = new PDFImage(path.join(dirPath, fileName), {
    graphicsMagick: true,
  })
  await pdfImage.convertPage(0).catch((err: any) => {
    console.log(err)
  })

  removeFile(fullPath)
  return path.join(dirPath, `${fileName}-0.png`)
}
