import Profile from '../pages/Profile'

const profileRoutes = [
  {
    path: ':username',
    element: <Profile />,
    children: [
      {
        path: 'favorites',
        element: <Profile />
      }
    ]
  }
]

export default profileRoutes
