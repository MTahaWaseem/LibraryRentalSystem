// return the user data from the session storage
export const checkToken = () => {
  const userStr = sessionStorage.getItem('token');
  if (userStr) return true;
  else return false;
}

export const checkAdmin = () => {
  const userStr = JSON.parse(sessionStorage.getItem('user'));
  if (userStr) {
    if (userStr.Type == 0) {
      return true;
    }
    else return false;
  }

  else return false;
}

export const checkManager = () => {
  const userStr = JSON.parse(sessionStorage.getItem('user'));
  if (userStr) {
    if (userStr.Type == 1) {
      return true;
    }
    else return false;
  }

  else return false;
}

export const getUser = () => {
  const userStr = sessionStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  else return null;
}

// return the token from the session storage
export const getToken = () => {
  return sessionStorage.getItem('token') || null;
}

// remove the token and user from the session storage
export const removeUserSession = () => {
  sessionStorage.removeItem('token');
  //sessionStorage.removeItem('user');
}

export const removeUserIDSession = () => {
  // sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
}

// set the token and user from the session storage
export const setUserSession = (token) => {
  sessionStorage.setItem('token', token);
  //sessionStorage.setItem('user', JSON.stringify(user));
}

export const setUserIDSession = (user) => {
  //sessionStorage.setItem('token', token);
  sessionStorage.setItem('user', JSON.stringify(user));
}