import { NEW_LINE, TS_TRACE_FILTER } from '@const/global/constants'

export const itemOutOfBoundExceptionMessage = (selector: string, position: number, listLength: number) => `Error: Can't click selector "${selector}" item #${position} is out of bound of ${listLength}.`
export const clickTimeoutExceptionMessage = (selector: string, timeout: number) => `TimeoutError: Click selector "${selector}" failed: timeout ${timeout}ms exceeded.`
export const selectExceptionMessage = (selector: string, timeout: number) => `TimeoutError: Failed to find selector "${selector}": timeout ${timeout}ms exceeded.`
export const waitToBeExceptionMessage = (selector: string, timeout: number, state: boolean) => `TimeoutError: Selector "${selector}" visibility is ${state}: timeout ${timeout}ms exceeded.`
export const startErrorExceptionMessage = (flagName: string, flagValue: string | undefined, permittedValues: string[] | string) => `Start configuration is not specified. Current parameter is "${flagValue}". Specified parameters: ${permittedValues}. Set arg  --${flagName}=<parameter> in order to proceed.`
export const userNotFoundExceptionMessage = (position: number, amount: number) => `Desired user with position "${position}" is out of possible range. Total amount of predefined users - "${amount}".`
export const userAlreadyTakenExceptionMessage = (position: number) => `Desired user with position "${position}" is already reserved by another test package."`
export const errorInPreviousTest = 'Error in previous test'

export const errorResult = (e: Error) => {
  if (!e.message.includes(errorInPreviousTest)) {
    const filteredStacktrace = (e.stack) ? e.stack
      .split(NEW_LINE)
      .filter((e: any) => e.includes(TS_TRACE_FILTER))
      .join(NEW_LINE)
      .slice(0, 1000) : ''
    return e.message + NEW_LINE + filteredStacktrace
  } else {
    return errorInPreviousTest
  }
}
