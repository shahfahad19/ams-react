import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Message from '../../Main/Message';
import Table from '../../Utils/Table';

const BatchList = (props) => {
    const [batches, setBatches] = useState([]);
    const [showAlert, setAlert] = useState(false);
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
                setBatches(response.data.data.batches);
                if (response.data.data.batches.length === 0) {
                    setAlert(true);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const hideAlert = () => {
        setAlert(false);
    };

    return (
        <div className='batches'>
            <div className='flex justify-between items-center p-2 bg-primary'>
                <h1 className='font-medium text-center text-primary-content text-xl'>Batch List</h1>
                <div>
                    <Link className='btn btn-outline text-primary-content btn-xs sm:btn-sm' to='add-batch'>
                        Add New Batch
                    </Link>
                </div>
            </div>

            <Table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Archived</th>
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
                                            {batch.name}
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
            {showAlert && (
                <Message type='error' text="You haven't added any batches yet" hideAlert={hideAlert} showBtn={true} />
            )}
        </div>
    );
};

export default BatchList;
