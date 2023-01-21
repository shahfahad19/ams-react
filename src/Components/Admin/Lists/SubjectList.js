import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import Message from '../../Main/Message';
import SubSectionHeader from '../../Utils/SubSectionHeader';

const SubjectList = () => {
    const [subjects, setSubjects] = useState([]);
    const [showAlert, setAlert] = useState(false);
    const ctx = useContext(AppContext);

    const params = useParams();
    useEffect(() => {
        const baseURL = 'https://amsapi.vercel.app/admin/semester/' + params.semesterId + '/subjects';
        axios
            .get(`${baseURL}`, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + ctx.token,
                },
            })
            .then((response) => {
                setSubjects(response.data.data.subjects);
                if (response.data.data.subjects.length === 0) setAlert(true);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    return (
        <div className='flex-grow'>
            <SubSectionHeader text='Subject List' />

            <div className='overflow-x-auto'>
                <table className='table table-compact w-full md:table-normal'>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Name</th>
                            <th>Teacher</th>
                            <th>Archived</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.length > 0 &&
                            subjects.map((subject, index) => {
                                return (
                                    <tr key={index}>
                                        <th>{index + 1}</th>
                                        <td>
                                            <Link to={`/admin/subject/${subject._id}`}>{subject.name}</Link>
                                        </td>
                                        <td>
                                            <Link to={`/admin/subject/${subject._id}?i=attendances`}>
                                                {subject.subjects || 0}
                                            </Link>
                                        </td>
                                        <td>{`${subject.archived.toString().slice(0, 1).toUpperCase()}${subject.archived
                                            .toString()
                                            .slice(1)}`}</td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
                {showAlert && (
                    <Message
                        type='warning'
                        text="You haven't added any subjects for this batch"
                        hideAlert={() => {
                            setAlert(false);
                        }}
                        showBtn={true}
                    />
                )}
            </div>
        </div>
    );
};

export default SubjectList;
