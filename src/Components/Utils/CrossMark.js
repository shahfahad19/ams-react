import React from 'react';

const CrossMark = () => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='#fff'
            strokeWidth='1'
            strokeLinecap='round'
            strokeLinejoin='round'
            style={{ backgroundColor: 'rgba(255, 0, 0, 0.75)', borderRadius: '50%', width: '24px', height: '24px' }}
        >
            <circle cx='12' cy='12' r='10' />
            <line x1='15' y1='9' x2='9' y2='15' />
            <line x1='9' y1='9' x2='15' y2='15' />
        </svg>
    );
};

export default CrossMark;
