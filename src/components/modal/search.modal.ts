import { defaultAnimationWaitTimer, defaultWaitTimer } from '@const/global/timers'
import Rest from '@classes/util/rest'

const container = '#searchResultsModal'

const selectors = {
  container: container,
  state: '#searchChangeState',
  typeahead: '#typeahead',
  item: `${container} li`,
  searchInput: '#headerSearchInput',
}

export default class SearchModal extends Rest {
  static getSelectors = () => selectors

  async listenIsOpened() {
    await this._page.evaluate((selector, typeaheadStatusSelector) => {
      let typeaheadStatus = document.querySelector(typeaheadStatusSelector)
      if (!typeaheadStatus) {
        typeaheadStatus = document.createElement('div')
        typeaheadStatus.id = 'typeahead'
        const body = document.querySelector('body')
        if (body) body.appendChild(typeaheadStatus)
        const elem = document.querySelector(selector)
        if (elem) {
          let lastClassName = elem.className
          window.setInterval(function() {
            const className = elem.className
            if (typeaheadStatus && lastClassName !== className) {
              lastClassName = className
              if (className.includes('open') && className.includes('focus')) {
                typeaheadStatus.className = 'open'
              } else {
                typeaheadStatus.className = 'closed'
              }
            }
          }, 10)
        }
      }
    }, selectors.state, selectors.typeahead)
  }

  async forceFocusState(text: string, timeout = defaultWaitTimer) {
    await super.setValue(selectors.searchInput, text, timeout)
    await super.waitFor(selectors.state, timeout)
    await this._page.evaluate((selector) => {
      document.querySelector(selector).className += ' open focus'
    }, selectors.state)
    await super.waitForAnimation()
  }

  async countItems() {
    await super.waitForAnimation()
    try {
      await super.waitFor(selectors.container)
      return super.countElementsInBrowser(selectors.item)
    } catch (e) {
      return 0
    }
  }

  async clickOnItem(position = 0, timeout = defaultAnimationWaitTimer) {
    await super.clickOn(selectors.item, position)
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
