import React, { useContext } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import SubjectDeleteBtn from './DeleteSubjectBtn';
import { FormField, FormLabel, FormTitle, FormWrapper } from '../../Utils/Form';
import Spinner from '../../Utils/Spinner';

const EditSubject = (props) => {
    const navigate = useNavigate();
    const [subject, setSubject] = useOutletContext();
    const params = useParams();
    const ctx = useContext(AppContext);

    return (
        <>
            {subject.name && (
                <FormWrapper>
                    <FormTitle>Edit Subject</FormTitle>
                    <FormField>
                        <FormLabel>Subject Name</FormLabel>
                        <input className={ctx.inputClasses} type='text' disabled defaultValue={subject.name}></input>
                        <label className='form-label-alt'>Subject name can't be edited</label>
                    </FormField>

                    <div className='form-control flex items-center flex-row justify-center mt-3'>
                        <SubjectDeleteBtn ctx={ctx} params={params} subject={subject} navigate={navigate} />
                    </div>
                </FormWrapper>
            )}

            {!subject.name && (
                <div className='flex justify-center items-center h-52'>
                    <Spinner className='spinner-sm' /> <span className='ml-2'>Fetching subject info</span>
                </div>
            )}
        </>
    );
};

export default EditSubject;
