import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import AppContext from '../Context/AppContext';
import DepartmentName from '../Admin/Components/DepartmentName';
import { BreadCrumb, BreadCrumbs } from '../Utils/BreadCrumbs';
import {
    FormControl,
    FormField,
    FormGroup,
    FormLabel,
    FormLabelAlt,
    FormSubmitBtn,
    FormTitle,
    FormWrapper,
} from '../Utils/Form';
import Alert from '../Utils/Alert';
import BackButton from '../Utils/BackButton';
const AddBatch = () => {
    const [btnState, setBtnState] = useState('');
    const batch = useRef();

    const ctx = useContext(AppContext);
    const [formError, setFormError] = useState('');
    const [alert, setAlert] = useState({ show: false });

    const batchNameHandler = (event) => {
        let batchName = batch.current.value;
        if (batchName === '') {
            setFormError('Batch no. required');
        } else if (batchName < 0 || batchName > 999) {
            setFormError('Batch name is invalid');
        } else {
            setFormError('');
        }
    };

    const submitForm = async (event) => {
        event.preventDefault();
        let batchName = batch.current.value;

        if (batchName === '') {
            setFormError('Batch no. required');
            return;
        } else if (batchName < 0 || batchName > 999) {
            setFormError('Batch name is invalid');
            return;
        } else {
            setFormError('');
        }
        setBtnState('btn-loading');
        setAlert({ show: false });
        let token = ctx.token;
        await axios
            .post(
                `${ctx.baseURL}/batches`,
                { name: batchName },
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                }
            )
            .then((response) => {
                batch.current.value = '';
                setAlert({
                    show: true,
                    type: 'success',
                    text: 'Batch added successfully',
                });
            })
            .catch((error) => {
                let errorMessage = error.message;
                if (error.response) {
                    if (error.response.data.error.code === 11000) errorMessage = 'Batch already exists';
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
            <DepartmentName name={ctx.userData.name} />
            <BreadCrumbs>
                <BreadCrumb to='/'>Home</BreadCrumb>
                <BreadCrumb to='../batches'>Batches</BreadCrumb>
                <BreadCrumb>Add Batch</BreadCrumb>
            </BreadCrumbs>
            <FormWrapper>
                <form className='font-medium w-full' onSubmit={submitForm}>
                    <FormTitle>Add Batch</FormTitle>
                    <FormGroup>
                        <FormField>
                            <FormLabel>Batch No.</FormLabel>
                            <FormControl>
                                <input
                                    className={`${ctx.inputClasses} ${formError === '' ? '' : 'input-error'}`}
                                    type='number'
                                    ref={batch}
                                    onChange={batchNameHandler}
                                    placeholder='Enter batch no.'
                                    min='1'
                                />
                            </FormControl>
                            {formError !== '' && <FormLabelAlt>{formError}</FormLabelAlt>}
                        </FormField>
                        <FormSubmitBtn className={btnState}>Add Batch</FormSubmitBtn>
                    </FormGroup>
                </form>
                <Alert alert={alert} closeAlert={() => setAlert({ show: false })} />

                <BackButton to='/admin/batches' text='Batch List' />
            </FormWrapper>
        </>
    );
};

export default AddBatch;
