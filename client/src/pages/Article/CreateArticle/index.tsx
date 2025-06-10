import { SubmitHandler, useForm } from 'react-hook-form';
import FieldInput from '../../../components/Inputs/FieldInput';
import { articleObjs } from '../../Authentication/Login/loginData';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { addStory } from '../../../store/story/storySlice';
import { useAppDispatch } from '../../../store';

type Inputs = {
  article: {
    title: string;
    description: string;
    body: string;
    tagList: any;
  };
};

const CreateArticle = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { slug } = useParams();
  const [tags, setTags] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const handleClick = (tag: string) => {
    const updatedTags = tags.filter((t: string) => t !== tag);
    setTags(updatedTags);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      dispatch(
        addStory({
          story: data.article,
        }),
      );
      navigate(`/`);
    } catch (error) {
      console.log('failed add story');
    }
  };

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <ul className="error-messages">
              {errors.article &&
                Object.keys(errors.article as Record<string, any>).map(
                  (key) => (
                    <li key={key}>
                      {(errors.article as Record<string, any>)[key].message}
                    </li>
                  ),
                )}
              {/* {(publishArticle?.error as Record<string, any>) &&
                Object.keys(publishArticle?.error as Record<string, any>).map(
                  (errKey: string) =>
                    (
                      (publishArticle?.error as Record<string, any>)[
                        errKey
                      ] as string[]
                    ).map((errMsg: string, i: number) => (
                      <li key={`${errKey}-${i}`}>{`${errKey} ${errMsg}`}</li>
                    ))
                )}
              {(updateArticle?.error as Record<string, any>) &&
                Object.keys(updateArticle?.error as Record<string, any>).map(
                  (errKey: string) =>
                    (
                      (updateArticle?.error as Record<string, any>)[
                        errKey
                      ] as string[]
                    ).map((errMsg: string, i: number) => (
                      <li key={`${errKey}-${i}`}>{`${errKey} ${errMsg}`}</li>
                    ))
                )} */}
            </ul>
            <form onSubmit={handleSubmit(onSubmit)}>
              <fieldset>
                {articleObjs.map((articleObj: any, c: number) => (
                  <FieldInput
                    // isLoading={
                    //   publishArticle?.isLoading || updateArticle?.isLoading
                    // }
                    {...articleObj}
                    register={register}
                    key={c}
                    slug={slug}
                    tags={tags}
                    handleClick={handleClick}
                  />
                ))}
                <button
                  className="btn btn-lg pull-xs-right btn-primary"
                  type="submit"
                  // disabled={
                  //   publishArticle?.isLoading || updateArticle?.isLoading
                  // }
                >
                  Publish
                  {/* {publishArticle?.isLoading || updateArticle?.isLoading
                    ? 'Loading...'
                    : 'Publish Article'} */}
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;
