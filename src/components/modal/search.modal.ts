'use strict'
import AbstractContentObject
  from '@classes/util/abstract.content.object'
import { defaultAnimationWaitTimer, defaultWaitTimer } from '@const/global/timers'

const container = '#searchResultsModal'

const selectors = {
  container: container,
  state: '#searchChangeState',
  item: `${container} li`,
  searchInput: '#headerSearchInput',
}

export default class SearchModal extends AbstractContentObject {
  static getSelectors = () => selectors;

  async forceFocusState(text: string, timeout = defaultWaitTimer) {
    await super.setValueToInput(selectors.searchInput, text, timeout)
    await super.waitFor(selectors.state, timeout)
    await this._page.evaluate((selector) => {
      document.querySelector(selector).className += ' open focus'
    }, selectors.state)
  }

  async countItems() {
    await super.waitForAnimation()
    await super.waitFor(selectors.container)
    return super.countElements(selectors.item)
  }

  async clickOnItem(position = 0, timeout = defaultAnimationWaitTimer) {
    await super.clickOnPuppeteer(selectors.item, position)
    await super.waitToBeInvisible(selectors.container, timeout)
    await super.waitForAnimation()
  }

  async waitThisToBeInvisible(timeout = defaultAnimationWaitTimer) {
    await super.waitToBeInvisible(selectors.container, timeout)
    await super.waitForAnimation()
  }

  async waitThisToBeVisible(timeout = defaultAnimationWaitTimer) {
    await super.waitToBeVisible(selectors.container, timeout)
    await super.waitForAnimation()
  }
}
