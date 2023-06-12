import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Message from '../../Main/Message';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const RemoveSubject = (props) => {
    const [subject, setSubject] = useOutletContext();
    const params = useParams();
    const MySwal = withReactContent(Swal);

    const ctx = useContext(AppContext);

    const removeSubjectConfirmation = () => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                MySwal.fire({
                    title: 'Removing subject',
                    allowOutsideClick: false,
                    didOpen: () => {
                        MySwal.showLoading();

                        // axios req
                        axios
                            .patch(
                                `${ctx.baseURL}/subjects/remove/teacher-subjects/${subject._id}`,
                                {
                                    subject: subject.Id,
                                },
                                {
                                    credentials: 'include',
                                    headers: {
                                        Authorization: 'Bearer ' + ctx.token,
                                    },
                                }
                            )
                            .then((response) => {
                                MySwal.close();

                                MySwal.fire({
                                    icon: 'success',
                                    title: 'Removed!',
                                    message: 'Removed successfully',
                                    showConfirmButton: true,
                                }).then(() => {
                                    window.location.assign('/teacher');
                                });
                            })
                            .catch((error) => {
                                console.log(error);
                                MySwal.close();

                                if (error.response) {
                                    MySwal.fire({
                                        icon: 'error',
                                        title: 'Something went wrong!',
                                        message: error.response.data.message,
                                        showConfirmButton: true,
                                        confirmButtonText: 'Ok',
                                    });
                                } else {
                                    MySwal.fire({
                                        icon: 'error',
                                        title: 'Something went wrong!',
                                        message: error.message,
                                        showConfirmButton: true,
                                        confirmButtonText: 'Ok',
                                    });
                                }
                            });
                    },
                });
            }
        });
    };

    return (
        <div className='flex-grow'>
            <SubSectionHeader text='Remove Subject' />
            <div className='flex justify-center text-center'>
                <div className='rounded-lg mt-10 shadow-xl w-11/12 md:w-8/12 lg:w-3/5 p-6'>
                    {subject.name && (
                        <>
                            <p className='text-xl'>Click following button to remove this subject from list.</p>
                            <p className='text-lg text-error p-5'>Note: You cannot reverse this action.</p>
                            <div className='text-center'>
                                <button className='btn btn-error' onClick={removeSubjectConfirmation}>
                                    Remove
                                </button>
                            </div>
                        </>
                    )}
                    {!subject.name && (
                        <div className='text-center'>
                            <div className='loader inline-block'></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RemoveSubject;
