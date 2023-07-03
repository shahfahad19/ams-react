import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Menu, { MenuItems, MenuItem } from '../../Utils/Menu';
import SideBarTitle from '../../Utils/SideBarTitle';
import BackButton from '../../Utils/BackButton';

const ViewBatch = () => {
    const params = useParams();
    const ctx = useContext(AppContext);

    const [batch, setBatch] = useState([]);

    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/batches/${params.batchId}`, {
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
    });

    return (
        <>
            <BackButton to='/admin/batches' text='Batch List' className='m-2' />
            <div className='batch flex flex-col md:flex-row'>
                <div className='batch-info w-auto md:w-40 flex flex-col space-y-1 shadow-md rounded-xl p-2 md:p-0 md:shadow-none border border-solid md:border-none mb-5 md:mb-0'>
                    {batch.name === undefined && <SideBarTitle title='Loading...' />}
                    {batch.name !== undefined && <SideBarTitle title={`Batch ${batch.name}` || 'Batch'} />}

                    <Menu>
                        <MenuItems>
                            <MenuItem text='Semesters' tab='semesters' />
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
