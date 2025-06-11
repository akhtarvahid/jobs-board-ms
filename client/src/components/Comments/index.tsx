import { SubmitHandler, useForm } from 'react-hook-form';
import dateConverter from '../../utils/dateConverter';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  addComment,
  deleteComment,
  getComments,
  updateComment,
} from '../../store/story/storySlice';
import { RootState, useAppDispatch } from '../../store';
import { useSelector } from 'react-redux';

type Inputs = {
  comment: {
    body: string;
  };
};

const Comments = ({ slug, isAuth, user }: any) => {
  const dispatch = useAppDispatch();
  const { allStories } = useSelector((state: RootState) => state.storyState);
  const [editingCommentId, setEditingCommentId] = useState(null);
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

  const { storyComments } = allStories;
  const comments = [...storyComments];

  useEffect(() => {
    dispatch(getComments({ slug: slug }));
  }, [slug]);

  const onSubmit: SubmitHandler<Inputs> = async (data: any) => {
    try {
      if (slug) {
        if (editingCommentId) {
          dispatch(
            updateComment({ slug: slug, id: editingCommentId, comment: data }),
          );
        } else {
          dispatch(addComment({ slug: slug, comment: data }));
        }
        setEditingCommentId(null);
        reset({
          comment: {
            body: '',
          },
        });
      }
    } catch (error) {
      console.log('createErr: ', error);
    }
  };

  const handleDeleteComment = async (id: any) => {
    setDeletingCommentId(id);
    dispatch(
      deleteComment({
        slug: slug,
        id: id,
      }),
    );
  };
  const handleEditComment = async (comment: any) => {
    setEditingCommentId(comment.id);

    reset({
      comment: {
        body: comment.body,
      },
    });
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
                <button className="btn btn-sm btn-primary">
                  {allStories.status === 'loading'
                    ? 'Comment adding...'
                    : 'Post Comment'}
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => reset()}
                >
                  Reset
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
                          onClick={() => handleEditComment(comment)}
                          className="mod-options"
                        >
                          <i className="ion-edit"></i>
                        </span>
                        <span
                          className="mod-options"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          {deletingCommentId == comment.id
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
