import { useDispatch } from 'react-redux'
import { logout } from '../../store/user/userAuthSlice'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from 'react-query'
import { SubmitHandler, useForm } from 'react-hook-form'
import useProfile from '../../hooks/useProfile'
import { settingsObjs } from '../Authentication/Login/loginData'
import FieldInput from '../../components/Inputs/FieldInput'
import { useEffect } from 'react'

type Inputs = {
  user: {
    image?: string
    username?: string
    bio?: string
    email?: string
    password?: string
  }
}

const Settings = () => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleClick = () => {
    dispatch(logout())
    queryClient.invalidateQueries('get-articles')
    navigate('/')
  }

  const { userData, updateUser } = useProfile({})
  console.log('userData: ', userData?.user)
  const user = userData?.user
  const {
    register,
    handleSubmit,
    reset
  } = useForm<Inputs>()

  useEffect(() => {
    if (user) {
      reset({
        user: {
          image: user?.image || '',
          username: user?.username || '',
          bio: user?.bio || '',
          email: user?.email || '',
          password: ''
        }
      })
    }
  }, [user])

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (Object.keys(data?.user).length > 0) {
      const res = await updateUser.mutateAsync(data)
      if (!!res) navigate(`/${user?.username}`)
    }
  }

  return (
    <div className='settings-page'>
      <div className='container page'>
        <div className='row'>
          <div className='col-md-6 offset-md-3 col-xs-12'>
            <h1 className='text-xs-center'>Your Settings</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
              <fieldset>
                {settingsObjs.map((settingObj: any, c: number) => (
                  <FieldInput
                    {...settingObj}
                    register={register}
                    isLoading={updateUser?.isLoading}
                    key={c}
                  />
                ))}
                <button
                  className='btn btn-lg btn-primary pull-xs-right'
                  disabled={updateUser.isLoading}
                >
                  {updateUser?.isLoading ? 'Loading...' : 'Update Settings'}
                </button>
              </fieldset>
            </form>
            <hr />
            <button className='btn btn-outline-danger' onClick={handleClick}>
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
