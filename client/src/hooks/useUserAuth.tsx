import { useMutation, useQueryClient } from 'react-query'
import { useDispatch } from 'react-redux'
import { setToken, setUser } from '../store/user/userAuthSlice'
import request from '../utils/request'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type User = {
  user: {
    username: string
    email: string
    password: string
  }
}

type Login = {
  user: {
    email: string
    password: string
  }
}

const useUserAuth = ({ reset }: any) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const [registerErr, setRegisterErr] = useState(null)

  const registerUser = (data: User): Promise<any> =>
    request
      .post('/users', data)
      .then((res) => res.data)
      .catch((err) => {
        setRegisterErr(err)
        throw err
      })

  const loginUser = (data: Login): Promise<any> =>
    request
      .post('/users/login', data)
      .then((res) => res.data)
      .catch((err) => {
        setRegisterErr(err)
        throw err
      })

  const handleSuccess = (data: any) => {
    const { token, ...userWithoutToken } = data.user
    dispatch(setToken(token))
    dispatch(setUser(userWithoutToken))
    queryClient.invalidateQueries({
      queryKey: ['get-user', 'get-articles-local']
    })
    reset()
    navigate('/')
    setTimeout(() => {
      window.location.reload()
    }, 1)
  }

  const registerMutation = useMutation(registerUser, {
    onSuccess: handleSuccess
  })

  const loginMutation = useMutation(loginUser, {
    onSuccess: handleSuccess
  })
  return {
    registerUser: registerMutation,
    loginUser: loginMutation,
    registerErr
  }
}

export default useUserAuth
