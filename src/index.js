import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import AddBatch from './Components/Admin/Controllers/AddBatch';
import AddSemester from './Components/Admin/Controllers/AddSemester';
import AddSubject from './Components/Admin/Controllers/AddSubject';
import EditBatch from './Components/Admin/Controllers/EditBatch';
import EditSemester from './Components/Admin/Controllers/EditSemester';
import EditSubject from './Components/Admin/Controllers/EditSubject';
import { default as AdminDashboard } from './Components/Admin/Dashboard/Dashboard';
import BatchList from './Components/Admin/Lists/BatchList';
import SemesterList from './Components/Admin/Lists/SemesterList';
import StudentList from './Components/Admin/Lists/StudentList';
import SubjectList from './Components/Admin/Lists/SubjectList';
import AttendanceList from './Components/Admin/Lists/AttendanceList';
import InviteLink from './Components/Admin/Views/InviteLink';
import ViewBatch from './Components/Admin/Views/ViewBatch';
import ViewSemester from './Components/Admin/Views/ViewSemester';
import ViewSubject from './Components/Admin/Views/ViewSubject';
import ForgotPassword from './Components/Auth/ForgotPassword';
import Login from './Components/Auth/Login';
import SignUp from './Components/Auth/SignUp';
import Redirect from './Components/Utils/Redirect';
import Welcome from './Components/Welcome';
import './index.css';
import Error from './Router/Error';
import ViewProfile from './Components/Admin/Views/ViewProfile';
import EditProfile from './Components/Admin/Profile/EditProfile';
import Profile from './Components/Admin/Profile/Profile';
import EditPic from './Components/Admin/Profile/EditPic';
import UpdatePassword from './Components/Admin/Profile/UpdatePassword';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <Error />,
        children: [
            {
                path: '',
                element: <Welcome />,
            },
            {
                path: 'login',
                element: <Login />,
            },
            {
                path: 'signup',
                element: <SignUp />,
            },
            {
                path: 'forgot-password',
                element: <ForgotPassword />,
            },
            {
                path: 'admin',
                element: <AdminDashboard />,
                children: [
                    {
                        path: '',
                        element: <BatchList />,
                    },
                    {
                        path: 'profile',
                        element: <ViewProfile />,
                        children: [
                            {
                                path: 'view',
                                element: <Profile />,
                            },
                            {
                                path: 'edit-profile',
                                element: <EditProfile />,
                            },
                            {
                                path: 'edit-photo',
                                element: <EditPic />,
                            },
                            {
                                path: 'update-password',
                                element: <UpdatePassword />,
                            },
                        ],
                    },
                    {
                        path: 'batch/:batchId',
                        element: <ViewBatch />,
                        children: [
                            {
                                path: 'semesters',
                                element: <SemesterList />,
                            },
                            {
                                path: 'edit',
                                element: <EditBatch />,
                            },
                            {
                                path: 'invite',
                                element: <InviteLink />,
                            },
                            {
                                path: 'add-semester',
                                element: <AddSemester />,
                            },
                            {
                                path: '',
                                element: <Redirect to='semesters' />,
                            },
                            {
                                path: 'students',
                                element: <StudentList />,
                            },
                        ],
                    },
                    {
                        path: 'add-batch',
                        element: <AddBatch />,
                    },
                    {
                        path: 'semester/:semesterId',
                        element: <ViewSemester />,
                        children: [
                            {
                                path: '',
                                element: <SubjectList />,
                            },
                            {
                                path: 'subjects',
                                element: <SubjectList />,
                            },
                            {
                                path: 'edit',
                                element: <EditSemester />,
                            },
                            {
                                path: 'add-subject',
                                element: <AddSubject />,
                            },
                        ],
                    },
                    {
                        path: 'subject/:subjectId',
                        element: <ViewSubject />,
                        children: [
                            {
                                path: '',
                                element: <AttendanceList />,
                            },
                            {
                                path: 'attendance',
                                element: <AttendanceList />,
                            },
                            {
                                path: 'edit',
                                element: <EditSubject />,
                            },
                        ],
                    },
                ],
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(<RouterProvider router={router} />);
