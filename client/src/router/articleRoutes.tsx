import Article from '../pages/Article'
import CreateArticle from '../pages/Article/CreateArticle'

const articleRoutes = [
  {
    path: 'editor',
    element: <CreateArticle />,
    children: [
      {
        path: ':slug',
        element: <CreateArticle />
      }
    ]
  },
  {
    path: 'article/:slug',
    element: <Article />
  }
]

export default articleRoutes
