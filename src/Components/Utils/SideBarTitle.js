import React from 'react';

const SideBarTitle = (props) => {
    return (
        <p className='text-md md:text-lg font-medium bg-primary text-primary-content p-1 md:p-2 md:text-left mb-1 rounded-xl md:rounded-none text-center'>
            {props.title}
        </p>
    );
};

export default SideBarTitle;
