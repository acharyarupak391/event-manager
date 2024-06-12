interface LSUserInfo {
  email: string;
  name: string;
  timezone: string;
  country: string;
}

const getUserInfoFromLS = (): LSUserInfo => {
  if (typeof window !== 'undefined') {
    try {
      const user = localStorage.getItem('userinfo');
      if (user) {
        return JSON.parse(user);
      }
    } catch (error) {
      console.log('Error getting data from local storage', error);
    }
  }

  return {
    email: '',
    name: '',
    timezone: '',
    country: '',
  }
}

const setUserInfoInLS = (value: LSUserInfo | ((value: LSUserInfo) => LSUserInfo)) => {
  if (typeof window !== 'undefined') {
    try {
      const userInfo = getUserInfoFromLS();
      const newUserInfo = typeof value === 'function' ? value(userInfo) : value;
      localStorage.setItem('userinfo', JSON.stringify(newUserInfo));
    } catch (error) {
      console.log('Error setting data in local storage', error);
    }
  }
}

export { getUserInfoFromLS, setUserInfoInLS };