import { SubmitHandler, useForm } from 'react-hook-form';
import dateConverter from '../../utils/dateConverter';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useDeleteComment,
  useGetStory,
  useNewComment,
} from '../../hooks/useFetchArticles';

type Inputs = {
  comment: {
    body: string;
  };
};

const Comments = ({ slug, isAuth, user }: any) => {
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(
    null,
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>({
    defaultValues: {
      comment: {
        body: '',
      },
    },
    mode: 'onChange',
  });
  const { data: storyComments } = useGetStory(`/story/${slug}/comment`);
  console.log('commetns', storyComments, isAuth);

  const comments = storyComments?.comments;

  const {
    data: newComment,
    create: newCreateComment,
    loading,
  } = useNewComment(`/story/${slug}/comment`);

  const { deleteComment, loading: isDeleting } = useDeleteComment();

  const onSubmit: SubmitHandler<Inputs> = async (data: any) => {
    console.log('created comment', slug);
    try {
      if (slug) {
        await newCreateComment(data);
      }
    } catch (error) {
      console.log('createErr: ', error);
    }
  };

  console.log('Comment Added ', newComment);

  const handleDeleteComment = async (id: any) => {
    setDeletingCommentId(id);

    await deleteComment(`/story/${slug}/comment/${id}`);
    console.log('deleted comment id: ', id);
  };
  return (
    <>
      <div className="row">
        <div className="col-xs-12 col-md-8 offset-md-2">
          {isAuth ? (
            <form
              className="card comment-form"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="card-block">
                <textarea
                  className="form-control"
                  placeholder="Write a comment..."
                  rows={3}
                  {...register('comment.body', { required: true })}
                ></textarea>
                {errors.comment && <span>This field is required</span>}
              </div>
              <div className="card-footer">
                <img src={user?.image} className="comment-author-img" />
                <button className="btn btn-sm btn-primary" disabled={loading}>
                  Post Comment
                </button>
              </div>
            </form>
          ) : (
            <div className="row">
              <div className="col-xs-12 col-md-8 offset-md-2">
                <p>
                  <Link to="/login">Sign in</Link> or{' '}
                  <Link to="/register">Sign up</Link> to add comments on this
                  article.
                </p>
              </div>
            </div>
          )}

          {comments &&
            comments.length > 0 &&
            comments.map((comment: any) => {
              console.log('Comment::: ', comment, user);
              return (
                <div className="card" key={comment?.id}>
                  <div className="card-block">
                    <p className="card-text">{comment?.body}</p>
                  </div>
                  <div className="card-footer">
                    <Link
                      to={`/${comment?.owner?.username}`}
                      className="comment-author"
                    >
                      <img
                        src={comment?.owner?.image}
                        className="comment-author-img"
                      />
                    </Link>
                    &nbsp;
                    <Link
                      to={`/${comment?.owner?.username}`}
                      className="comment-author"
                    >
                      {comment?.owner?.username}
                    </Link>
                    <span className="date-posted">
                      {dateConverter(comment?.updatedAt)}
                    </span>
                    {user?.username === comment?.owner?.username && (
                      <>
                        <span
                          className="mod-options"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          {isDeleting && deletingCommentId == comment.id
                            ? 'Deleting..'
                            : 'Delete'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Comments;
