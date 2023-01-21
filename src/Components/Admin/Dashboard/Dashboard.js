import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import AppContext from '../../Context/AppContext';

const Dashboard = () => {
    const ctx = useContext(AppContext);
    return (
        <>
            {ctx.isLoggedIn === 'wait' && (
                <div className='flex justify-center'>
                    <progress className='progress w-48'></progress>
                </div>
            )}

            {ctx.isLoggedIn === true && (
                <>
                    <div className='p-2 text-center'>
                        <h2 className='text-md font-medium'>Department: {ctx.userData.admin.department}</h2>
                    </div>
                    <Outlet />
                </>
            )}
        </>
    );
};

export default Dashboard;
