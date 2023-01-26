import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Menu, { MenuItem, MenuItems } from '../../Utils/Menu';
import SideBarTitle from '../../Utils/SideBarTitle';

const ViewSemester = (props) => {
    const params = useParams();
    const ctx = useContext(AppContext);
    const [semester, setSemester] = useState({
        name: '',
        batch: { name: '' },
    });

    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/semesters/${params.semesterId}`, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                setSemester(response.data.data.semester);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <>
            <div className='batch flex flex-col md:flex-row'>
                <div className='batch-info w-auto flex flex-col space-y-1 shadow-md rounded-xl p-2 md:p-0 md:shadow-none border border-solid md:border-none mb-5 md:mb-0'>
                    <SideBarTitle title={semester.batch.name + ' - ' + semester.name} />
                    <Menu>
                        <MenuItems>
                            <MenuItem text='Subjects' tab='subjects' />
                            <MenuItem text='Add Subject' tab='add-subject' />
                            <MenuItem text='Edit Semester' tab='edit' />
                        </MenuItems>
                    </Menu>
                </div>
                <Outlet context={[semester, setSemester]} />
            </div>
        </>
    );
};

export default ViewSemester;
