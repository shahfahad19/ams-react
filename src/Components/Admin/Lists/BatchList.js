import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Table from '../../Utils/Table';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import TickMark from '../../Utils/TickMark';
import CrossMark from '../../Utils/CrossMark';

const BatchList = (props) => {
    const params = useParams();
    const [batches, setBatches] = useState([]);
    const [loading, isLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const ctx = useContext(AppContext);

    useEffect(() => {
        let url = `${ctx.baseURL}/batches`;
        if (params.departmentId != undefined && ctx.userData.role === 'super-admin') {
            url = `${ctx.baseURL}/batches?dept=${params.departmentId}`;
        }
        axios
            .get(url, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                setErrorMessage('');
                isLoading(false);
                setBatches(response.data.data.batches);
                if (response.data.data.batches.length === 0) {
                    setErrorMessage('No batches found');
                }
            })
            .catch((error) => {
                if (error.response) setErrorMessage(error.response.data.message);
                else setErrorMessage(error.message);
                isLoading(false);
            });
    }, []);

    return (
        <div className='flex-grow'>
            <SubSectionHeader text='Batch List' showBtn={true} btnLink='/admin/add-batch' btnText='Add Batch' />

            <Table loading={loading} error={errorMessage}>
                <thead>
                    <tr>
                        <th></th>
                        <th className='normal-case font-medium text-sm'>Name</th>
                        <th className='normal-case font-medium text-sm'>Active</th>
                    </tr>
                </thead>
                <tbody>
                    {batches.length > 0 &&
                        batches.map((batch, index) => {
                            return (
                                <tr key={index}>
                                    <th>{index + 1}</th>
                                    <td>
                                        <Link to={`/${ctx.userData.role}/batch/${batch._id}/semesters`} key={batch._id}>
                                            Batch {batch.name}
                                        </Link>
                                    </td>
                                    <td>
                                        {!batch.archived && <TickMark />}
                                        {batch.archived && <CrossMark />}
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        </div>
    );
};

export default BatchList;
