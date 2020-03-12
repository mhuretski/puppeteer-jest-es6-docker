import Rest from '@classes/util/rest'

const selectors = {
  banner: '#searchLead',
  breadcrumbs: '#siteMapBreadcrumbs',
  inputFieldLabelPassNew1: '#inputFieldLabelPassNew1',
  inputFieldLabelPassNew2: '#inputFieldLabelPassNew2',
}

export default class SiteMapPage extends Rest {
  static getSelectors = () => selectors
}
