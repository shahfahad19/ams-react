import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import SemesterDeleteBtn from './DeleteSemesterBtn';
import Form, {
    FormControl,
    FormField,
    FormGroup,
    FormLabel,
    FormLabelAlt,
    FormTitle,
    FormWrapper,
} from '../../Utils/Form';
import DeleteSemesterBtn from './DeleteSemesterBtn';
import Alert from '../../Utils/Alert';

const EditSemester = () => {
    const navigate = useNavigate();
    const [btnState, setBtnState] = useState();
    const [semester, setSemester] = useOutletContext();
    const params = useParams();
    const semesterName = useRef();
    const archived = useRef();
    const ctx = useContext(AppContext);
    const [semesterError, setSemesterError] = useState('');
    const [alert, setAlert] = useState({ show: false });

    const semesterNameHandler = (event) => {
        if (semesterName.current.value === '') setSemesterError('Semester name required');
        else setSemesterError('');
    };

    const submitForm = async (event) => {
        event.preventDefault();
        if (semesterName.current.value === '') {
            setSemesterError('Semester name required');
            return;
        } else setSemesterError('');

        console.log(semester.name, parseInt(semesterName.current.value));
        console.log(archived.current.value.toString(), semester.archived);
        if (semesterName.current.value === parseInt(semester.name) && archived.current.value === semester.archived) {
            setAlert({ show: true, type: 'error', text: 'No change detected' });
        }
        setBtnState('btn-loading');
        const semesterData = {
            name: semesterName.current.value,
            archived: archived.current.value === 'True',
        };
        setAlert({ show: false });

        await axios
            .patch(`${ctx.baseURL}/semesters/${params.semesterId}`, semesterData, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                setSemester(response.data.data.semester);
                setAlert({
                    show: true,
                    type: 'success',
                    text: 'Semester updated successfully',
                });
            })
            .catch((error) => {
                let errorMessage = error.message;
                if (error.response) {
                    if (error.response.data.error.code === 11000) errorMessage = 'Semester already exists';
                    else errorMessage = error.response.data.message;
                }
                setAlert({
                    show: true,
                    type: 'error',
                    text: errorMessage,
                });
            });
        setBtnState('');
    };

    return (
        <>
            {semester.name && (
                <FormWrapper>
                    <Form onSubmit={submitForm}>
                        <FormTitle>Edit Semester</FormTitle>
                        <FormGroup>
                            <FormField>
                                <FormLabel>Semester</FormLabel>
                                <FormControl>
                                    <select
                                        className={`${ctx.selectClasses} ${semesterError === '' ? '' : 'select-error'}`}
                                        ref={semesterName}
                                        defaultValue={semester.name}
                                        onChange={semesterNameHandler}
                                    >
                                        <option value=''>Select</option>
                                        <option value='1'>1</option>
                                        <option value='2'>2</option>
                                        <option value='3'>3</option>
                                        <option value='4'>4</option>
                                        <option value='5'>5</option>
                                        <option value='6'>6</option>
                                        <option value='7'>7</option>
                                        <option value='8'>8</option>
                                    </select>
                                </FormControl>
                                {semesterError !== '' && <FormLabelAlt>{semesterError}</FormLabelAlt>}
                            </FormField>
                            <FormField>
                                <FormLabel>Archived</FormLabel>
                                <FormControl>
                                    <select
                                        className={ctx.selectClasses}
                                        defaultValue={semester.archived ? true : false}
                                        ref={archived}
                                        required
                                    >
                                        <option value={true}>True</option>
                                        <option value={false}>False</option>
                                    </select>
                                </FormControl>
                            </FormField>

                            <div className='flex space-x-2'>
                                <button className={`${ctx.btnClasses} ${btnState} flex-grow`} type='submit'>
                                    Update
                                </button>

                                <DeleteSemesterBtn
                                    className={'w-full sm:w-60'}
                                    ctx={ctx}
                                    params={params}
                                    navigate={navigate}
                                    semester={semester}
                                />
                            </div>
                        </FormGroup>
                    </Form>
                    <Alert
                        alert={alert}
                        closeAlert={() => {
                            setAlert({ show: false });
                        }}
                    />
                </FormWrapper>
            )}
        </>
    );
};

export default EditSemester;
