import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import Table from '../../Utils/Table';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import SubjectDeleteBtn from './SubjectDeleteBtn';
import SubjectEditBtn from './SubjectEditBtn';

const DefaultSubjectList = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, isLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const ctx = useContext(AppContext);
    const MySwal = withReactContent(Swal);
    const [newSubject, setNewSubject] = useState();

    const params = useParams();
    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/subjects/defaultSubjects?department=${params.departmentId}&sort=name`, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                setErrorMessage('');
                isLoading(false);
                setSubjects(response.data.data.subjects);
                if (response.data.data.subjects.length === 0) setErrorMessage('No subjects found');
            })
            .catch((error) => {
                if (error.response) setErrorMessage(error.response.data.message);
                else setErrorMessage(error.message);
                isLoading(false);
                console.log(error);
            });
    }, [newSubject]);

    const addSubject = () => {
        MySwal.fire({
            title: 'Add Subject',
            html: `
                <input id="subject-name" className="swal2-input" placeholder="Enter Subject Name">
                <select id="credit-hours" className="swal2-select">
                    <option value="">Select Credit Hours</option>
                    <option value="3">3 Hours</option>
                    <option value="4">4 Hours</option>
                </select>
            `,
            showCancelButton: true,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true, // Show loading spinner

            preConfirm: () => {
                const subjectName = document.getElementById('subject-name').value;
                const creditHours = document.getElementById('credit-hours').value;

                // Check if fields are not selected
                if (!subjectName || !creditHours) {
                    let errMsg = '';
                    if (!subjectName && !creditHours) errMsg = 'Enter subject name and select credit hours';
                    else if (!subjectName) errMsg = 'Enter subject name';
                    else if (!creditHours) errMsg = 'Select credit hours';
                    Swal.showValidationMessage(errMsg);
                    return false; // Prevent closing the modal
                }

                return { subjectName, creditHours };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                const { subjectName, creditHours } = result.value;

                MySwal.fire({
                    title: 'Adding Subject',
                    allowOutsideClick: false,
                    didOpen: () => {
                        MySwal.showLoading();
                        axios
                            .post(
                                `${ctx.baseURL}/subjects/defaultSubjects`,
                                {
                                    name: subjectName,
                                    creditHours: creditHours,
                                    department: params.departmentId,
                                },
                                {
                                    credentials: 'include',
                                    headers: {
                                        Authorization: 'Bearer ' + ctx.token,
                                    },
                                }
                            )
                            .then((response) => {
                                // Request succeeded, show success message
                                MySwal.close();

                                Swal.fire({
                                    icon: 'success',
                                    title: 'Success',
                                    text: 'Subject added successfully',
                                });
                                setNewSubject(response.data.data.subject);
                            })
                            .catch((error) => {
                                // Request failed, show error message
                                MySwal.close();

                                let errorMessage = '';
                                if (!error.response) {
                                    errorMessage = error.message;
                                } else {
                                    if (error.response.data.error.code === 11000) {
                                        errorMessage = 'This subject already exists in this department';
                                    } else {
                                        errorMessage = error.response.data.message;
                                    }
                                }
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: errorMessage,
                                });
                            });
                    },
                });
            }
        });
    };

    return (
        <div className='flex-grow'>
            <div className='md:p-2 text-xl font-medium text-center md:flex-grow border-b-2 mb-3 flex justify-between'>
                <div className='flex-grow text-center'>Subject List</div>
                <button onClick={addSubject} className='btn rounded btn-xs btn-neutral mr-1'>
                    Add Subject
                </button>
            </div>
            <Table loading={loading} error={errorMessage}>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Name</th>
                        <th>Credit Hours</th>
                        <th className='text-center'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.length > 0 &&
                        subjects.map((subject, index) => {
                            return (
                                <tr key={index}>
                                    <th>{index + 1}</th>
                                    <td>
                                        <Link
                                            className='underline underline-offset-2'
                                            to={`/${ctx.userData.role}/subject/${subject._id}/attendance`}
                                        >
                                            {subject.name}
                                        </Link>
                                    </td>
                                    <td>{subject.creditHours}</td>
                                    <td>
                                        <SubjectEditBtn subject={subject} subjectEdited={setNewSubject} />
                                        <SubjectDeleteBtn subject={subject} subjectDeleted={setNewSubject} />
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        </div>
    );
};

export default DefaultSubjectList;
