import { Link } from 'react-router-dom'
import handleFollowFunc from '../../../utils/handleFollowFunc'

const ArticleActions = ({
  article,
  dateConverter,
  isFollowing,
  unfollow,
  follow,
  isFavorite,
  unfavorite,
  favorite,
  navigate,
  isAuth,
  isSameUser,
  deleteArticle
}: any) => {
  const handleDelete = async (slugData: any) => {
    if (slugData) {
      try {
        await deleteArticle.mutateAsync(slugData)
        navigate('/')
      } catch (error) {
        console.log('Error deleting article:', error)
      }
    }
  }

  return (
    <div className='article-meta'>
      <Link to={`/${article?.author?.username}`}>
        <img src={article?.author?.image} />
      </Link>
      <div className='info'>
        <Link to={`/${article?.author?.username}`} className='author'>
          {article?.author?.username}
        </Link>
        <span className='date'>{dateConverter(article?.updatedAt)}</span>
      </div>
      {isSameUser ? (
        <>
          <button
            className='btn btn-sm btn-outline-secondary'
            onClick={() => navigate(`/editor/${article?.slug}`)}
          >
            <i className='ion-edit'></i>
            &nbsp; Edit Article
          </button>
          &nbsp;
          <button
            className='btn btn-outline-danger btn-sm'
            onClick={() => handleDelete(article?.slug)}
            disabled={deleteArticle?.isLoading}
          >
            <i className='ion-trash-a'></i>
            &nbsp; {deleteArticle?.isLoading ? 'Deleting...' : 'Delete Article'}
          </button>
        </>
      ) : (
        <>
          <button
            className='btn btn-sm btn-outline-secondary'
            onClick={() =>
              handleFollowFunc(
                article?.author?.username,
                isFollowing,
                unfollow,
                follow,
                navigate,
                isAuth
              )
            }
          >
            <i className='ion-plus-round'></i>
            &nbsp; {isFollowing ? 'Unfollow' : 'Follow'}{' '}
            {article?.author?.username}
          </button>
          &nbsp;
          <button
            className='btn btn-sm btn-outline-primary'
            onClick={() =>
              handleFollowFunc(
                article?.slug,
                isFavorite,
                unfavorite,
                favorite,
                navigate,
                isAuth
              )
            }
          >
            <i className='ion-heart'></i>
            &nbsp; {isFavorite ? 'Unfavorite' : 'Favorite'} Article{' '}
            <span className='counter'>{article?.favoritesCount}</span>
          </button>
        </>
      )}
    </div>
  )
}

export default ArticleActions
