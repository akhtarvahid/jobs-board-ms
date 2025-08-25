export default async function handleFollowFunc(
  name: string,
  bool: boolean,
  func1: any,
  func2: any,
  navigate: any,
  isAuth: boolean
) {
  if (func1?.isLoading || func2?.isLoading) return
  if (isAuth) {
    try {
      if (bool) {
        await func1.mutateAsync(name)
      } else {
        await func2.mutateAsync(name)
      }
    } catch (error) {
      console.log('followFavoriteErr: ', error)
    }
  } else {
    navigate('/register')
  }
}
