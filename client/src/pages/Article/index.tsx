import { useNavigate, useParams } from 'react-router-dom'
import useArticle from '../../hooks/useArticle'
import dateConverter from '../../utils/dateConverter'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import Comments from '../../components/Comments'
import useProfile from '../../hooks/useProfile'
import ArticleActions from './ArticleActions'

const Article = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { follow, unfollow, userData } = useProfile({ slug: slug })
  const {
    article: articleData,
    favorite,
    unfavorite,
    deleteArticle
  } = useArticle({ slug })
  const { token } = useSelector((state: RootState) => state.userAuth)
  const isAuth = !!token
  const article = articleData?.article
  const isFollowing = article?.author?.following
  const isFavorite = article?.favorited
  const isSameUser = article?.author?.username === userData?.user?.username

  return (
    <div className='article-page'>
      <div className='banner'>
        <div className='container'>
          <h1>{article?.title}</h1>

          <ArticleActions
            isSameUser={isSameUser}
            article={article}
            dateConverter={dateConverter}
            isFollowing={isFollowing}
            unfollow={unfollow}
            follow={follow}
            isFavorite={isFavorite}
            unfavorite={unfavorite}
            favorite={favorite}
            navigate={navigate}
            isAuth={isAuth}
            deleteArticle={deleteArticle}
          />
        </div>
      </div>

      <div className='container page'>
        <div className='row article-content'>
          <div className='col-md-12'>
            <p>{article?.description}</p>
          </div>
        </div>

        <ul className='tag-list'>
          {article?.tagList &&
            article?.tagList.map((tag: string) => (
              <li className='tag-default tag-pill tag-outline ng-binding ng-scope'>
                {tag}
              </li>
            ))}
        </ul>

        <hr />

        <div className='article-actions'>
          <ArticleActions
            isSameUser={isSameUser}
            article={article}
            dateConverter={dateConverter}
            isFollowing={isFollowing}
            unfollow={unfollow}
            follow={follow}
            isFavorite={isFavorite}
            unfavorite={unfavorite}
            favorite={favorite}
            navigate={navigate}
            isAuth={isAuth}
            deleteArticle={deleteArticle}
          />
        </div>

        <Comments slug={slug} isAuth={isAuth} />
      </div>
    </div>
  )
}

export default Article
