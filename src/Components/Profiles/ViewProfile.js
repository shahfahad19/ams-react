import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import AppContext from '../Context/AppContext';
import SideBarTitle from '../Utils/SideBarTitle';
import Menu, { MenuItem, MenuItems } from '../Utils/Menu';

const ViewProfile = () => {
    const params = useParams();
    const ctx = useContext(AppContext);

    useEffect(() => {});

    return (
        <>
            <Menu>
                <MenuItems>
                    <MenuItem text='Profile' tab='view' />
                    <MenuItem text='Edit Profile' tab='edit-profile' />
                    <MenuItem text='Update Profile Pic ' tab='edit-photo' />
                    <MenuItem text='Update Password' tab='update-password' />
                </MenuItems>
            </Menu>
            <Outlet />
        </>
    );
};

export default ViewProfile;
