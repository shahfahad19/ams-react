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
import AdminDashboard from './Components/Admin/AdminDashboard';
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
import EditTeacher from './Components/Admin/Controllers/EditTeacher';
import TeacherDashboard from './Components/Teacher/TeacherDashboard';
import TeacherSubjectsList from './Components/Teacher/Lists/TeacherSubjectsList';
import TeacherViewSubject from './Components/Teacher/Views/TeacherViewSubject';
import TakeAttendance from './Components/Teacher/Controllers/TakeAttendance';
import TeacherSubjectAttendanceList from './Components/Teacher/Lists/TeacherSubjectAttendanceList';
import RemoveSubject from './Components/Teacher/Controllers/RemoveSubject';
import SuperAdminDashboard from './Components/SuperAdmin/SuperAdminDashboard';
import MainView from './Components/SuperAdmin/Views/MainView';
import DepartmentList from './Components/SuperAdmin/Lists/DepartmentList';
import AddDepartment from './Components/SuperAdmin/Controllers/AddDepartment';

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
                path: 'super-admin',
                element: <SuperAdminDashboard />,
                children: [
                    {
                        path: '',
                        element: <DepartmentList />,
                    },
                    {
                        path: 'add-department',
                        element: <AddDepartment />,
                    },
                ],
            },
            // Paths for Admin (Department Admin)
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
                            {
                                path: 'teacher',
                                element: <EditTeacher />,
                            },
                        ],
                    },
                ],
            },
            {
                path: 'teacher',
                element: <TeacherDashboard />,
                children: [
                    {
                        path: '',
                        element: <TeacherSubjectsList />,
                    },
                    {
                        path: 'subject/:subjectId',
                        element: <TeacherViewSubject />,
                        children: [
                            {
                                path: '',
                                element: <TeacherSubjectAttendanceList />,
                            },
                            {
                                path: 'attendance',
                                element: <TeacherSubjectAttendanceList />,
                            },
                            {
                                path: 'take-attendance',
                                element: <TakeAttendance />,
                            },
                            {
                                path: 'remove',
                                element: <RemoveSubject />,
                            },
                        ],
                    },
                ],
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(<RouterProvider router={router} />);
