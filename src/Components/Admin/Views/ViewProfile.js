import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Menu, { MenuItems, MenuItem } from '../../Utils/Menu';
import SideBarTitle from '../../Utils/SideBarTitle';

const ViewProfile = () => {
    const params = useParams();
    const ctx = useContext(AppContext);

    useEffect(() => {});

    return (
        <>
            <div className='batch flex flex-col md:flex-row'>
                <div className='batch-info w-auto md:w-40 flex flex-col space-y-1 shadow-md rounded-xl p-2 md:p-0 md:shadow-none border border-solid md:border-none mb-5 md:mb-0'>
                    <SideBarTitle title={ctx.userData.name || 'Name'} />
                    <Menu>
                        <MenuItems>
                            <MenuItem text='Profile' tab='view' />
                            <MenuItem text='Edit Profile' tab='edit-profile' />
                            <MenuItem text='Update Profile Pic ' tab='edit-photo' />
                            <MenuItem text='Update Password' tab='edit' />
                        </MenuItems>
                    </Menu>
                </div>
                <Outlet />
            </div>
        </>
    );
};

export default ViewProfile;
