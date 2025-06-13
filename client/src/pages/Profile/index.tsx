import { Link, NavLink, useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import ReactPaginate from 'react-paginate';
import ArticlePreview from '../../components/ArticlePreview';
import {
  getProfile,
  userCreatedStories,
  userFavoritedStories,
} from '../../store/profile/profileSlice';
import { getUser } from '../../store/user/userAuthSlice';

const Profile = () => {
  const dispatch = useAppDispatch();
  const {
    profileData: { profile, isLoading: isProfileLoading },
    favoritedData: {
      stories: favoritedStories,
      isLoading: isFavoritedStoriesLoading,
      storiesCount: favoritedStoriesCount,
    },
    UserData: { stories, isLoading: isUserStoriesLoading, storiesCount },
  } = useSelector((state: RootState) => state.profileState);
  const { username } = useParams();
  const { pathname } = useLocation();
  const tabPath = pathname?.split('/')?.[2];

  const { token, currentUser } = useSelector(
    (state: RootState) => state.userAuth,
  );
  const isAuth = !!token;
  const [currentPage, setCurrentPage] = useState(0);
  useEffect(() => {
    dispatch(getProfile({ username: username }));
    dispatch(getUser());
    if (tabPath === 'favorites') {
      dispatch(
        userFavoritedStories({
          username: username,
        }),
      );
    } else {
      dispatch(
        userCreatedStories({
          username: username,
        }),
      );
    }
  }, [username, tabPath]);

  const isLoading =
    isUserStoriesLoading || isProfileLoading || isFavoritedStoriesLoading;
  const count =
    (tabPath === 'favorites' ? favoritedStoriesCount : storiesCount) || 0;
  const pageCount = Math.ceil((count || 0) / 10);
  const articlesData = tabPath === 'favorites' ? favoritedStories : stories;
  const isFollowing = profile?.following;
  const isSameUser = currentUser?.user?.username === profile?.username;

  const handlePageClick = (e: any) => {
    setCurrentPage(e.selected);
  };

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img
                src={profile?.image}
                className="user-img"
                style={{ background: '#5CB85C' }}
              />
              <h4>{profile?.username}</h4>
              <p>{profile?.bio}</p>
              {isSameUser ? (
                <Link
                  className="btn btn-sm btn-outline-secondary action-btn"
                  to="/settings"
                >
                  <i className="ion-gear-a"></i> Edit Profile Settings
                </Link>
              ) : (
                <button
                  className="btn btn-sm btn-outline-secondary action-btn"
                  // onClick={() =>
                  //   handleFollowFunc(
                  //     profile?.username,
                  //     isFollowing,
                  //     unfollow,
                  //     follow,
                  //     navigate,
                  //     isAuth,
                  //   )
                  // }
                >
                  <i className="ion-plus-round"></i>
                  &nbsp; {isFollowing ? 'Unfollow' : 'Follow'}{' '}
                  {profile?.username}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <NavLink className="nav-link" end to={`/${username}`}>
                    My Articles
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to={`/${username}/favorites`}>
                    Favorited Articles
                  </NavLink>
                </li>
              </ul>
            </div>

            {isLoading && (
              <p style={{ marginTop: '2rem' }}>Loading articles...</p>
            )}
            {articlesData?.length === 0 && !isLoading && (
              <p style={{ marginTop: '2rem' }}>No articles here... yet.</p>
            )}

            {articlesData &&
              profile &&
              articlesData.map((article: any) => (
                <ArticlePreview
                  {...article}
                  key={article?.slug}
                  isAuth={isAuth}
                />
              ))}

            {!isLoading && (
              <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination justify-content-center"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                activeClassName="active"
                forcePage={currentPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
