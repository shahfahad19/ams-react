import React from 'react';

const SideBarTitle = (props) => {
    return (
        <p className='text-md md:text-xl font-medium p-1 md:p-2 md:text-left mb-2 rounded-xl md:rounded-none text-center border-b-2'>
            {props.title}
        </p>
    );
};

export default SideBarTitle;
