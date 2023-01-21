import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Menu, { MenuItems, MenuItem } from '../../Utils/Menu';
import SideBarTitle from '../../Utils/SideBarTitle';

const ViewBatch = () => {
    const params = useParams();
    const ctx = useContext(AppContext);

    const [batch, setBatch] = useState([]);

    useEffect(() => {
        const baseURL = 'https://amsapi.vercel.app/admin/batch/' + params.batchId;

        axios
            .get(`${baseURL}`, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                setBatch(response.data.data.batch);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <>
            <div className='batch flex flex-col md:flex-row'>
                <div className='batch-info w-auto md:w-40 flex flex-col space-y-1 shadow-md rounded-xl p-2 md:p-0 md:shadow-none border border-solid md:border-none mb-5 md:mb-0'>
                    <SideBarTitle title={batch.name || 'Batch'} />
                    <Menu>
                        <MenuItems>
                            <MenuItem text='Semesters' tab='semesters' />
                            <MenuItem text='Add Semester' tab='add-semester' />
                            <MenuItem text='Students' tab='students' />
                            <MenuItem text='Edit Batch' tab='edit' />
                            <MenuItem text='Invite Link' tab='invite' />
                        </MenuItems>
                    </Menu>
                </div>
                <Outlet context={[batch, setBatch]} />
            </div>
        </>
    );
};

export default ViewBatch;
