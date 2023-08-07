import React, { useContext, useState } from 'react';
import AppContext from '../../Context/AppContext';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import axios from 'axios';
import Message from '../../Main/Message';
import DepartmentDeleteBtn from './DepartmentDeleteBtn';
import { SpinnerWithText } from '../../Utils/Spinner';
import { FormWrapper } from '../../Utils/Form';

const DepartmentInfo = () => {
    const ctx = useContext(AppContext);
    const params = useParams();
    const [department, setDepartment] = useOutletContext();
    const navigate = useNavigate();

    const MySwal = withReactContent(Swal);

    const changeAdmin = () => {
        MySwal.fire({
            title: 'Enter new email',
            input: 'email',
            inputPlaceholder: 'name@example.com',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true, // Display loading indicator
            preConfirm: async (email) => {
                try {
                    const response = await axios.patch(
                        `${ctx.baseURL}/users/department/${params.departmentId}/updateEmail`,
                        { email },
                        {
                            credentials: 'include',
                            headers: {
                                Authorization: 'Bearer ' + ctx.token,
                            },
                        }
                    );
                    return response.data; // Return response data to be displayed
                } catch (error) {
                    // Handle error condition
                    if (error.response) {
                        if (error.response.data.error.code === 11000) throw new Error('Email already in use');
                        else throw new Error(error.response.data.message);
                    } else {
                        throw new Error(error.message);
                    }
                }
            },
        })
            .then((result) => {
                setDepartment(result.value.data.user);
                if (result.isConfirmed) {
                    MySwal.fire({
                        title: 'Success',
                        text: 'Updated successfully',
                        icon: 'success',
                    });
                }
            })
            .catch((error) => {
                // Handle error if preConfirm function throws an error
                MySwal.fire({
                    title: 'Error',
                    text: error,
                    icon: 'error',
                });
            });
    };

    return (
        <>
            {department.name && (
                <FormWrapper>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th colSpan={2} className='font-medium text-center'>
                                    Department
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th className='font-medium'>Department</th>
                                <td>{department.department}</td>
                            </tr>
                            <tr>
                                <th className='font-medium'>Admin</th>
                                <td>
                                    <div className='flex space-x-4 items-center'>
                                        <div className='h-full'>{department.name}</div>

                                        <div>
                                            <label tabIndex={0} className='avatar select-none'>
                                                <div className='w-10 rounded-full'>
                                                    <img src={department.photo} alt='profile_pic' />
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th className='font-medium'>Email</th>
                                <td>{department.email}</td>
                            </tr>
                            <tr>
                                <th className='font-medium'>Approved</th>
                                <td>{department.approved.toString()}</td>
                            </tr>
                        </tbody>
                    </table>
                    <button className='btn btn-block btn-secondary mt-1' onClick={changeAdmin}>
                        Change Admin
                    </button>
                    <DepartmentDeleteBtn
                        department={department}
                        navigate={navigate}
                        params={params}
                        ctx={ctx}
                        MySwal={MySwal}
                    />
                </FormWrapper>
            )}

            {!department.name && <SpinnerWithText>Fetching department info...</SpinnerWithText>}
        </>
    );
};

export default DepartmentInfo;
