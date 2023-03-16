import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
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
        await axios
            .patch(`${ctx.baseURL}/batches/${params.batchId}`, batchData, {
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
                if (error.response.data.error.code === 11000)
                    setAlert({
                        show: true,
                        type: 'error',
                        message: 'A batch with this name already exists',
                        showBtn: true,
                    });
                else
                    setAlert({
                        show: true,
                        type: 'error',
                        message: error.message,
                        showBtn: true,
                    });
            });
        setBtnState('');
    };

    const generateCode = async () => {
        await axios
            .get(`${ctx.baseURL}/batches/${params.batchId}/updatecode`, {
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
                                    className={ctx.inputClasses}
                                    type='text'
                                    ref={batchName}
                                    required
                                    defaultValue={batchData.name}
                                ></input>
                            </div>
                            <br />
                            <div>
                                <label className='label'>Batch Code</label>

                                <div className='flex justify-between items-center border border-solid rounded-full border-base-300'>
                                    <p className='text-primary pl-4'>{batchData.batchCode || '...'}</p>
                                    <p onClick={generateCode} className='btn btn-neutral rounded-full btn-sm md:btn-md'>
                                        Regenerate
                                    </p>
                                </div>
                            </div>
                            <label className='label'>
                                <span className='label-text-alt'></span>
                                <span className='label-text-alt'>Regenerate if all students have signed up</span>
                            </label>
                            <br />
                            <div className='flex justify-between items-center border border-solid rounded-full border-base-300'>
                                <p className='pl-4'>Archived</p>
                                <div className='form-control'>
                                    <select
                                        className='select select-bordered rounded-full select-sm md:select-md'
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

                            <div className='form-control flex items-center'>
                                <button className={`${ctx.btnClasses} ${btnState}`} type='submit'>
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
