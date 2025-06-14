import { Link } from 'react-router-dom';
import dateConverter from '../../utils/dateConverter';
import { avatar } from '../../utils/constant';
import { useAppDispatch } from '../../store';
import {
  handleDislikeStory,
  handleLikeStory,
} from '../../store/story/storySlice';

const ArticlePreview = (props: any) => {
  const dispatch = useAppDispatch();
  const {
    owner,
    modifiedAt,
    body,
    favoritesCount,
    slug,
    tagList,
    title,
    favorited,
  } = props;

  const likeStoryHandler = () => {
    dispatch(handleLikeStory({ slug: slug }));
  };
  const dislikeStoryHandler = () => {
    dispatch(handleDislikeStory({ slug: slug }));
  };

  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link to={`/${owner?.username}`}>
          <img src={owner?.image || avatar} />
          <div className="info">
            <span className="author">{owner?.username}</span>
            <span className="date">{dateConverter(modifiedAt)}</span>
          </div>
        </Link>
        <span className="btn-outline-primary btn-sm pull-xs-right">
          <i className="ion-heart"></i> {favoritesCount}
        </span>
        <button
          className="btn btn-outline-primary btn-sm pull-xs-right"
          onClick={dislikeStoryHandler}
        >
          Dislike
        </button>
        {/* ADD condition to discard like/dislike button in profile "my article" tab*/}
        <>
          {!favorited && (
            <button
              className="btn btn-outline-primary btn-sm pull-xs-right"
              onClick={likeStoryHandler}
            >
              Like
            </button>
          )}
        </>
      </div>
      <Link to={`/article/${props.id}`} className="preview-link">
        <h1>{title}</h1>
        <p>{body}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {tagList &&
            tagList?.map((tag: string, i: number) => (
              <li
                key={`${tag} - ${i}`}
                className="tag-default tag-pill tag-outline ng-binding ng-scope"
              >
                {tag}
              </li>
            ))}
        </ul>
      </Link>
    </div>
  );
};

export default ArticlePreview;
