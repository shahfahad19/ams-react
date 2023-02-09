import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Message from '../../Main/Message';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import Table from '../../Utils/Table';

const BatchList = () => {
    const [semesters, setSemesters] = useState([]);
    const [showAlert, setAlert] = useState(false);
    const ctx = useContext(AppContext);

    const params = useParams();
    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/semesters?batch=${params.batchId}`, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                setSemesters(response.data.data.semesters);
                if (response.data.data.semesters.length === 0) setAlert(true);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    return (
        <div className='flex-grow'>
            <SubSectionHeader text='Semester List' />

            <Table>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Name</th>
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
                                    <td>{`${semester.archived.toString().slice(0, 1).toUpperCase()}${semester.archived
                                        .toString()
                                        .slice(1)}`}</td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
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
    );
};

export default BatchList;
