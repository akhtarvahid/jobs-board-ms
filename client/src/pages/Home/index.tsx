import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import ArticlePreview from '../../components/ArticlePreview'
import useArticle from '../../hooks/useArticle'
import { useState } from 'react'
import ReactPaginate from 'react-paginate'
import { Link } from 'react-router-dom'

const Home = () => {
  const { token } = useSelector((state: RootState) => state.userAuth)
  const isAuth = !!token
  const [offset, setOffset] = useState(0)
  const [tag, setTag] = useState()
  const defaultActive = isAuth ? 'local' : 'global'
  const [active, setActive] = useState(defaultActive)
  const [currentPage, setCurrentPage] = useState(0)

  const {
    articles,
    isArticlesLoading,
    articlesLocal,
    isLocalArticlesLoading,
    tags,
    isTagsLoading
  } = useArticle({
    limit: 10,
    offset: offset,
    tag: tag,
    token: token
  })
  const articlesData =
    active === 'local' ? articlesLocal?.articles : articles?.articles
  const isLoading = isArticlesLoading || isLocalArticlesLoading
  const pageCount = Math.ceil(
    (active === 'local'
      ? articlesLocal?.articlesCount
      : articles?.articlesCount) / 10
  )
  const handlePageClick = (e: any) => {
    setOffset(e.selected * 10)
    setCurrentPage(e.selected)
  }

  const tabClick = (tag: any, tab: any) => {
    setOffset(0)
    setCurrentPage(0)
    setTag(tag)
    setActive(tab)
  }

  return (
    <div className='home-page'>
      {!isAuth && (
        <div className='banner'>
          <div className='container'>
            <h1 className='logo-font'>conduit</h1>
            <p>A place to share your knowledge.</p>
          </div>
        </div>
      )}

      <div className='container page'>
        <div className='row'>
          <div className='col-md-9'>
            <div className='feed-toggle'>
              <ul className='nav nav-pills outline-active'>
                {isAuth && (
                  <li className='nav-item'>
                    <Link
                      className={`nav-link ${
                        active === 'local' ? 'active' : ''
                      }`}
                      onClick={() => tabClick(undefined, 'local')}
                      to='/'
                    >
                      Your Feed
                    </Link>
                  </li>
                )}
                <li className='nav-item'>
                  <Link
                    className={`nav-link ${
                      active === 'global' ? 'active' : ''
                    }`}
                    onClick={() => tabClick(undefined, 'global')}
                    to='/'
                  >
                    Global Feed
                  </Link>
                </li>
                {tag && (
                  <li className='nav-item'>
                    <a className={`nav-link ${active === tag ? 'active' : ''}`}>
                      <i className='ion-pound'></i>
                      {tag}
                    </a>
                  </li>
                )}
              </ul>
              {isLoading && (
                <p style={{ marginTop: '2rem' }}>Loading articles...</p>
              )}
              {articlesData?.length === 0 && !isLoading && (
                <p style={{ marginTop: '2rem' }}>No articles here... yet.</p>
              )}
            </div>

            {articlesData &&
              articlesData.map((article: any) => (
                <ArticlePreview
                  {...article}
                  key={article?.slug}
                  isAuth={isAuth}
                />
              ))}
          </div>

          <div className='col-md-3'>
            <div className='sidebar'>
              <p>Popular Tags</p>

              {isTagsLoading && <p>Loading tags...</p>}

              <div className='tag-list'>
                {tags &&
                  tags.map((tagItem: any) => (
                    <p
                      className='tag-pill tag-default'
                      style={{ cursor: 'pointer' }}
                      onClick={() => tabClick(tagItem, tagItem)}
                    >
                      {tagItem}
                    </p>
                  ))}
              </div>
            </div>
          </div>

          {!isLoading && (
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
  )
}

export default Home
