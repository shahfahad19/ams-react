import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Menu, { MenuItems, MenuItem } from '../../Utils/Menu';
import SideBarTitle from '../../Utils/SideBarTitle';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import Table from '../../Utils/Table';

const Profile = () => {
    const params = useParams();
    const ctx = useContext(AppContext);

    useEffect(() => {});

    return (
        <>
            <div className='flex-grow'>
                <SubSectionHeader text='Profile' />
                <Table>
                    <tr>
                        <td>Name: </td>
                        <td>{ctx.userData.name}</td>
                    </tr>
                    <tr>
                        <td>Department </td>
                        <td>{ctx.userData.department}</td>
                    </tr>
                </Table>
            </div>
        </>
    );
};

export default Profile;
