'use strict'
import AbstractContentObject
  from '@classes/util/abstract.content.object'
import {
  defaultLoginValue as testEmail,
  DYN_ADMIN,
} from '@const/properties/constants'

const selectors = {
  inputField: '[name="xmltext"]',
  submitButton: '[value="Enter"]',
  results: 'pre code',
}

export default class DynAdmin extends AbstractContentObject {
  static getSelectors = () => selectors;

  async open(path = DYN_ADMIN.PROD_SCHEME_URL) {
    const auth = Buffer
      .from(`${DYN_ADMIN.username}:${DYN_ADMIN.password}`)
      .toString('base64')
    await this._page.setExtraHTTPHeaders({
      'Authorization': `Basic ${auth}`,
    })
    await this._page.goto(path)
  }

  async deleteTestSubscriptionIfExists() {
    const descriptor = 'subscription'
    const result = await this.getFooterSubscriptionId(descriptor)
    if (result) {
      await this.deleteItemById(result, descriptor)
    }
    return true
  }

  async getFooterSubscriptionId(descriptor = 'subscription'): Promise<string | undefined> {
    await this.open(DYN_ADMIN.ProfileAdapterRepository)
    const searchedValue = `email="${testEmail}"`
    return this.getItemId(searchedValue, descriptor)
  }

  async getItemId(searchedValue: string, descriptor: string, idOnly = true)
    : Promise<string | undefined> {
    await super.setValueToInput(selectors.inputField,
      DYN_ADMIN.queryItems(searchedValue, descriptor, idOnly))
    await super.click(selectors.submitButton)
    try {
      return await super.getText(selectors.results)
        .then(res =>
          (res)
            ? res.split('\n').filter(e => e.length > 0)
            : null
        ).then(res => {
          if (res) {
            for (let i = 0; i < res.length; i++) {
              if (res[i].toString().includes('returns 1 items')) {
                return res[++i]
              }
            }
          }
        })
        .catch(e => e)
    } catch (e) {
      console.log('Some error occurred trying to get item id')
    }
  }

  async deleteItemById(id: string, descriptor: string) {
    await super.setValueToInput(selectors.inputField,
      DYN_ADMIN.removeItem(id, descriptor))
    await super.click(selectors.submitButton)
    const isDeleted = await super.getText(selectors.results)
      .then(res => (res) ? res.length === 2 : false)
    if (!isDeleted) {
      throw new Error(`"${id}" is not deleted`)
    }
  }

  async searchInRepository(text: string) {
    await super.setValueToInput(selectors.inputField, text)
    await super.click(selectors.submitButton)
  }
}
