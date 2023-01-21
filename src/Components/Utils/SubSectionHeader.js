import React from 'react';

const SubSectionHeader = (props) => {
    return (
        <div className='md:bg-primary md:p-2 text-xl text-primary font-medium text-center md:flex-grow md:text-primary-content'>
            {props.text}
        </div>
    );
};

export default SubSectionHeader;
