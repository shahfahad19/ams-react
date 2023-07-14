import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import AddSemester from './Components/Admin/Controllers/AddSemester';
import AddSubject from './Components/Admin/Controllers/AddSubject';
import EditSemester from './Components/Admin/Controllers/EditSemester';
import EditSubject from './Components/Admin/Controllers/EditSubject';
import AdminDashboard from './Components/Admin/AdminDashboard';
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
import MainView from './Components/Admin/Views/MainView';
import DepartmentList from './Components/SuperAdmin/Lists/DepartmentList';
import AddDepartment from './Components/SuperAdmin/Controllers/AddDepartment';
import ViewDepartment from './Components/SuperAdmin/Views/ViewDepartment';
import TeacherList from './Components/Admin/Lists/TeacherList';
import AddTeacher from './Components/Admin/Controllers/AddTeacher';
import StudentDashboard from './Components/Student/StudentDashboard';
import StudentAttendance from './Components/Student/StudentAttendance';
import ViewStudent from './Components/Admin/Views/ViewStudent';
import DepartmentInfo from './Components/SuperAdmin/Controllers/DepartmentInfo';
import DefaultSubjectList from './Components/SuperAdmin/Lists/DefaultSubjectList';
import BatchList from './Components/Batch/BatchList';
import AddBatch from './Components/Batch/AddBatch';
import EditBatch from './Components/Batch/EditBatch';

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
                        path: 'student/:studentId',
                        element: <ViewStudent />,
                    },
                    {
                        path: 'add-department',
                        element: <AddDepartment />,
                    },
                    {
                        path: 'department/:departmentId',
                        element: <ViewDepartment />,
                        children: [
                            {
                                path: '',
                                element: <Redirect to='info' />,
                            },
                            {
                                path: 'info',
                                element: <DepartmentInfo />,
                            },

                            {
                                path: 'batches',
                                element: <BatchList />,
                            },
                            {
                                path: 'teachers',
                                element: <TeacherList />,
                            },
                            {
                                path: 'subjects',
                                element: <DefaultSubjectList />,
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
                                path: 'invite',
                                element: <InviteLink />,
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
                        ],
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
                        element: <MainView />,
                        children: [
                            {
                                path: '',
                                element: <Redirect to='/admin/batches' />,
                            },
                            {
                                path: 'batches',
                                element: <BatchList />,
                            },
                            {
                                path: 'teachers',
                                element: <TeacherList />,
                            },
                        ],
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
                        path: 'batch/:batchId/add-semester',
                        element: <AddSemester />,
                    },
                    {
                        path: 'student/:studentId',
                        element: <ViewStudent />,
                    },
                    {
                        path: 'semester/:semesterId/add-subject',
                        element: <AddSubject />,
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
                        path: 'add-teacher',
                        element: <AddTeacher />,
                    },
                    {
                        path: 'semester/:semesterId',
                        element: <ViewSemester />,
                        children: [
                            {
                                path: '',
                                element: <Redirect to='subjects' />,
                            },
                            {
                                path: 'subjects',
                                element: <SubjectList />,
                            },
                            {
                                path: 'edit',
                                element: <EditSemester />,
                            },
                        ],
                    },
                    {
                        path: 'subject/:subjectId',
                        element: <ViewSubject />,
                        children: [
                            {
                                path: '',
                                element: <Redirect to='attendance' />,
                            },
                            {
                                path: 'attendance',
                                element: <TeacherSubjectAttendanceList />,
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
            {
                path: 'student',
                element: <StudentDashboard />,
                children: [
                    {
                        path: '',
                        element: <StudentAttendance />,
                    },
                ],
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(<RouterProvider router={router} />);
