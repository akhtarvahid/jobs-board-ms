import { useNavigate, useParams } from 'react-router-dom';
import dateConverter from '../../utils/dateConverter';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import Comments from '../../components/Comments';
import ArticleActions from './ArticleActions';
import { useGetStory } from '../../hooks/useFetchArticles';
import { useCallback } from 'react';
import { deleteStory } from '../../store/story/storySlice';

const Article = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { allStories } = useSelector((state: RootState) => state.storyState);

  const { data: newUserData } = useGetStory(`/user/current-user`);
  const { data: story } = useGetStory(`/story/${slug}`);

  const { token } = useSelector((state: RootState) => state.userAuth);
  const isAuth = !!token;
  const article = story?.story;
  const isFollowing = article?.owner?.following;
  const isFavorite = article?.favorited;
  const isSameUser = article?.owner?.username === newUserData?.user?.username;

  const handleDeleteStory = useCallback(async (slug: string) => {
    dispatch(deleteStory(slug));
  }, []);

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
            deleteArticle={handleDeleteStory}
            isDeleted={allStories.status === 'loading'}
          />
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <p>{article?.body}</p>
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
            deleteArticle={handleDeleteStory}
            isDeleted={allStories.status === 'loading'}
          />
        </div>

        <Comments
          slug={story?.story?.slug}
          isAuth={isAuth}
          user={newUserData?.user}
        />
      </div>
    </div>
  );
};

export default Article;
