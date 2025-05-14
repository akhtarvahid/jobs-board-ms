import { SubmitHandler, useForm } from 'react-hook-form'
import useComment from '../../hooks/useComment'
import useProfile from '../../hooks/useProfile'
import dateConverter from '../../utils/dateConverter'
import { useState } from 'react'
import { Link } from 'react-router-dom'

type Inputs = {
  comment: {
    body: string
  }
}

const Comments = ({ slug, isAuth }: any) => {
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null
  )
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<Inputs>({
    defaultValues: {
      comment: {
        body: ''
      }
    },
    mode: 'onChange'
  })
  const { userData } = useProfile({})
  const {
    comments: commentsData,
    createComment,
    deleteComment
  } = useComment({ slug })
  const comments = commentsData?.comments
  const user = userData?.user

  const onSubmit: SubmitHandler<Inputs> = async (data: any) => {
    try {
      if (slug) {
        const res = await createComment.mutateAsync(data)
        if (res) {
          reset()
        }
      }
    } catch (error) {
      console.log('createErr: ', error)
    }
  }

  const handleDeleteComment = async (id: any) => {
    setDeletingCommentId(id)
    if (!deleteComment.isLoading)
      try {
        await deleteComment.mutateAsync(id)
      } catch (error) {
        console.log('deleteErr: ', error)
      }
  }
  return (
    <>
      <div className='row'>
        <div className='col-xs-12 col-md-8 offset-md-2'>
          {isAuth ? (
            <form
              className='card comment-form'
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className='card-block'>
                <textarea
                  className='form-control'
                  placeholder='Write a comment...'
                  rows={3}
                  {...register('comment.body', { required: true })}
                ></textarea>
                {errors.comment && <span>This field is required</span>}
              </div>
              <div className='card-footer'>
                <img src={user?.image} className='comment-author-img' />
                <button
                  className='btn btn-sm btn-primary'
                  disabled={createComment.isLoading}
                >
                  Post Comment
                </button>
              </div>
            </form>
          ) : (
            <div className='row'>
              <div className='col-xs-12 col-md-8 offset-md-2'>
                <p>
                  <Link to='/login'>Sign in</Link> or{' '}
                  <Link to='/register'>Sign up</Link> to add comments on this
                  article.
                </p>
              </div>
            </div>
          )}

          {comments &&
            comments.length > 0 &&
            comments.map((comment: any) => (
              <div className='card' key={comment?.id}>
                <div className='card-block'>
                  <p className='card-text'>{comment?.body}</p>
                </div>
                <div className='card-footer'>
                  <Link
                    to={`/${comment?.author?.username}`}
                    className='comment-author'
                  >
                    <img
                      src={comment?.author?.image}
                      className='comment-author-img'
                    />
                  </Link>
                  &nbsp;
                  <Link
                    to={`/${comment?.author?.username}`}
                    className='comment-author'
                  >
                    {comment?.author?.username}
                  </Link>
                  <span className='date-posted'>
                    {dateConverter(comment?.updatedAt)}
                  </span>
                  {user?.username === comment?.author?.username && (
                    <span className='mod-options'>
                      {deletingCommentId === comment?.id ? (
                        'deleting...'
                      ) : (
                        <i
                          className='ion-trash-a'
                          onClick={() => handleDeleteComment(comment?.id)}
                        ></i>
                      )}
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  )
}

export default Comments
