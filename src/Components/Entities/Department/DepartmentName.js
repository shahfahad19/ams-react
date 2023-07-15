import React from 'react';

const DepartmentName = ({ name, className }) => {
    return (
        <div
            className={`text-center text-2xl font-bold bg-gradient-to-r from-blue-800 to-cyan-600 text-transparent bg-clip-text mb-2 ${className}`}
        >
            Department of {name}
        </div>
    );
};

export default DepartmentName;
