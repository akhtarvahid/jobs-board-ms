import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom'
import useProfile from '../../hooks/useProfile'
import useArticle from '../../hooks/useArticle'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import ReactPaginate from 'react-paginate'
import ArticlePreview from '../../components/ArticlePreview'
import handleFollowFunc from '../../utils/handleFollowFunc'

const Profile = () => {
  const { username } = useParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { token } = useSelector((state: RootState) => state.userAuth)
  const isAuth = !!token
  const [offset, setOffset] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const isFavorite = pathname.includes(`/favorites`)
  const {
    profile: profileData,
    isProfileLoading,
    follow,
    unfollow,
    userData
  } = useProfile({ username: username })
  const profile = profileData?.profile
  const { articles, isArticlesLoading } = useArticle({
    limit: 10,
    offset: offset,
    author: isFavorite ? null : profile?.username,
    favorited: isFavorite ? profile?.username : null,
    token: token
  })
  const isLoading = isArticlesLoading
  const pageCount = Math.ceil(articles?.articlesCount / 10)
  const articlesData = articles?.articles
  const isFollowing = profile?.following
  const isSameUser = userData?.user?.username === profile?.username

  const handlePageClick = (e: any) => {
    setOffset(e.selected * 10)
    setCurrentPage(e.selected)
  }
  console.log('isFavorite: ', userData)

  return (
    <div className='profile-page'>
      <div className='user-info'>
        <div className='container'>
          <div className='row'>
            <div className='col-xs-12 col-md-10 offset-md-1'>
              <img src={profile?.image} className='user-img' />
              <h4>{profile?.username}</h4>
              <p>{profile?.bio}</p>
              {isSameUser ? (
                <Link
                  className='btn btn-sm btn-outline-secondary action-btn'
                  to='/settings'
                >
                  <i className='ion-gear-a'></i> Edit Profile Settings
                </Link>
              ) : (
                <button
                  className='btn btn-sm btn-outline-secondary action-btn'
                  onClick={() =>
                    handleFollowFunc(
                      profile?.username,
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
                  {profile?.username}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='container'>
        <div className='row'>
          <div className='col-xs-12 col-md-10 offset-md-1'>
            <div className='articles-toggle'>
              <ul className='nav nav-pills outline-active'>
                <li className='nav-item'>
                  <NavLink className='nav-link' end to={`/${username}`}>
                    My Articles
                  </NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink className='nav-link' to={`/${username}/favorites`}>
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

            {!isLoading && !isProfileLoading && (
              <ReactPaginate
                breakLabel='...'
                nextLabel='next >'
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel='< previous'
                renderOnZeroPageCount={null}
                breakClassName='page-item'
                breakLinkClassName='page-link'
                containerClassName='pagination justify-content-center'
                pageClassName='page-item'
                pageLinkClassName='page-link'
                previousClassName='page-item'
                previousLinkClassName='page-link'
                nextClassName='page-item'
                nextLinkClassName='page-link'
                activeClassName='active'
                forcePage={currentPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
