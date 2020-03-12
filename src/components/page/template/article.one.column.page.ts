import Rest from '@classes/util/rest'

const selectors = {
  banner: '#oneColumnArticleLead',
  breadcrumbs: '#oneColumnArticleBreadcrumbs',
}

export default class ArticleOneColumnPage extends Rest {
  static getSelectors = () => selectors
}
