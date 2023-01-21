import React from 'react';
import { useNavigate } from 'react-router-dom';

const Redirect = (props) => {
    const navigate = useNavigate();
    navigate(props.to);
    console.log(props.to);
    return <></>;
};

export default Redirect;
