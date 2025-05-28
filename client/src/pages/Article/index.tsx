import { useNavigate, useParams } from 'react-router-dom';
import dateConverter from '../../utils/dateConverter';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Comments from '../../components/Comments';
import ArticleActions from './ArticleActions';
import { useGetStory } from '../../hooks/useFetchArticles';

const Article = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: newUserData } = useGetStory(`/user/current-user`);
  console.log('newUserData ', newUserData);
  const { data: story } = useGetStory(`/story/${slug}`);
  console.log('Story - -- - - - ', story);

  const { token } = useSelector((state: RootState) => state.userAuth);
  const isAuth = !!token;
  const article = story?.story;
  const isFollowing = article?.author?.following;
  const isFavorite = article?.favorited;
  const isSameUser = article?.author?.username === newUserData?.user?.username;

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article?.title}</h1>
          <ArticleActions
            isSameUser={isSameUser}
            article={article}
            dateConverter={dateConverter}
            isFollowing={isFollowing}
            unfollow={() => {}}
            follow={() => {}}
            isFavorite={isFavorite}
            unfavorite={() => {}}
            favorite={() => {}}
            navigate={navigate}
            isAuth={isAuth}
            deleteArticle={() => {}}
          />
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <p>{article?.description}</p>
          </div>
        </div>

        <ul className="tag-list">
          {article?.tagList &&
            article?.tagList.map((tag: string, i: number) => (
              <li
                key={`${tag} - ${i}`}
                className="tag-default tag-pill tag-outline ng-binding ng-scope"
              >
                {tag}
              </li>
            ))}
        </ul>

        <hr />

        <div className="article-actions">
          <ArticleActions
            isSameUser={isSameUser}
            article={article}
            dateConverter={dateConverter}
            isFollowing={isFollowing}
            unfollow={() => {}}
            follow={() => {}}
            isFavorite={isFavorite}
            unfavorite={() => {}}
            favorite={() => {}}
            navigate={navigate}
            isAuth={isAuth}
            deleteArticle={() => {}}
          />
        </div>

        <Comments slug={slug} isAuth={isAuth} user={newUserData?.user} />
      </div>
    </div>
  );
};

export default Article;
