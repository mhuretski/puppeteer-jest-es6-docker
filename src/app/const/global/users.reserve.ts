import SITE from '@config/site/mapping'
import { userAlreadyTakenExceptionMessage, userNotFoundExceptionMessage } from '@const/global/errors'
import { ReserveUser, UpdatedGlobal, User } from '@interfaces'
import { defaultLoginValue, defaultPasswordValue } from '@const/properties/constants'

declare const global: UpdatedGlobal
const RESERVED: number[] = global.reservedTestUsers

export const RESERVE_USER: ReserveUser = (position: number) => {
  const isReserved = () => {
    return RESERVED.some(taken => taken === position)
  }

  if (isReserved()) {
    throw new Error(userAlreadyTakenExceptionMessage(position))
  }
  const user = GET_USER(position)
  RESERVED.push(position)
  return user
}

export const FREE_USER = (position: number) => {
  const index = RESERVED.indexOf(position)
  if (index !== -1) RESERVED.splice(index, 1)
}

export const GET_USER: ReserveUser = (position: number) => {
  const users = SITE.TEST_USERS
  if (users.length === 0) {
    throw new Error('No test users are specified. Put it into config "TEST_USERS".')
  }
  if (users.length <= position) {
    throw new Error(userNotFoundExceptionMessage(position, users.length))
  }
  return users[position]
}

export const DEFAULT_USER: User = {
  login: defaultLoginValue,
  password: defaultPasswordValue,
}
