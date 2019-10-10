import { PagesMap } from '@pages'
import { FunctionWithBooleanParameter, User } from '@interfaces'
import { FREE_USER, RESERVE_USER } from '@const/global/users.reserve'
import login from '@precondition/login'

/*
 * Executes all provided test only for logged in user.
 * If user is undefined, default user will be chosen.
 * Function should contain boolean parameter indicating whether user is
 * guest (false) or logged in (true).
 */
const loggedIn =
  (pages: PagesMap, user: User | undefined | number,
          ...fns: FunctionWithBooleanParameter[]) => {
    let position
    try {
      if (typeof user === 'number') {
        position = user
        user = RESERVE_USER(user)
      }
      login(pages, user)
      fns.forEach(fn => fn(true))
    } finally {
      if (position !== undefined) {
        FREE_USER(position)
      }
    }
  }

export default loggedIn
