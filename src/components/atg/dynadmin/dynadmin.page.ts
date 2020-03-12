import Helper from '@classes/util/helper'
import { DYN_ADMIN } from '@const/properties/constants'

const selectors = {
  logo: '#oracleATGbrand',
  inputField: '[name="xmltext"]',
  submitButton: '[value="Enter"]',
  results: 'pre code',
}

export default class DynAdmin extends Helper {
  static getSelectors = () => selectors

  async open(path = DYN_ADMIN.PROD_SCHEME_URL) {
    const auth = Buffer
      .from(`${DYN_ADMIN.username}:${DYN_ADMIN.password}`)
      .toString('base64')
    await this._page.setExtraHTTPHeaders({
      'Authorization': `Basic ${auth}`,
    })
    await this._page.goto(path)
    await super.waitFor(selectors.logo)
  }

  async queryItemId(searchedValue: string, descriptor: string, idOnly = true)
    : Promise<string | undefined> {
    await this.searchInRepository(
      DYN_ADMIN.queryItems(searchedValue, descriptor, idOnly))

    try {
      return await super.getText(selectors.results)
        .then(res =>
          (res) ?
            res.split('\n').filter(e => e.length > 0) :
            null,
        ).then(res => {
          if (res) {
            for (let i = 0; i < res.length; i++) {
              if (res[i].includes('returns ') && res[i].includes(' items')) {
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

  async getPrintItemsXML(id: string, descriptor: string)
    : Promise<XMLDocument | undefined> {
    await this.searchInRepository(
      DYN_ADMIN.printItem(id, descriptor))

    return super.getText(selectors.results)
      .then((res: string | null) => (res) ?
        res.split('\n')
          .filter(e => e.length > 0)
          .filter(e => !e.includes('------'))
          .join() :
        null)
      .then((res: string | null) => {
        if (res) {
          const parser = new DOMParser()
          return parser.parseFromString(res, 'text/xml')
        } else {
          throw new Error(`Error occurred while getting object by id "${id}"`)
        }
      })
  }

  async deleteItem(id: string, descriptor: string) {
    await this.searchInRepository(
      DYN_ADMIN.removeItem(id, descriptor))

    const isDeleted = await super.getText(selectors.results)
      .then(res => (res) ? res.length === 2 : false)
    if (!isDeleted) {
      throw new Error(`"${id}" is not deleted`)
    }
  }

  async updateItem(descriptor: string, valuesToUpdate: Map<string, string>,
          id?: string, login?: string) {
    if (!id && !login) {
      throw new Error('ID or login should be specified.')
    } else if (login) {
      id = await this.queryItemId(`login="${login}"`, descriptor)
    }

    if (id) {
      await this.searchInRepository(
        DYN_ADMIN.updateItem(id, descriptor, valuesToUpdate))
    } else {
      throw new Error(`Couldn't get id. Current value is "${id}".`)
    }

    const isUpdated = await super.getText(selectors.results)
    const result = isUpdated.split(':')
    if (result.length !== 2 || !result[0].includes('updating') || !result[1].includes(id)) {
      throw new Error(`Illegal response updating id "${id}": ${isUpdated}.`)
    }
  }

  async searchInRepository(text: string) {
    await super.setValue(selectors.inputField, text)
    await super.clickInBrowser(selectors.submitButton)
  }
}
