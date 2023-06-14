import React from 'react';
import { Link } from 'react-router-dom';

const Error404 = (props) => {
    return (
        <div className='flex items-center justify-center h-80'>
            <div className='text-center'>
                <p className='text-error text-6xl font-bold'>
                    <span>403</span>
                </p>
                <p className='text-error text-2xl font-bold'>Forbidden</p>
                <p className='text-xl font-semibold mt-5'>You are not allowed to view this page</p>
                {props.link && (
                    <Link to={props.link} className='link p-5 text-md'>
                        Click here to open your dashboard
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Error404;
