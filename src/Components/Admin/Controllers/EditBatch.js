import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useOutletContext, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Message from '../../Main/Message';
import SubSectionHeader from '../../Utils/SubSectionHeader';

const EditBatch = (props) => {
    const [batchData, setBatchData] = useOutletContext();
    const [btnState, setBtnState] = useState();
    const params = useParams();
    const batchName = useRef();
    const archived = useRef();
    const [alert, setAlert] = useState({
        show: false,
    });
    const ctx = useContext(AppContext);
    const submitForm = async (event) => {
        event.preventDefault();
        setBtnState('loading');
        const batchData = {
            name: batchName.current.value,
            archived: archived.current.value === 'True',
        };
        const baseURL = 'https://amsapi.vercel.app/admin/batch/' + params.batchId;

        await axios
            .patch(`${baseURL}`, batchData, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                setBatchData(response.data.data.batch);
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Edited Successfully',
                    showBtn: true,
                });
            })
            .catch((error) => {
                console.log(error);
            });
        setBtnState('');
    };

    const generateCode = async () => {
        const baseURL = 'https://amsapi.vercel.app/admin/batch/' + params.batchId + '/updatecode';

        await axios
            .get(`${baseURL}`, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                setBatchData({ ...batchData, batchCode: response.data.data.batch.batchCode });
            })
            .catch((error) => {
                console.log(error);
            });
        setBtnState('');
    };

    return (
        <div className='flex-grow'>
            <SubSectionHeader text='Edit Batch' />
            {batchData.name && (
                <div className='flex justify-center'>
                    <div className='rounded shadow-xl p-3 w-11/12 md:w-8/12 lg:w-3/5'>
                        <form className='font-medium w-full' onSubmit={submitForm}>
                            <div className='form-control'>
                                <label className='label'>Batch Name</label>
                                <input
                                    className='input w-full input-bordered input-sm md:input-md'
                                    type='text'
                                    ref={batchName}
                                    required
                                    defaultValue={batchData.name}
                                ></input>
                            </div>
                            <br />
                            <div>
                                <label className='label'>Batch Code</label>

                                <div className='flex justify-between items-center border border-solid rounded-lg border-base-300'>
                                    <p className='text-primary pl-4'>{batchData.batchCode || '...'}</p>
                                    <p onClick={generateCode} className='btn btn-primary btn-sm md:btn-md'>
                                        Regenerate
                                    </p>
                                </div>
                            </div>
                            <label className='label'>
                                <span className='label-text-alt'></span>
                                <span className='label-text-alt'>Regenerate if all students have signed up</span>
                            </label>
                            <br />
                            <div className='flex justify-between items-center border border-solid rounded-lg border-base-300'>
                                <p className='pl-4'>Archived</p>
                                <div className='form-control'>
                                    <select
                                        className='select select-bordered select-sm md:select-md'
                                        defaultValue={batchData.archived ? 'True' : 'False'}
                                        ref={archived}
                                        required
                                    >
                                        <option>True</option>
                                        <option>False</option>
                                    </select>
                                </div>
                            </div>
                            <label className='label'>
                                <span className='label-text-alt'></span>
                                <span className='label-text-alt'>If a batch is graduated, set it to True</span>
                            </label>
                            <br />

                            <div className='form-control'>
                                <button
                                    className={` btn btn-primary w-full font-bold btn-sm md:btn-md ${btnState}`}
                                    type='submit'
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                        {alert.show === true && (
                            <div className='my-2'>
                                <Message
                                    type={alert.type}
                                    text={alert.message}
                                    showBtn={alert.showBtn}
                                    hideAlert={() => {
                                        setAlert({ show: false });
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditBatch;
