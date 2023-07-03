import React from 'react';
import { Link } from 'react-router-dom';

const SubSectionHeader = (props) => {
    return (
        <div className='md:p-2 text-xl font-medium text-center md:flex-grow border-b-2 mb-3 flex justify-between'>
            <div className='flex-grow text-center'>{props.text}</div>
            {props.showBtn && (
                <Link to={props.btnLink} className='btn rounded btn-xs btn-neutral mr-1'>
                    {props.btnText}
                </Link>
            )}
        </div>
    );
};

export default SubSectionHeader;
