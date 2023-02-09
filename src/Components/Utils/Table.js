import React from 'react';

const Table = (props) => {
    return (
        <div className='overflow-x-auto'>
            <table className='table w-full'>{props.children}</table>
        </div>
    );
};

export default Table;
