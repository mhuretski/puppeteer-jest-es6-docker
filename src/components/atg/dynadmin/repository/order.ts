import DynAdmin from '@components/atg/dynadmin/dynadmin.page'

export default class OrderRepository extends DynAdmin {
  _descriptor = 'order'

  async getOrderElementByName(id: string, elementName: string):
      Promise<NodeList | undefined> {
    const elem: XMLDocument | undefined =
      await super.getPrintItemsXML(id, this._descriptor)
    if (elem) return elem.getElementsByName(elementName)
  }

  async getOrderStatus(id: string) {
    const res = await this.getOrderElementByName(id, 'state')
    if (res && res.length > 0) {
      return res[0].textContent
    }
  }
}
