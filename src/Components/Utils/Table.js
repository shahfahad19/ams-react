import React from 'react';
import './Table.css';

const Table = (props) => {
    return (
        <div className='overflow-x-auto'>
            <table className='table w-full table-zebra'>{props.children}</table>
            {props.loading && props.loading === true && (
                <div className='relative h-80'>
                    <div className='loader-wrapper'>
                        <div className='loader'></div>
                    </div>
                </div>
            )}

            {props.error && props.error !== '' && (
                <div className='relative h-80'>
                    <div className='error text-error'>&#9888; {props.error}</div>
                </div>
            )}
        </div>
    );
};

export default Table;
