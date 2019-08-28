'use strict'
import { buildSpecificTempDir } from '@const/global/paths'
import { clearDir, removeFile, renameFile } from './writer'
import path from 'path'
// @ts-ignore
import pdf from 'pdf-poppler'

export const defaultFileName = '1'

export const clearDownloadFolder =
  async (pathToFolder = buildSpecificTempDir) => {
    const lastChar = pathToFolder.charAt(pathToFolder.length - 1)
    if (lastChar !== '*') {
      pathToFolder = path.join(pathToFolder, '*')
    }
    await clearDir(pathToFolder)
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
  const opts = {
    format: 'jpeg',
    out_dir: dirPath,
    out_prefix: fileName,
    page: null,
  }

  await pdf.convert(fullPath, opts)
  removeFile(fullPath)
  return path.join(dirPath, `${fileName}-1.jpg`)
}
