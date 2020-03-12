import Rest from '@classes/util/rest'

const selectors = {
  breadcrumbs: '#articleOneColumnPageWithCollapsingTextBreadcrumbs',
}

export default class ArticleOneColumnPageWithCollapsingText
  extends Rest {
  static getSelectors = () => selectors
}
