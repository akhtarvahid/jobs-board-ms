import { Link } from 'react-router-dom';
import dateConverter from '../../utils/dateConverter';
import { useLikeStory } from '../../hooks/useFetchArticles';
import { avatar } from '../../utils/constant';

const ArticlePreview = (props: any) => {
  const { owner, modifiedAt, body, favoritesCount, slug, tagList, title } =
    props;

  const { likeStory } = useLikeStory(`/story/${slug}/like`);
  const likeStoryHandler = () => {
    likeStory();
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
        <button
          className="btn btn-outline-primary btn-sm pull-xs-right"
          onClick={likeStoryHandler}
        >
          <i className="ion-heart"></i> {favoritesCount}
        </button>
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
