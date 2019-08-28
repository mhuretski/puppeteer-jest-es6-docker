'use strict'
import AbstractContentObject from '@classes/util/abstract.content.object'

const selectors = {
  banner: '#searchLead',
  breadcrumbs: '#siteMapBreadcrumbs',
  inputFieldLabelPassNew1: '#inputFieldLabelPassNew1',
  inputFieldLabelPassNew2: '#inputFieldLabelPassNew2',
}

export default class SiteMapPage extends AbstractContentObject {
  static getSelectors = () => selectors;
}
