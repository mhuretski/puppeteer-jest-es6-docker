import openHomepage from '@precondition/open.homepage'
import { PagesMap } from '@pages'
import { FunctionWithBooleanParameter, User } from '@interfaces'
import loggedIn from '@precondition/logged.in'

/*
 * Executes all provided test for guest, then for logged in user.
 * If user is undefined, default user will be chosen.
 * Function should contain boolean parameter indicating whether user is
 * guest (false) or logged in (true).
 */
const checkWithLogin = (pages: PagesMap, user: User | undefined | number, ...fns: FunctionWithBooleanParameter[]) => {
    openHomepage(pages)
    fns.forEach((fn) => fn(false))
    loggedIn(pages, user, ...fns)
}

export default checkWithLogin
