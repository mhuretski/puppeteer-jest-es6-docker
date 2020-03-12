import { CHECK, ENV_TO_CHECK } from '@const/global/flags'

const varName = function(): string {
  // @ts-ignore
  // eslint-disable-next-line no-invalid-this
  return Object.keys(this).pop()
}

export const [DEV, STAGE, PROD] = ['DEV', 'STAGE', 'PROD']
// what we want to check
export const [UI_LAUNCH, API_LAUNCH, REST_LAUNCH, SOAP_LAUNCH, SPEC_LAUNCH, PERF_LAUNCH, TEST_LAUNCH] = ['UI', 'API', 'REST', 'SOAP', 'SPEC', 'PERF', 'TEST']
// what is file pattern
export const [UI_TEST, API_TEST, REST_TEST, SOAP_TEST, SPEC_TEST, PERF_TEST] = ['UI', 'API', 'REST', 'SOAP', 'SPEC', 'PERF']

export const envFlag = {
  name: varName.call({ ENV_TO_CHECK }),
  values: [DEV, STAGE, PROD],
}
export const checkFlag = {
  name: varName.call({ CHECK }),
  values: [
    UI_LAUNCH,
    API_LAUNCH,
    REST_LAUNCH,
    SOAP_LAUNCH,
    SPEC_LAUNCH,
    PERF_LAUNCH,
    TEST_LAUNCH,
  ],
}
