import { Link, useNavigate } from 'react-router-dom'
import dateConverter from '../../utils/dateConverter'
import { useLikeStory } from '../../hooks/useFetchArticles'

const ArticlePreview = (props: any) => {
  const {
    author,
    modifiedAt,
    description,
    favoritesCount,
    slug,
    tagList,
    title,
    isAuth,
    favorited
  } = props
  const navigate = useNavigate()
  // const { favorite, unfavorite } = useArticle({ slug })

  
  const { data, likeStory } = useLikeStory(`/story/${slug}/like`);
  const likeStoryHandler = () => {
    console.log('liked')
    // handleFollowFunc(
    //           slug,
    //           favorited,
    //           unfavorite,
    //           favorite,
    //           navigate,
    //           isAuth
    //         )
            likeStory();
  }
  return (
    <div className='article-preview'>
      <div className='article-meta'>
        <Link to={`/${author?.username}`}>
          <img src={author?.image} />
          <div className='info'>
            <a href='' className='author'>
              {author?.username}
            </a>
            <span className='date'>{dateConverter(modifiedAt)}</span>
          </div>
        </Link>
        <button
          className='btn btn-outline-primary btn-sm pull-xs-right'
          onClick={likeStoryHandler}
        >
          <i className='ion-heart'></i> {favoritesCount}
        </button>
      </div>
      <Link to={`/article/${slug}`} className='preview-link'>
        <h1>{title}</h1>
        <p>{description}</p>
        <span>Read more...</span>
        <ul className='tag-list'>
          {tagList &&
            tagList.map((tag: string, i: number) => (
              <li  key={`${tag} - ${i}`} className='tag-default tag-pill tag-outline ng-binding ng-scope'>
                {tag}
              </li>
            ))}
        </ul>
      </Link>
    </div>
  )
}

export default ArticlePreview
