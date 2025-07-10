export const isTokenExpired = (token: string) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (e) {
    return true;
  }
};

export const logout = () => {
  // Clear tokens and user data
  localStorage.removeItem('token');
  localStorage.removeItem('persist:token');
  localStorage.removeItem('user');
};

export const getToken = () => {
  const storageToken = localStorage.getItem('persist:token') || '';

  if (!storageToken) return;
  const { token } = JSON.parse(storageToken);

  const parsedToken = JSON.parse(token);
  const isExpired = isTokenExpired(parsedToken);

  return isExpired ? null : parsedToken;
};
