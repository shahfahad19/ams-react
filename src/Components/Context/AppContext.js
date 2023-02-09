import axios from 'axios';
import React, { useEffect, useState } from 'react';

const AppContext = React.createContext({
    header: '',
    token: '',
    isLoggedIn: false,
    loggedInAs: '',
    userData: {},
    baseURL: process.env.REACT_APP_API,
    captchaKey: process.env.REACT_APP_CAPTCHA_KEY,
    logout: () => {},
    login: () => {},
});

export const AppContextProvider = (props) => {
    const [isLoggedIn, setLoggedIn] = useState('wait');
    const [loggedInAs, setLoggedInAs] = useState();
    const [userData, setUserData] = useState({
        confirmed: true,
        photo: 'https://res.cloudinary.com/dbph73rvi/image/upload/v1675170781/mdqcinla4xkogsatvbr3.jpg',
    });
    const [token, setToken] = useState();

    useEffect(() => {
        let token = '';
        try {
            token = localStorage.getItem('ams-token');
        } catch (err) {}
        if (token === '') {
            setLoggedIn(false);
            return;
        }
        setToken(token);
        if (token !== '')
            axios
                .get(`${process.env.REACT_APP_API}/user`, {
                    credentials: 'include',
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                })
                .then((response) => {
                    setLoggedIn(true);
                    setLoggedInAs(response.data.data.user.role);
                    setUserData(response.data.data.user);
                })
                .catch((error) => {
                    setLoggedIn(false);
                });
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
            .get(`${process.env.REACT_APP_API}/user`, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            })
            .then((response) => {})
            .catch((error) => {
                setLoggedIn(false);
            });
    };

    const logoutHandler = () => {
        localStorage.setItem('ams-token', '');
        setLoggedIn(false);
        setLoggedInAs('');
        setUserData({});
        setToken('');
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
                baseURL: process.env.REACT_APP_API,
                captchaKey: process.env.REACT_APP_CAPTCHA_KEY,
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
};
export default AppContext;
