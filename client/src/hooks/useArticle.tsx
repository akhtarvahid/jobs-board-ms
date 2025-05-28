import request from '../utils/request'
import { useMutation, useQuery, useQueryClient } from 'react-query'

type GlobalParamsType = {
  tag?: string
  author?: string
  favorited?: string
  offset?: number
  limit?: number
  slug?: string | null
  token?: string | null
}

type ParamsType = {
  tag?: string
  author?: string
  favorited?: string
  offset?: number
  limit?: number
}

type LocalParamsType = {
  offset?: number
  limit?: number
}

type ArtilceType = {
  article: {
    title: string
    description: string
    body: string
    tagList?: [string]
  }
}

const getArticles = (params: ParamsType) =>
  request
    .get('/story/all', {
      params
    })
    .then((res) => res.data)
    .catch((err) => console.error('getArticlesErr: ', err))

const getLocalArticles = (params: LocalParamsType) =>
  request
    .get('/articles/feed', {
      params
    })
    .then((res) => res.data)
    .catch((err) => console.error('getLocalArticlesErr: ', err))

const getArticle = (slug: any) =>
  request
    .get(`/articles/${slug}`)
    .then((res) => res.data)
    .catch((err) => console.error('getArticleErr: ', err))

const getTags = () =>
  request
    .get('/tag')
    .then((res) => res.data?.tags)
    .catch((err) => {
      console.error('getTagsErr: ', err)
      throw err
    })

const favoriteArticle = (slug: string) =>
  request
    .post(`/articles/${slug}/favorite`)
    .then((res) => res.data)
    .catch((err) => {
      console.error('favoriteArticle Err: ', err)
      throw err
    })

const unfavoriteArticle = (slug: string) =>
  request
    .delete(`/articles/${slug}/favorite`)
    .then((res) => res.data)
    .catch((err) => {
      console.error('favoriteArticle Err: ', err)
      throw err
    })

const publishArticle = (data: ArtilceType) =>
  request
    .post('/articles', data)
    .then((res) => res.data)
    .catch((err) => {
      console.error('publishArticle Err: ', err)
      throw err
    })

const deleteArticle = (slug: string) =>
  request
    .delete(`/articles/${slug}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error('deleteArticle Err: ', err)
      throw err
    })

const useArticle = ({
  tag,
  author,
  favorited,
  offset,
  limit,
  slug,
  token
}: GlobalParamsType) => {
  const queryClient = useQueryClient()

  const updateArticle = (data: ArtilceType) =>
    request
      .put(`/articles/${slug}`, data)
      .then((res) => res.data)
      .catch((err) => {
        console.error('updateArticleErr: ', err)
        throw err
      })

  const {
    isLoading: isArticlesLoading,
    isError: isArticlesError,
    data: articles,
    error: articlesError
  } = useQuery(
    ['get-articles', { tag, author, favorited, offset, limit }],
    () => getArticles({ tag, author, favorited, offset, limit }),
    { enabled: !slug }
  )

  const {
    isLoading: isLocalArticlesLoading,
    isError: isLocalArticlesError,
    data: articlesLocal,
    error: articlesErrorLocal
  } = useQuery(
    ['get-articles-local', { offset, limit }],
    () => getLocalArticles({ offset, limit }),
    {
      enabled: !!token
    }
  )

  const {
    isLoading: isTagsLoading,
    isError: isTagsError,
    data: tags,
    error: tagsError
  } = useQuery('get-tags', getTags)

  const {
    isLoading: isArticleLoading,
    isError: isArticleError,
    data: article,
    error: articleError
  } = useQuery(`get-article-${slug}`, () => getArticle(slug), {
    enabled: !!slug
  })

  const handleSuccess = () => {
    queryClient.invalidateQueries('get-articles-local')
    if (slug !== undefined) {
      queryClient.invalidateQueries(`get-article-${slug}`)
      queryClient.invalidateQueries('get-articles')
    }
  }

  const favoriteMutation = useMutation(favoriteArticle, {
    onSuccess: handleSuccess
  })

  const unfavoriteMutation = useMutation(unfavoriteArticle, {
    onSuccess: handleSuccess
  })

  const publishArticleMutation = useMutation(publishArticle)

  const updateArticleMutation = useMutation(updateArticle, {
    onSuccess: () => {
      queryClient.invalidateQueries(`get-article-${slug}`)
    }
  })

  const deleteArticleMutation = useMutation(deleteArticle, {
    onSuccess: () => {
      queryClient.invalidateQueries('get-articles')
    }
  })

  return {
    isArticlesLoading,
    isArticlesError,
    articles,
    articlesError,
    isLocalArticlesLoading,
    isLocalArticlesError,
    articlesLocal,
    articlesErrorLocal,
    isTagsLoading,
    isTagsError,
    tags,
    tagsError,
    article,
    articleError,
    isArticleLoading,
    isArticleError,
    favorite: favoriteMutation,
    unfavorite: unfavoriteMutation,
    publishArticle: publishArticleMutation,
    deleteArticle: deleteArticleMutation,
    updateArticle: updateArticleMutation
  }
}

export default useArticle
