import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import AddSemester from './Components/Entities/Semester/AddSemester';
import AddSubject from './Components/Entities/Subject/AddSubject';
import EditSemester from './Components/Entities/Semester/EditSemester';
import AdminDashboard from './Components/Admin/AdminDashboard';
import SemesterList from './Components/Entities/Semester/SemesterList';
import StudentList from './Components/Entities/Student/StudentList';
import SubjectList from './Components/Entities/Subject/SubjectList';
import AttendanceList from './Components/Entities/Attendance/AttendanceList';
import InviteLink from './Components/Entities/Batch/BatchInviteLink';
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
import EditSubjectTeacher from './Components/Entities/Subject/EditSubjectTeacher';
import TeacherDashboard from './Components/Teacher/TeacherDashboard';
import TeacherSubjectsList from './Components/Entities/Subject/TeacherSubjectsList';
import TeacherViewSubject from './Components/Teacher/Views/TeacherViewSubject';
import TakeAttendance from './Components/Entities/Attendance/TakeAttendance';
import TeacherSubjectAttendanceList from './Components/Entities/Attendance/TeacherSubjectAttendanceList';
import RemoveSubject from './Components/Entities/Subject/RemoveSubject';
import SuperAdminDashboard from './Components/SuperAdmin/SuperAdminDashboard';
import MainView from './Components/Admin/Views/MainView';
import DepartmentList from './Components/Entities/Department/DepartmentList';
import AddDepartment from './Components/Entities/Department/AddDepartment';
import ViewDepartment from './Components/SuperAdmin/Views/ViewDepartment';
import TeacherList from './Components/Entities/Teacher/TeacherList';
import AddTeacher from './Components/Entities/Teacher/AddTeacher';
import StudentDashboard from './Components/Student/StudentDashboard';
import StudentAttendance from './Components/Entities/Attendance/StudentAttendance';
import ViewStudent from './Components/Admin/Views/ViewStudent';
import DepartmentInfo from './Components/Entities/Department/DepartmentInfo';
import DefaultSubjectList from './Components/Entities/DepartmentSubject/DefaultSubjectList';
import BatchList from './Components/Entities/Batch/BatchList';
import AddBatch from './Components/Entities/Batch/AddBatch';
import EditBatch from './Components/Entities/Batch/EditBatch';
import Error404 from './Components/Utils/Error404';
import EditSubject from './Components/Entities/Subject/EditSubject';
import ViewTeacher from './Components/Admin/Views/ViewTeacher';
import Profile from './Components/Profiles/Profile';
import ViewProfile from './Components/Profiles/ViewProfile';
import EditProfile from './Components/Profiles/EditProfile';
import EditPic from './Components/Profiles/EditPic';
import UpdatePassword from './Components/Profiles/UpdatePassword';
import AddDefaultSubject from './Components/Entities/DepartmentSubject/AddDefaultSubject';
import TeacherInfo from './Components/Entities/Teacher/TeacherInfo';
import EditTeacherInfo from './Components/Entities/Teacher/EditTeacherInfo';
import ConfirmAccount from './Components/Auth/ConfirmAccount';
import StudentInfo from './Components/Entities/Student/StudentInfo';

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
                path: '404',
                element: <Error404 />,
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
                path: 'confirm-account',
                element: <ConfirmAccount />,
            },
            {
                path: 'profile',
                element: <ViewProfile />,
                children: [
                    {
                        path: '',
                        element: <Redirect to='view' />,
                    },
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

            // Paths for super admin
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
                        path: 'department/:departmentId/add-subject',
                        element: <AddDefaultSubject />,
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
                        path: 'batch/:batchId/add-semester',
                        element: <AddSemester />,
                    },
                    {
                        path: 'student/:studentId',
                        element: <ViewStudent />,
                        children: [
                            {
                                path: '',
                                element: <Redirect to='info' />,
                            },
                            {
                                path: 'info',
                                element: <StudentInfo />,
                            },
                            {
                                path: 'attendance',
                                element: <StudentAttendance />,
                            },
                        ],
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
                        path: 'teacher/:teacherId',
                        element: <ViewTeacher />,
                        children: [
                            {
                                path: '',
                                element: <Redirect to='info' />,
                            },
                            {
                                path: 'info',
                                element: <TeacherInfo />,
                            },
                            {
                                path: 'subjects',
                                element: <TeacherSubjectsList />,
                            },
                            {
                                path: 'edit',
                                element: <EditTeacherInfo />,
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
                                path: 'teacher',
                                element: <EditSubjectTeacher />,
                            },
                            {
                                path: 'edit',
                                element: <EditSubject />,
                            },
                        ],
                    },
                ],
            },

            // Paths for Teacher
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

            // Paths for student
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
