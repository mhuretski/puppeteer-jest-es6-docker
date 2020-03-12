import { defaultLoginValue as testEmail } from '@const/properties/constants'
import Rest from '@classes/util/rest'

const selectors = {
  container: '#footerContainerId',
  links: '#footerLinks a',
  logo: '#footerLogo',
  linksContainer: '#footerLinks',
  socials: '#footerSocials',
  Ytb: '#footYtb',
  FB: '#footFB',
  Tw: '#footTw',
  Inst: '#footInst',
  VK: '#footVK',
  subscribeContainer: '#footerSubscribeCont',
  subscribeButton: '#footerSubscribeBtn',
  emailInputField: '#inputFieldLabel',
  footerSubscriptionStateMessage: '#footerSubscriptionStateMessage',
}

export default class Footer extends Rest {
  static getSelectors = () => selectors

  async typeTestEmail() {
    await super.type(selectors.emailInputField, testEmail)
  }

  async subscribe() {
    await super.click(selectors.subscribeButton)
  }

  async clickOnLink(position = 0) {
    await super.clickOn(selectors.links, position)
  }
}
