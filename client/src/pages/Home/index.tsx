import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import ArticlePreview from '../../components/ArticlePreview';
import { useGetStory } from '../../hooks/useFetchArticles';
import { handleFetchAllStory, handleFetchStoriesFeed } from '../../store/story/storySlice';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const { token } = useSelector((state: RootState) => state.userAuth);
  const isLoggedIn = !!token;
  const dispatch = useAppDispatch();

  const { feedStories, allStories } = useSelector(
    (state: RootState) => state.storyState,
  );

  const [tag, setTag] = useState();
  const defaultActive = isLoggedIn ? 'local' : 'global';
  const [active, setActive] = useState(defaultActive);

  const { data: newTags, loading: tagsLoading } = useGetStory('/tag');

  useEffect(() => {
    dispatch(handleFetchStoriesFeed());
    dispatch(handleFetchAllStory());
  }, []);

  const storiesData =
    active === 'local' ? feedStories?.stories : allStories?.stories;

  const isLoading = feedStories.status === 'loading';

  const tabClick = (tag: any, tab: any) => {
    setTag(tag);
    setActive(tab);
  };

  return (
    <div className="home-page">
      {!isLoggedIn && (
        <div className="banner">
          <div className="container">
            <h1 className="logo-font">WYS</h1>
            <p>A place to share your story.</p>
          </div>
        </div>
      )}

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <div className="feed-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      active === 'global' ? 'active' : ''
                    }`}
                    onClick={() => tabClick(undefined, 'global')}
                    to="/"
                  >
                    Global Feed
                  </Link>
                </li>
                {isLoggedIn && (
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${
                        active === 'local' ? 'active' : ''
                      }`}
                      onClick={() => tabClick(undefined, 'local')}
                      to="/"
                    >
                      Your Feed
                    </Link>
                  </li>
                )}
                {tag && (
                  <li className="nav-item">
                    <a className={`nav-link ${active === tag ? 'active' : ''}`}>
                      <i className="ion-pound"></i>
                      {tag}
                    </a>
                  </li>
                )}
              </ul>
              {isLoading && (
                <p style={{ marginTop: '2rem' }}>Loading articles...</p>
              )}
              {storiesData?.length === 0 && !isLoading && (
                <p style={{ marginTop: '2rem' }}>No articles here... yet.</p>
              )}
            </div>

            {storiesData &&
              storiesData.map((article: any, i: number) => (
                <ArticlePreview
                  {...article}
                  key={`${article?.slug}-${i}`}
                  isAuth={isLoggedIn}
                />
              ))}
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>

              {tagsLoading && <p>Loading tags...</p>}

              <div className="tag-list">
                {newTags &&
                  newTags.tags.map((tagItem: any, i: number) => (
                    <p
                      key={`${tagItem.id} - ${i}`}
                      className="tag-pill tag-default"
                      style={{ cursor: 'pointer' }}
                      onClick={() => tabClick(tagItem, tagItem)}
                    >
                      {tagItem}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
