import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import AppContext from '../../Context/AppContext';

const Dashboard = () => {
    const ctx = useContext(AppContext);
    return (
        <>
            {ctx.isLoggedIn === 'wait' && (
                <div className='flex absolute flex-col justify-center h-auto bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 items-center'>
                    <p className='text-lg font-bold text-primary text-center p-3'>Please wait</p>
                    <progress className='progress progress-primary w-56'></progress>
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
