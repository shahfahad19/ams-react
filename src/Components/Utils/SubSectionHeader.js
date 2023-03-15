import React from 'react';

const SubSectionHeader = (props) => {
    return <div className='md:p-2 text-xl font-medium text-center md:flex-grow border-b-2 mb-3'>{props.text}</div>;
};

export default SubSectionHeader;
