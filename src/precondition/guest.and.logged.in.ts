import openHomepage from '@precondition/open.homepage'
import { PagesMap } from '@pages'
import login from '@precondition/login'

export interface FunctionWithBooleanParameter {
  (loggedInUser: boolean): void
}

/*
 * Executes all provided test for guest, then for logged in user.
 * Function should contain boolean parameter indicating whether user is
 * guest (false) or logged in (true).
 */
const checkWithLogin =
  (pages: PagesMap, ...fns: FunctionWithBooleanParameter[]) => {
    openHomepage(pages)
    fns.forEach(fn => fn(false))
    login(pages)
    fns.forEach(fn => fn(true))
  }

export default checkWithLogin
