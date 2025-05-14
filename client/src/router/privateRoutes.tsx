import { Navigate } from 'react-router-dom'
import Layout from '../Layout'
import articleRoutes from './articleRoutes'
import profileRoutes from './profileRoutes'
import Home from '../pages/Home'
import Settings from '../pages/Settings'

const privateRoutes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/settings',
        element: <Settings />
      },
      ...articleRoutes,
      ...profileRoutes
    ]
  },
  {
    path: '*',
    element: <Navigate to='/' replace />
  }
]

export default privateRoutes
