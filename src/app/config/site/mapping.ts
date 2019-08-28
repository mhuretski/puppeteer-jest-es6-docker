'use strict'
import {
  DEV,
  envFlag,
  PROD,
  STAGE,
} from '@const/properties/init.values'
import LOCAL_CONFIG from './local.props'
import DEV_CONFIG from './dev.props'
import STAGE_CONFIG from './stage.props'
import PROD_CONFIG from './prod.props'
import { startErrorMessage } from '@const/global/error.messages'
import { ENV_TO_CHECK } from '@const/global/flags'

interface DYN_ADMIN {
  PROD_SCHEME_URL: string,
  username: string,
  password: string,
  ProfileAdapterRepository: string,
}
interface SOAP {
  baseURL: string,
  addProduct: string,
  addOrganization: string,
}
export interface StartProperties {
  MAIN_PAGE: string,
  defaultLoginValue: string,
  defaultPasswordValue: string,
  DYN_ADMIN: DYN_ADMIN,
  SOAP: SOAP,
}

let SITE: StartProperties
switch (ENV_TO_CHECK) {
  case DEV:
    SITE = DEV_CONFIG
    break
  case STAGE:
    SITE = STAGE_CONFIG
    break
  case PROD:
    SITE = PROD_CONFIG
    break
  case 'LOCAL':
    SITE = LOCAL_CONFIG
    break
  default:
    throw new Error(
      startErrorMessage(envFlag.name, ENV_TO_CHECK, envFlag.values))
}

export default SITE
