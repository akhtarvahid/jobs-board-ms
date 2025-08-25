import { Navigate } from 'react-router-dom';
import Layout from '../Layout';
import Login from '../pages/Authentication/Login';
import Register from '../pages/Authentication/Register';
import articleRoutes from './articleRoutes';
import profileRoutes from './profileRoutes';
import Home from '../pages/Home';

const publicRoutes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      articleRoutes[1],
      ...profileRoutes, // TODO: to remove later
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

export default publicRoutes;
