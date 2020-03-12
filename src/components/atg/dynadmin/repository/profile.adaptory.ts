import {
  defaultLoginValue as testEmail,
  DYN_ADMIN,
} from '@const/properties/constants'
import DynAdmin from '@components/atg/dynadmin/dynadmin.page'
import { UserHashed } from '@interfaces'
import { GET_USER } from '@const/global/users.reserve'

export default class ProfileAdapterRepository extends DynAdmin {
  _descriptors = {
    subscription: 'subscription',
    user: 'user',
  }

  async openThis() {
    await super.open(DYN_ADMIN.ProfileAdapterRepository)
  }

  async deleteTestSubscriptionIfExists() {
    const result = await this.getFooterSubscriptionId(
      this._descriptors.subscription)
    if (result) {
      await this.deleteItem(result, this._descriptors.subscription)
    }
    return true
  }

  async getFooterSubscriptionId(email = testEmail):
    Promise<string | undefined> {
    const searchedValue = `email="${email}"`
    return super.queryItemId(searchedValue, this._descriptors.subscription)
  }

  async updatePasswordForUser(user: UserHashed | number) {
    if (typeof user === 'number') {
      user = GET_USER(user)
    }
    if (user.hashed === undefined) {
      throw new Error(`Hashed properties are not defined for user "${user}".`)
    }
    const valuesToUpdate = new Map()
    valuesToUpdate.set('password', user.hashed.password)
    valuesToUpdate.set('passwordSalt', user.hashed.passwordSalt)
    await super.updateItem(this._descriptors.user, valuesToUpdate,
      undefined, user.login)
  }
}
