'use strict'
import AbstractContentObject from '@classes/util/abstract.content.object'

const selectors = {
  banner: '#oneColumnArticleLead',
  breadcrumbs: '#oneColumnArticleBreadcrumbs',
}

export default class ArticleOneColumnPage extends AbstractContentObject {
  static getSelectors = () => selectors;
}
