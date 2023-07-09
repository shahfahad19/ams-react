import React from 'react';

const TickMark = () => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='#fff'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            style={{ backgroundColor: 'rgba(0, 128, 0, 0.75)', borderRadius: '50%', width: '24px', height: '24px' }}
        >
            <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' />
            <polyline points='22 4 12 14.01 9 11.01' />
        </svg>
    );
};

export default TickMark;
