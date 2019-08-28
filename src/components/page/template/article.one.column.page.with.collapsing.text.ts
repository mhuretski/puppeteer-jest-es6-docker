'use strict'
import AbstractContentObject from '@classes/util/abstract.content.object'

const selectors = {
  breadcrumbs: '#articleOneColumnPageWithCollapsingTextBreadcrumbs',
}

export default class ArticleOneColumnPageWithCollapsingText
  extends AbstractContentObject {
  static getSelectors = () => selectors;
}
