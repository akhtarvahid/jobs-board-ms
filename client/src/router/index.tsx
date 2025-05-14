import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import publicRoutes from './publicRoutes'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import privateRoutes from './privateRoutes'

const Router = () => {
  const { token } = useSelector((state: RootState) => state.userAuth)
  const routes = token ? privateRoutes : publicRoutes
  const router = createBrowserRouter(routes)
  return <RouterProvider router={router} />
}

export default Router
