import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Menu, { MenuItems, MenuItem } from '../../Utils/Menu';
import SideBarTitle from '../../Utils/SideBarTitle';
import DepartmentName from '../Components/DepartmentName';
import { BreadCrumb, BreadCrumbs } from '../../Utils/BreadCrumbs';

const MainView = () => {
    const ctx = useContext(AppContext);

    return (
        <>
            <DepartmentName name={ctx.userData.department} />
            <BreadCrumbs>
                <BreadCrumb to='/'>Home</BreadCrumb>
                <BreadCrumb>Dashboard</BreadCrumb>
            </BreadCrumbs>

            <Menu>
                <MenuItems>
                    <MenuItem text='Batches' tab='batches' />
                    <MenuItem text='Teachers' tab='teachers' />
                </MenuItems>
            </Menu>
            <Outlet />
        </>
    );
};

export default MainView;
