import { SubmitHandler, useForm } from 'react-hook-form'
import FieldInput from '../../../components/Inputs/FieldInput'
import { articleObjs } from '../../Authentication/Login/loginData'
import { useNavigate, useParams } from 'react-router-dom'
import useArticle from '../../../hooks/useArticle'
import { useQueryClient } from 'react-query'
import { useEffect, useState } from 'react'

type Inputs = {
  article: {
    title: string
    description: string
    body: string
    tagList: any
  }
}

const CreateArticle = () => {
  const { slug } = useParams()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const {
    publishArticle,
    article: articleData,
    updateArticle
  } = useArticle({ slug })
  const [tags, setTags] = useState([])
  const article = articleData?.article
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<Inputs>()

  useEffect(() => {
    if (slug && !!article) {
      reset({
        article: {
          title: article?.title || '',
          description: article?.description || '',
          body: article?.body || '',
          tagList: ''
        }
      })
    }
  }, [slug, article])

  useEffect(() => {
    if (article?.tagList.length) setTags(article?.tagList)
  }, [article?.tagList])
  const handleClick = (tag: string) => {
    const updatedTags = tags.filter((t: string) => t !== tag)
    setTags(updatedTags)
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!!slug) {
      if (!data.article.tagList) {
        data.article.tagList = tags
      } else {
        data.article.tagList = data.article.tagList.split(/[\s,]+/).concat(tags)
      }
      const res = await updateArticle.mutateAsync(data)
      console.log('res: ', res)
      if (!!res) {
        navigate(`/article/${slug}`)
      }
    } else {
      data.article.tagList = data.article.tagList.split(/[\s,]+/)
      const res = await publishArticle.mutateAsync(data)
      if (res?.article?.slug) {
        queryClient.invalidateQueries('get-articles')
        navigate(`/article/${res?.article?.slug}`)
      }
    }
  }

  return (
    <div className='editor-page'>
      <div className='container page'>
        <div className='row'>
          <div className='col-md-10 offset-md-1 col-xs-12'>
            <ul className='error-messages'>
              {errors.article &&
                Object.keys(errors.article as Record<string, any>).map(
                  (key) => (
                    <li key={key}>
                      {(errors.article as Record<string, any>)[key].message}
                    </li>
                  )
                )}
              {(publishArticle?.error as Record<string, any>) &&
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
                )}
            </ul>
            <form onSubmit={handleSubmit(onSubmit)}>
              <fieldset>
                {articleObjs.map((articleObj: any, c: number) => (
                  <FieldInput
                    isLoading={
                      publishArticle?.isLoading || updateArticle?.isLoading
                    }
                    {...articleObj}
                    register={register}
                    key={c}
                    slug={slug}
                    tags={tags}
                    handleClick={handleClick}
                  />
                ))}
                <button
                  className='btn btn-lg pull-xs-right btn-primary'
                  type='submit'
                  disabled={
                    publishArticle?.isLoading || updateArticle?.isLoading
                  }
                >
                  {publishArticle?.isLoading || updateArticle?.isLoading
                    ? 'Loading...'
                    : 'Publish Article'}
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateArticle
