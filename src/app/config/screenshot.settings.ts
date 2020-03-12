import path from 'path'
import kebabCase from 'lodash/kebabCase'
import { configureToMatchImageSnapshot } from 'jest-image-snapshot'
import { buildSpecificDiffDir } from '@const/global/paths'

const customConfig = {
  threshold: 0.3,
}

// noinspection JSUnusedLocalSymbols
const customSnapshotIdentifier = ({
  // @ts-ignore
  defaultIdentifier, testPath, currentTestName, counter,
}): string => {
  return kebabCase(`${path.dirname(testPath).split(path.sep).pop()}-${currentTestName}-${counter}`)
}

export interface MatchImageSnapshotOptions {
  customSnapshotIdentifier?: Function | string;
}

export const screenExpectOption: MatchImageSnapshotOptions = {
  customSnapshotIdentifier: customSnapshotIdentifier,
}

export const toMatchImageSnapshot: jest.CustomMatcher =
  configureToMatchImageSnapshot({
    customDiffConfig: customConfig,
    // customSnapshotsDir: snapshotsDir,
    customDiffDir: buildSpecificDiffDir,
    diffDirection: 'horizontal',
    noColors: false,
    failureThreshold: 1,
    failureThresholdType: 'percent',
    updatePassedSnapshot: false,
  })
