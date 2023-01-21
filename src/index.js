import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import AddBatch from './Components/Admin/Controllers/AddBatch';
import AddSemester from './Components/Admin/Controllers/AddSemester';
import EditBatch from './Components/Admin/Controllers/EditBatch';
import { default as AdminDashboard } from './Components/Admin/Dashboard/Dashboard';
import BatchList from './Components/Admin/Lists/BatchList';
import SemesterList from './Components/Admin/Lists/SemesterList';
import ViewBatch from './Components/Admin/Views/ViewBatch';
import ViewSemester from './Components/Admin/Views/ViewSemester';
import ViewSubject from './Components/Admin/Views/ViewSubject';
import ForgotPassword from './Components/Auth/ForgotPassword';
import Login from './Components/Auth/Login';
import SignUp from './Components/Auth/SignUp';
import Welcome from './Components/Welcome';
import './index.css';
import Error from './Router/Error';

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
                        path: 'batch/:batchId',
                        element: <ViewBatch />,
                    },
                    {
                        path: 'add-batch',
                        element: <AddBatch />,
                    },
                    {
                        path: 'semester/:semesterId',
                        element: <ViewSemester />,
                    },
                    {
                        path: 'subject/:subjectId',
                        element: <ViewSubject />,
                    },
                ],
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(<RouterProvider router={router} />);
