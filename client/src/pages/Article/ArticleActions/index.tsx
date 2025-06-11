import { Link } from 'react-router-dom';
import handleFollowFunc from '../../../utils/handleFollowFunc';

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
  deleteArticle,
  isDeleted,
}: any) => {
  const handleDelete = async (slugData: any) => {
    if (slugData) {
      try {
        // TODO: Delete api call
        deleteArticle(slugData);
        if (!isDeleted) {
          navigate('/');
        }
      } catch (error) {
        console.log('Error deleting article:', error);
      }
    }
  };

  return (
    <div className="article-meta">
      <Link to={`/${article?.owner?.username}`}>
        <img src={article?.owner?.image} style={{ border: '16px solid' }} />
      </Link>
      <div className="info">
        <Link to={`/${article?.owner?.username}`} className="author">
          {article?.owner?.username}
        </Link>
        <span className="date">{dateConverter(article?.modifiedAt)}</span>
      </div>
      {isSameUser ? (
        <>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() =>
              navigate(`/editor/${article?.slug}`, { state: { article } })
            }
          >
            <i className="ion-edit"></i>
            &nbsp; Edit Article
          </button>
          &nbsp;
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => handleDelete(article?.slug)}
            disabled={isDeleted}
          >
            {isDeleted ? 'Deleting...' : 'Delete Article'}
          </button>
        </>
      ) : (
        <>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() =>
              handleFollowFunc(
                article?.author?.username,
                isFollowing,
                unfollow,
                follow,
                navigate,
                isAuth,
              )
            }
          >
            <i className="ion-plus-round"></i>
            &nbsp; {isFollowing ? 'Unfollow' : 'Follow'}{' '}
            {article?.author?.username}
          </button>
          &nbsp;
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() =>
              handleFollowFunc(
                article?.slug,
                isFavorite,
                unfavorite,
                favorite,
                navigate,
                isAuth,
              )
            }
          >
            <i className="ion-heart"></i>
            &nbsp; {isFavorite ? 'Unfavorite' : 'Favorite'} Article{' '}
            <span className="counter">{article?.favoritesCount}</span>
          </button>
        </>
      )}
    </div>
  );
};

export default ArticleActions;
