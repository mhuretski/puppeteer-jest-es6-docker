import path from 'path'
import { imagesDir, resultDir, tempDir } from '@const/properties/output.values'
import { BUILD_NUMBER } from '@const/global/flags'

const setResultFolder = (folder: string) => path.join(process.cwd(), resultDir, folder, BUILD_NUMBER || '')

export const buildSpecificTempDir = setResultFolder(tempDir)
export const buildSpecificDiffDir = setResultFolder(imagesDir)
