import axios from 'axios';
import React, { useContext } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import AppContext from '../../Context/AppContext';
import { useParams } from 'react-router-dom';

const SubjectEditBtn = (props) => {
    const params = useParams();
    const MySwal = withReactContent(Swal);
    const ctx = useContext(AppContext);
    const subject = props.subject;

    const editSubject = () => {
        MySwal.fire({
            title: 'Edit Subject',
            html: `
                <input id="subject-name" class="swal2-input" placeholder="Enter Subject Name" value="${subject.name}">
                <select id="credit-hours" class="swal2-select">
                    <option value="">Select Credit Hours</option>
                    <option value="3" ${subject.creditHours === 3 && 'selected'}>3 Hours</option>
                    <option value="4" ${subject.creditHours === 4 && 'selected'}>4 Hours</option>
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
                    title: 'Updating Subject',
                    allowOutsideClick: false,
                    didOpen: () => {
                        MySwal.showLoading();
                        axios
                            .patch(
                                `${ctx.baseURL}/subjects/defaultSubjects/${subject._id}`,
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
                                props.subjectEdited(response.data.data.subject);
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
        <button className='btn btn-primary btn-sm mr-2' onClick={editSubject}>
            Edit
        </button>
    );
};

export default SubjectEditBtn;
