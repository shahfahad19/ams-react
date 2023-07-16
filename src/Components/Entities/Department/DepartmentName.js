import React, { useContext } from 'react';
import AppContext from '../../Context/AppContext';

const DepartmentName = ({ name, className }) => {
    const ctx = useContext(AppContext);
    const departmentName = name || ctx.userData.department;

    return (
        <div
            className={`text-center text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-800 to-cyan-600 text-transparent bg-clip-text mb-2 ${className}`}
        >
            Department of {departmentName}
        </div>
    );
};

export default DepartmentName;
