import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Message from '../../Main/Message';
import SubSectionHeader from '../../Utils/SubSectionHeader';

const BatchList = () => {
    const [semesters, setSemesters] = useState([]);
    const [showAlert, setAlert] = useState(false);
    const ctx = useContext(AppContext);

    const params = useParams();
    useEffect(() => {
        const baseURL = 'http://localhost:5000/admin/batch/' + params.batchId + '/semesters';
        console.log(params.batchId);
        axios
            .get(`${baseURL}`, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                setSemesters(response.data.data.semesters);
                console.log(response.data.data.semesters);
                if (response.data.data.semesters.length === 0) setAlert(true);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    return (
        <div className='flex-grow'>
            <SubSectionHeader text='Semester List' />

            <div className='overflow-x-auto'>
                <table className='table table-compact w-full md:table-normal'>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Name</th>
                            <th>Subjects</th>
                            <th>Archived</th>
                        </tr>
                    </thead>
                    <tbody>
                        {semesters.length > 0 &&
                            semesters.map((semester, index) => {
                                return (
                                    <tr key={index}>
                                        <th>{index + 1}</th>
                                        <td>
                                            <Link to={`/admin/semester/${semester._id}/subjects`}>{semester.name}</Link>
                                        </td>
                                        <td>
                                            <Link to={`/admin/semester/${semester._id}?i=subjects`}>
                                                {semester.subjects || 0}
                                            </Link>
                                        </td>
                                        <td>{`${semester.archived
                                            .toString()
                                            .slice(0, 1)
                                            .toUpperCase()}${semester.archived.toString().slice(1)}`}</td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
                {showAlert && (
                    <Message
                        type='warning'
                        text="You haven't added any semesters for this batch"
                        hideAlert={() => {
                            setAlert(false);
                        }}
                        showBtn={true}
                    />
                )}
            </div>
        </div>
    );
};

export default BatchList;
