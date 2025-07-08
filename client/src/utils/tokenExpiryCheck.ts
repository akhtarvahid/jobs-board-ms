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
  const token = JSON.parse(storageToken);
  const parsedToken = JSON.parse(token?.token); // Or get token from your preferred storage
  const isExpired = isTokenExpired(parsedToken?.access_token);

  return isExpired ? null : parsedToken;
};
