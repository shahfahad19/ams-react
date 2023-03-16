import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Menu, { MenuItems, MenuItem } from '../../Utils/Menu';
import SideBarTitle from '../../Utils/SideBarTitle';

const ViewSubject = () => {
    const params = useParams();
    const ctx = useContext(AppContext);

    const [subject, setSubject] = useState([]);

    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/subjects/${params.subjectId}`, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                setSubject(response.data.data.subject);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <>
            <div className='batch flex flex-col md:flex-row'>
                <div className='batch-info w-auto flex flex-col space-y-1 shadow-md rounded-xl p-2 md:p-0 md:shadow-none border border-solid md:border-none mb-5 md:mb-0'>
                    <SideBarTitle title={subject.name || 'Subject'} />
                    <Menu>
                        <MenuItems>
                            <MenuItem text='Attendances' tab='attendance' />
                            <MenuItem text='Edit Subject' tab='edit' />
                            <MenuItem text='Teacher' tab='teacher' />
                        </MenuItems>
                    </Menu>
                </div>
                <Outlet context={[subject, setSubject]} />
            </div>
        </>
    );
};

export default ViewSubject;
