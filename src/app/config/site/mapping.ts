import { DEV, envFlag, PROD, STAGE } from '@const/properties/init.values'
import LOCAL_CONFIG from './local.props'
import DEV_CONFIG from './dev.props'
import STAGE_CONFIG from './stage.props'
import PROD_CONFIG from './prod.props'
import { startErrorExceptionMessage } from '@const/global/errors'
import { ENV_TO_CHECK } from '@const/global/flags'
import { StartProperties } from '@interfaces'

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
      startErrorExceptionMessage(envFlag.name, ENV_TO_CHECK, envFlag.values))
}

export default SITE
