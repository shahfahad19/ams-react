import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Message from '../../Main/Message';
import ListTitleBar, { ListTitle, ListTitleButton } from '../../Utils/ListTitleBar';
import Table from '../../Utils/Table';

const BatchList = (props) => {
    const [batches, setBatches] = useState([]);
    const [loading, isLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const ctx = useContext(AppContext);

    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/batches?sort=archived,name`, {
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
                console.log(error);
            });
    }, []);

    return (
        <div className='batches'>
            <ListTitleBar>
                <ListTitle text='Batch List' />
                <ListTitleButton to='add-batch' />
            </ListTitleBar>

            <Table loading={loading} error={errorMessage}>
                <thead>
                    <tr>
                        <th></th>
                        <th className='normal-case font-medium text-sm'>Name</th>
                        <th className='normal-case font-medium text-sm'>Archived</th>
                    </tr>
                </thead>
                <tbody>
                    {batches.length > 0 &&
                        batches.map((batch, index) => {
                            return (
                                <tr key={index}>
                                    <th>{index + 1}</th>
                                    <td>
                                        <Link to={`/admin/batch/${batch._id}/semesters`} key={batch._id}>
                                            Batch {batch.name}
                                        </Link>
                                    </td>
                                    <td>{`${batch.archived.toString().slice(0, 1).toUpperCase()}${batch.archived
                                        .toString()
                                        .slice(1)}`}</td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        </div>
    );
};

export default BatchList;
