import request from '../utils/request'
import { useMutation, useQuery, useQueryClient } from 'react-query'

type CommentType = {
  comment: {
    body: string
  }
}

const getComments = (slug: string | undefined) =>
  request
    .get(`/articles/${slug}/comments`)
    .then((res) => res.data)
    .catch((err) => {
      console.error('getCommentsErr: ', err)
      throw err
    })

const useComment = ({ slug }: any) => {
  const queryClient = useQueryClient()

  const createComment = (data: CommentType) =>
    request
      .post(`/articles/${slug}/comments`, data)
      .then((res) => res.data)
      .catch((err) => {
        console.error('createCommentErr: ', err)
        throw err
      })

  const deleteComment = (id: string) =>
    request
      .delete(`/articles/${slug}/comments/${id}`)
      .then((res) => res.data)
      .catch((err) => {
        console.error('deleteCommentErr: ', err)
        throw err
      })

  const {
    data: comments,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    error: commentsError
  } = useQuery(`get-comments-${slug}`, () => getComments(slug), {
    enabled: !!slug
  })

  const commentMutation = useMutation(createComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(`get-comments-${slug}`)
    },
    onError: (err: any) => {
      console.log('createCommentERRR: ', err)
      throw err
    }
  })

  const deleteCommentMutation = useMutation(deleteComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(`get-comments-${slug}`)
    },
    onError: (err: any) => {
      console.log('deleteCommentERRR: ', err)
      throw err
    }
  })
  return {
    comments,
    createComment: commentMutation,
    deleteComment: deleteCommentMutation,
    isCommentsLoading,
    isCommentsError,
    commentsError
  }
}

export default useComment
