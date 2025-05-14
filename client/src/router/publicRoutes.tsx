import { Navigate } from 'react-router-dom'
import Layout from '../Layout'
import Home from '../pages/Home'
import Login from '../pages/Authentication/Login'
import Register from '../pages/Authentication/Register'
import articleRoutes from './articleRoutes'
import profileRoutes from './profileRoutes'

const publicRoutes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      articleRoutes[1],
      ...profileRoutes
    ]
  },
  {
    path: '*',
    element: <Navigate to='/' replace />
  }
]

export default publicRoutes
