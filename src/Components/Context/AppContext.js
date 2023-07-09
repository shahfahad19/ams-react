import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const AppContext = React.createContext({
    header: '',
    token: '',
    isLoggedIn: false,
    loggedInAs: '',
    userData: {},
    theme: '',
    baseURL: process.env.REACT_APP_API,
    captchaKey: process.env.REACT_APP_CAPTCHA_KEY,
    inputClasses: '',
    btnClasses: '',
    selectClasses: '',
    error: {},
    logout: () => {},
    login: () => {},
    changeTheme: () => {},
    showSwal: () => {},
    Swal: () => {},
    navigate: () => {},
});

export const AppContextProvider = (props) => {
    const [isLoggedIn, setLoggedIn] = useState('wait');
    const [loggedInAs, setLoggedInAs] = useState();
    const [error, setError] = useState();
    const navigate = useNavigate();
    const MySwal = withReactContent(Swal);

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
                    setLoggedInAs(response.data.data.user.role);
                    setUserData(response.data.data.user);
                    setLoggedIn(true);
                })
                .catch((error) => {
                    setError(error);
                    console.log(error);
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

    const showSwalHandler = (type, message) => {
        MySwal.fire({
            icon: type === 0 ? 'error' : 'success',
            title: type === 0 ? 'Error' : 'Success',
            text: message,
        });
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
                theme: 'light',
                baseURL: process.env.REACT_APP_API,
                captchaKey: process.env.REACT_APP_CAPTCHA_KEY,
                error: error,
                btnClasses: 'btn btn-neutral w-fit rounded-lg btn-sm font-medium',
                inputClasses: 'input w-full input-bordered border-neutral rounded-full',
                selectClasses: 'select w-full select-bordered border-neutral rounded-full',
                showSwal: showSwalHandler,
                Swal: MySwal,
                navigate: navigate,
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
};
export default AppContext;
