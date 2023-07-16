import axios from 'axios';
import React, { useRef, useState } from 'react';
import Form, { FormControl, FormField, FormGroup, FormLabelAlt } from '../../Utils/Form';

const DeleteBatchBtn = ({ ctx, MySwal, navigate, batchData, params, className }) => {
    const batchName = useRef();
    const [batchNameError, setBatchNameError] = useState('');
    const [btnState, setBtnState] = useState('');

    const [showConfimationModal, setShowConfirmationModal] = useState(false);
    const [showPostConfimationModal, setShowPostConfirmationModal] = useState(false);
    const [successModal, setSuccessModal] = useState({
        show: false,
        text: '',
    });
    const [errorModal, setErrorModal] = useState({ show: false, text: '' });

    const confirmationModalHandler = () => {
        setShowConfirmationModal(showConfimationModal !== true);
    };

    const postConfirmationModalHandler = () => {
        setShowConfirmationModal(false);
        setShowPostConfirmationModal(showPostConfimationModal !== true);
    };

    const successModalHandler = () => {
        navigate(-1, { replace: true });
    };

    const errorModalHandler = () => {
        setErrorModal({ show: false });
    };

    const deleteBatch = async () => {
        if (batchName.current.value === '') {
            setBatchNameError('Enter batch name');
            return;
        } else if (batchName.current.value !== 'Batch ' + batchData.name) {
            setBatchNameError('Batch name does not match');
            return;
        } else {
            setBatchNameError('');
        }
        setBtnState('btn-loading');
        await axios
            .delete(`${ctx.baseURL}/batches/${params.batchId}`, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                setShowPostConfirmationModal(false);
                setSuccessModal({
                    show: true,
                    text: 'Batch deleted successfully',
                });
            })
            .catch((error) => {
                setShowPostConfirmationModal(false);

                const errorMessage = ctx.computeError(error);
                setErrorModal({
                    show: true,
                    text: errorMessage,
                });
            });
        setBtnState('');
    };

    return (
        <>
            <button className={`${ctx.btnClasses} btn-error ${className} mt-2`} onClick={confirmationModalHandler}>
                Delete Batch
            </button>

            {showConfimationModal && (
                <>
                    <input className='modal-state' type='checkbox' defaultChecked={true} />
                    <div className='modal'>
                        <label className='modal-overlay'></label>
                        <div className='modal-content flex flex-col gap-5'>
                            <label
                                onClick={confirmationModalHandler}
                                className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
                            >
                                ✕
                            </label>
                            <h2 className='text-xl text-center font-medium'>Are you sure?</h2>
                            <span>This batch will be deleted permanently from database!</span>
                            <div className='flex gap-3'>
                                <label className='btn btn-error btn-block' onClick={postConfirmationModalHandler}>
                                    Delete Batch
                                </label>

                                <label className='btn btn-block' onClick={confirmationModalHandler}>
                                    Cancel
                                </label>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {showPostConfimationModal && (
                <>
                    <input className='modal-state' type='checkbox' defaultChecked={true} />
                    <div className='modal'>
                        <label className='modal-overlay'></label>
                        <div className='modal-content flex flex-col gap-5'>
                            {btnState === '' && (
                                <label
                                    onClick={postConfirmationModalHandler}
                                    className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
                                >
                                    ✕
                                </label>
                            )}
                            <h2 className='text-xl text-center font-medium'>Confirm Batch Name</h2>
                            <Form>
                                <FormGroup>
                                    <FormField>
                                        <FormField>Enter complete name of the batch to confirm</FormField>
                                        <FormControl>
                                            <input
                                                className={ctx.inputClasses}
                                                type='text'
                                                placeholder='Batch Name'
                                                ref={batchName}
                                            />
                                        </FormControl>
                                        {batchNameError !== '' && <FormLabelAlt>{batchNameError}</FormLabelAlt>}
                                    </FormField>
                                </FormGroup>
                            </Form>
                            <div className='flex gap-3'>
                                <button className={`btn btn-error btn-block ${btnState}`} onClick={deleteBatch}>
                                    Delete
                                </button>

                                {btnState === '' && (
                                    <label className='btn btn-block' onClick={postConfirmationModalHandler}>
                                        Cancel
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {successModal.show && (
                <>
                    <input className='modal-state' type='checkbox' defaultChecked={true} />
                    <div className='modal'>
                        <label className='modal-overlay'></label>
                        <div className='modal-content flex flex-col gap-5'>
                            {btnState === '' && (
                                <label
                                    onClick={errorModalHandler}
                                    className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
                                >
                                    ✕
                                </label>
                            )}
                            <div className='flex justify-center'>
                                <svg
                                    width='64'
                                    height='64'
                                    viewBox='0 0 48 48'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path
                                        fillRule='evenodd'
                                        clipRule='evenodd'
                                        d='M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM18.58 32.58L11.4 25.4C10.62 24.62 10.62 23.36 11.4 22.58C12.18 21.8 13.44 21.8 14.22 22.58L20 28.34L33.76 14.58C34.54 13.8 35.8 13.8 36.58 14.58C37.36 15.36 37.36 16.62 36.58 17.4L21.4 32.58C20.64 33.36 19.36 33.36 18.58 32.58Z'
                                        fill='#00BA34'
                                    />
                                </svg>
                            </div>
                            <h2 className='text-xl text-center font-medium'>{successModal.text}</h2>

                            <div className='flex justify-center'>
                                <button className={`btn btn-primary`} onClick={successModalHandler}>
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {errorModal.show && (
                <>
                    <input className='modal-state' type='checkbox' defaultChecked={true} />
                    <div className='modal'>
                        <label className='modal-overlay'></label>
                        <div className='modal-content flex flex-col gap-5'>
                            {btnState === '' && (
                                <label
                                    onClick={errorModalHandler}
                                    className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
                                >
                                    ✕
                                </label>
                            )}
                            <div className='flex justify-center'>
                                <svg
                                    width='48'
                                    height='48'
                                    viewBox='0 0 48 48'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path
                                        fillRule='evenodd'
                                        clipRule='evenodd'
                                        d='M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM24 26C22.9 26 22 25.1 22 24V16C22 14.9 22.9 14 24 14C25.1 14 26 14.9 26 16V24C26 25.1 25.1 26 24 26ZM26 34H22V30H26V34Z'
                                        fill='#E92C2C'
                                    />
                                </svg>
                            </div>
                            <h2 className='text-xl text-center font-medium'>{errorModal.text}</h2>

                            <div className='flex justify-center'>
                                <button className={`btn btn-primary`} onClick={errorModalHandler}>
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default DeleteBatchBtn;
