import axios from 'axios';
import React, { useContext, useState } from 'react';
import AppContext from '../../Context/AppContext';
import BackButton from '../../Utils/BackButton';

const AddBatch = () => {
    const [btnState, setBtnState] = useState('');
    const [batch, setBatch] = useState('');

    const ctx = useContext(AppContext);

    const batchNameHandler = (event) => {
        setBatch(event.target.value);
    };

    const submitForm = async (event) => {
        event.preventDefault();
        setBtnState('loading');
        let token = ctx.token;
        await axios
            .post(
                `${ctx.baseURL}/batches`,
                { name: batch },
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                }
            )
            .then((response) => {
                setBatch('');
                ctx.showSwal(1, 'Batch created successfully!');
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.data.error.code === 11000) ctx.showSwal(0, 'Batch already exists!');
                    else ctx.showSwal(0, error.response.data.message);
                } else ctx.showSwal(0, error.message);
            });
        setBtnState('');
    };

    return (
        <>
            <div className='add-batch'>
                <div className='md:p-2 text-xl text-neutral font-medium text-center md:flex-grow border-b-2'>
                    Add Batch
                </div>
                <div className='semesters mt-2 flex justify-center'>
                    <div className='rounded shadow-xl p-3 w-11/12 md:w-8/12 lg:w-3/5'>
                        <form className='font-medium w-full' onSubmit={submitForm}>
                            <div className='form-control'>
                                <input
                                    className={ctx.inputClasses}
                                    value={batch}
                                    type='number'
                                    onChange={(event) => batchNameHandler(event)}
                                    required
                                    placeholder='Enter batch no.'
                                    min='1'
                                />
                            </div>

                            <br />
                            <div className='form-control flex items-center'>
                                <button
                                    className={`btn btn-neutral w-fit rounded-lg btn-sm font-medium ${btnState}`}
                                    type='submit'
                                >
                                    Add Batch
                                </button>
                            </div>
                        </form>

                        <BackButton to='/admin/batches' text='Batch List' />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddBatch;
