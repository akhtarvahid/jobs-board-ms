const FieldInput = ({
  type,
  placeholder,
  name,
  validation,
  register,
  isLoading,
  tags = [],
  slug = '',
  handleClick
}: any) => {
  console.log('tags: ', tags)

  return (
    <fieldset className='form-group'>
      {name === 'user.bio' || name === 'article.body' ? (
        <textarea
          disabled={isLoading}
          className='form-control form-control-lg'
          rows={8}
          placeholder={placeholder}
          {...register(name, { ...validation })}
        ></textarea>
      ) : (
        <input
          disabled={isLoading}
          className='form-control form-control-lg'
          type={type}
          placeholder={placeholder}
          {...register(name, tags.length === 0 && validation)}
        />
      )}
      {name === 'article.tagList' && slug && (
        <div className='tag-list'>
          {tags.map((tag: string) => (
            <span className='tag-default tag-pill ng-binding ng-scope'>
              <i
                className='ion-close-round'
                onClick={() => handleClick(tag)}
              ></i>{' '}
              {tag}
            </span>
          ))}
        </div>
      )}
    </fieldset>
  )
}

export default FieldInput
