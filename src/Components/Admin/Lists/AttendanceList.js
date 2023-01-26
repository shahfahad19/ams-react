import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Message from '../../Main/Message';
import SubSectionHeader from '../../Utils/SubSectionHeader';

const AttendanceList = () => {
    const [attendances, setAttendances] = useState([]);
    const [showAlert, setAlert] = useState(false);
    const ctx = useContext(AppContext);

    const params = useParams();
    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/attendances/subject/${params.subjectId}`, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                setAttendances(response.data.data.attendances);
                if (response.data.data.attendances.length === 0) setAlert(true);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    return (
        <div className='flex-grow'>
            <SubSectionHeader text='Attendance List' />

            <div className='overflow-x-auto'>
                <table className='table table-compact w-full md:table-normal'>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Date</th>
                            <th>Present</th>
                            <th>Absent</th>
                            <th>Leave</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendances.length > 0 &&
                            attendances.map((attendance, index) => {
                                return (
                                    <tr key={index}>
                                        <th>{index + 1}</th>
                                        <td>
                                            <Link to={`/admin/attendance/${attendance._id}`}>{attendance.date}</Link>
                                        </td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0</td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
                {showAlert && (
                    <Message
                        type='warning'
                        text='No attendance has been recorded for this subject yet'
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

export default AttendanceList;
