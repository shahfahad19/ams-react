import React from 'react';

const Spinner = (props) => {
    return (
        <svg className={`spinner-ring ${props.className}`} viewBox='25 25 50 50' strokeWidth='5'>
            <circle cx='50' cy='50' r='20' />
        </svg>
    );
};

export default Spinner;
