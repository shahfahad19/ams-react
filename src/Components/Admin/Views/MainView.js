import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Menu, { MenuItems, MenuItem } from '../../Utils/Menu';
import SideBarTitle from '../../Utils/SideBarTitle';

const MainView = () => {
    const ctx = useContext(AppContext);

    return (
        <>
            <div className='batch flex flex-col md:flex-row'>
                <div className='batch-info w-auto flex flex-col space-y-1 shadow-md rounded-xl p-2 md:p-0 md:shadow-none border border-solid md:border-none mb-5 md:mb-0'>
                    <SideBarTitle title={ctx.userData.department} />

                    <Menu>
                        <MenuItems>
                            <MenuItem text='Batches' tab='batches' />
                            <MenuItem text='Teachers' tab='teachers' />
                        </MenuItems>
                    </Menu>
                </div>
                <Outlet />
            </div>
        </>
    );
};

export default MainView;
