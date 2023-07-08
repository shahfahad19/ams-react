import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Message from '../../Main/Message';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const EditBatch = (props) => {
    const [batchData, setBatchData] = useOutletContext();
    const [btnState, setBtnState] = useState();
    const params = useParams();
    const batchName = useRef();
    const archived = useRef();
    const [alert, setAlert] = useState({
        show: false,
    });
    const MySwal = withReactContent(Swal);

    const navigate = useNavigate();
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
                        message: error.response.data.message,
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

    const deleteBatch = () => {
        MySwal.fire({
            html: `
                <div class="swal2-title">Are you sure?</div>
                <div class="swal2-content">This batch, its semesters, its subjects and its attendances will be deleted permanently from the database.
                <br/>
                <span class="text-info">If you want to keep this batch, archive it instead!</span></div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                MySwal.fire({
                    title: 'Add Subject',
                    html: `
                    <div class="swal2-content">Confirm Batch Name</div>
                <input id="batch-name" class="swal2-input" placeholder="Batch Name">
            `,
                    showCancelButton: true,
                    confirmButtonText: 'Submit',
                    showLoaderOnConfirm: true, // Show loading spinner

                    preConfirm: () => {
                        const batchName = document.getElementById('batch-name').value;

                        // Check if fields are not selected
                        if (!batchName) {
                            Swal.showValidationMessage('Enter semester name');
                            return false; // Prevent closing the modal
                        } else if (batchName !== 'Batch ' + batchData.name) {
                            Swal.showValidationMessage(
                                'Batch name does not match, make sure you are deleting the intended batch!'
                            );
                            return false; // Prevent closing the modal
                        }

                        return { batchName };
                    },
                }).then((result) => {
                    if (result.isConfirmed) {
                        MySwal.fire({
                            title: 'Deleting Batch',
                            allowOutsideClick: false,
                            didOpen: () => {
                                MySwal.showLoading();

                                // axios req
                                axios
                                    .delete(`${ctx.baseURL}/batches/${params.batchId}`, {
                                        credentials: 'include',
                                        headers: {
                                            Authorization: 'Bearer ' + ctx.token,
                                        },
                                    })
                                    .then((response) => {
                                        MySwal.close();

                                        MySwal.fire({
                                            icon: 'success',
                                            title: 'Deleted!',
                                            text: 'Batch Deleted successfully',
                                            showConfirmButton: true,
                                        }).then(() => {
                                            navigate(-1, { replace: true });
                                        });
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                        MySwal.close();

                                        if (error.response) {
                                            MySwal.fire({
                                                icon: 'error',
                                                title: 'Something went wrong!',
                                                text: error.response.data.message,
                                                showConfirmButton: true,
                                                confirmButtonText: 'Ok',
                                            });
                                        } else {
                                            MySwal.fire({
                                                icon: 'error',
                                                title: 'Something went wrong!',
                                                text: error.message,
                                                showConfirmButton: true,
                                                confirmButtonText: 'Ok',
                                            });
                                        }
                                    });
                            },
                        });
                    }
                });
            }
        });
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
                                    defaultValue={batchData.name}
                                    ref={batchName}
                                    type='number'
                                    required
                                    placeholder='Enter batch no.'
                                    min='1'
                                />
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
                        <div className='form-control flex items-center flex-row justify-center mt-3'>
                            <button className={`${ctx.btnClasses} btn-error`} onClick={deleteBatch}>
                                Delete Batch
                            </button>
                        </div>
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
