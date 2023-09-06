import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AppContext = React.createContext({
  header: '',
  token: '',
  isLoggedIn: false,
  loggedInAs: '',
  userData: {},
  theme: '',
  baseURL: '',
  captchaKey: '',
  inputClasses: '',
  btnClasses: '',
  selectClasses: '',
  error: {},
  logout: () => {},
  login: () => {},
  changeTheme: () => {},
  navigate: () => {},
  computeError: () => {},
  successAlert: () => {},
  errorAlert: () => {},
  handleError: () => {},
  setUserData: () => {}
});

export const AppContextProvider = (props) => {
  const [isLoggedIn, setLoggedIn] = useState('wait');
  const [loggedInAs, setLoggedInAs] = useState();
  const [error, setError] = useState();
  const navigate = useNavigate();

  const [theme, setTheme] = useState('light');

  const [userData, setUserData] = useState({
    confirmed: true,
    photo: 'https://res.cloudinary.com/dbph73rvi/image/upload/v1675170781/mdqcinla4xkogsatvbr3.jpg'
  });
  const [token, setToken] = useState();

  useEffect(() => {
    let token = '';
    let savedTheme = '';
    try {
      token = localStorage.getItem('ams-token');
      savedTheme = localStorage.getItem('theme');
    } catch (err) {
      /* empty */
    }
    if (token === '') {
      savedTheme = 'light';
      setLoggedIn(false);
      return;
    }
    setToken(token);
    if (token !== '')
      axios
        // eslint-disable-next-line no-undef
        .get(`${process.env.REACT_APP_API}/user`, {
          credentials: 'include',
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
        .then((response) => {
          setLoggedInAs(response.data.data.user.role);
          setUserData(response.data.data.user);
          setLoggedIn(true);
        })
        .catch(() => {
          setLoggedIn(false);
        });

    document.body.setAttribute('data-theme', savedTheme);
    setTheme(savedTheme);
  }, []);

  const loginHandler = () => {
    setLoggedIn('wait');
    let token = '';
    try {
      token = localStorage.getItem('ams-token') || '';
    } catch (err) {
      return;
    }
    if (token === '') {
      setLoggedIn(false);
      return;
    }

    axios
      // eslint-disable-next-line no-undef
      .get(`${process.env.REACT_APP_API}/user`, {
        credentials: 'include',
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
      .then(() => {})
      .catch(() => {
        setLoggedIn(false);
        setLoggedInAs('none');
      });
  };

  const logoutHandler = () => {
    localStorage.setItem('ams-token', '');
    setLoggedIn(false);
    setLoggedInAs('');
    setUserData({});
    setToken('');
  };

  const computeError = (error) => {
    let errorMessage = error.message;
    if (error.response) errorMessage = error.response.data.message;
    return errorMessage;
  };

  const successAlert = (text) => {
    return {
      show: true,
      type: 'success',
      text: text
    };
  };

  const errorAlert = (text) => {
    return {
      show: true,
      type: 'error',
      text: text
    };
  };

  const changeTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.setAttribute('data-theme', newTheme);
    try {
      localStorage.setItem('theme', newTheme);
    } catch {
      /* empty */
    }
  };

  const handleError = (error) => {
    setError(error);
    navigate('/error', { replace: true });
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        loggedInAs: loggedInAs,
        token: token,
        userData: userData,
        login: loginHandler,
        logout: logoutHandler,
        theme: theme,
        // eslint-disable-next-line no-undef
        baseURL: process.env.REACT_APP_API,
        // eslint-disable-next-line no-undef
        captchaKey: process.env.REACT_APP_CAPTCHA_KEY,
        error: error,
        handleError,
        setUserData,
        btnClasses: 'btn btn-primary btn-block',
        inputClasses: 'input w-full input-block input-lg',
        selectClasses: 'select select-block select-lg',
        navigate: navigate,
        computeError: computeError,
        successAlert: successAlert,
        errorAlert: errorAlert,
        changeTheme: changeTheme
      }}>
      {props.children}
    </AppContext.Provider>
  );
};
export default AppContext;
