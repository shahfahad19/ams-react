import axios from 'axios';
import React, { useEffect, useState } from 'react';

const AppContext = React.createContext({
    header: '',
    token: '',
    isLoggedIn: false,
    loggedInAs: '',
    userData: {},
    logout: () => {},
    login: () => {},
});

export const AppContextProvider = (props) => {
    const [isLoggedIn, setLoggedIn] = useState('wait');
    const [loggedInAs, setLoggedInAs] = useState();
    const [userData, setUserData] = useState();
    const [token, setToken] = useState();

    useEffect(() => {
        const baseURL = 'https://amsapi.vercel.app';
        let token = '';
        try {
            token = localStorage.getItem('ams-token');
        } catch (err) {}
        if (token === '') {
            setLoggedIn(false);
            return;
        }
        let role = '';
        try {
            role = parseInt(token.charAt(token.length - 1));
        } catch (err) {
            setLoggedIn(false);
            return;
        }

        token = token.substring(0, token.length - 1);
        setToken(token);
        if (role === 1) role = 'admin';
        if (role === 2) role = 'teacher';
        if (role === 3) role = 'student';
        //else return;
        axios
            .get(`${baseURL}/${role}`, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            })
            .then((response) => {
                setLoggedIn(true);
                setLoggedInAs(role);
                setUserData(response.data.data);
            })
            .catch((error) => {
                setLoggedIn(false);
            });
    }, []);

    const loginHandler = () => {
        setLoggedIn('wait');

        const baseURL = 'https://amsapi.vercel.app';
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
        let role = parseInt(token.charAt(token.length - 1));

        token = token.substring(0, token.length - 1);
        setToken(token);
        if (role === 1) role = 'admin';
        if (role === 2) role = 'teacher';
        if (role === 3) role = 'student';
        axios
            .get(`${baseURL}/${role}`, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            })
            .then((response) => {
                setLoggedIn(true);
                setLoggedInAs(role);
                setUserData(response.data.data);
            })
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
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
};
export default AppContext;
