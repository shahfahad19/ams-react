import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Message from '../../Main/Message';
import SubSectionHeader from '../../Utils/SubSectionHeader';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [showAlert, setAlert] = useState(false);
    const ctx = useContext(AppContext);

    const params = useParams();
    useEffect(() => {
        console.log(params.batchId);
        axios
            .get(`${ctx.baseURL}/students/batch/${params.batchId}`, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                setStudents(response.data.data.students);
                if (response.data.data.students.length === 0) setAlert(true);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    return (
        <div className='flex-grow'>
            <SubSectionHeader text='Student List' />

            <div className='overflow-x-auto'>
                <table className='table w-full'>
                    <thead>
                        <tr>
                            <th>Roll No.</th>
                            <th>Name</th>
                            <th>Active</th>
                            <th>Account Confirmed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length > 0 &&
                            students.map((student, index) => {
                                return (
                                    <tr key={index}>
                                        <th>{student.rollNo}</th>
                                        <td>
                                            <Link to={`/admin/student/${student._id}/info`}>{student.name}</Link>
                                        </td>
                                        <td>{`${student.active.toString().slice(0, 1).toUpperCase()}${student.active
                                            .toString()
                                            .slice(1)}`}</td>
                                        <td>{`${student.confirmed
                                            .toString()
                                            .slice(0, 1)
                                            .toUpperCase()}${student.confirmed.toString().slice(1)}`}</td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
                {showAlert && (
                    <Message
                        type='warning'
                        text='No students have signed up for this batch yet'
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

export default StudentList;
