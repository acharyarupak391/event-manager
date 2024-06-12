interface LSUserInfo {
  email: string;
  name: string;
  timezone: string;
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
    timezone: ''
  }
}

const setUserInfoInLS = (value: LSUserInfo) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('userinfo', JSON.stringify(value));
    } catch (error) {
      console.log('Error setting data in local storage', error);
    }
  }
}

export { getUserInfoFromLS, setUserInfoInLS };