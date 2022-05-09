import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import { useSelector } from 'react-redux';
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import CreateAct from './pages/CreateAct';

import DashboardApp from './pages/DashboardApp';
import Products from './pages/Products';
import BlogFront from './pages/BlogFront';
import Blog from './pages/Blog';
import User from './pages/User';
import NotFound from './pages/Page404';
import Add from './sections/authentication/activities/Add';
import EditAct from './pages/EditAct';
import ShowDetailAct from './pages/ShowDetailAct';
import Training from './pages/Training';
import NewTraining from './pages/NewTraining';
import Meeting from './pages/meeting';
import TrainingDetails from './pages/TrainingDetails';
import Course from './pages/course';
import NewCourse from './pages/newCourse';
import CourseDetails from './pages/courseDetails';
import EditCourse from './pages/editCourse';
import EmailVerified from './pages/EmailVerified';
import ChangePassword from './pages/ChangePassword';
import ResetPassword from './pages/ResetPassword';
import Account from './pages/Account';
import UpdateTraining from './pages/UpdateTraining';
import Calendar from './pages/Calendar';
import { Profile } from './sections/profile/Profile';
import { Trainer } from './pages/Trainers';
import CourseStusent from './pages/coursesStudent';
import Recommended from './pages/Recommended';


// ----------------------------------------------------------------------

export default function Router() {
  const user = useSelector((state) => state.user);
  const routes = user
    ? [
        { path: 'login', element: <DashboardLayout /> },

        {
          path: '/',
          element: <DashboardLayout />,
          children: [
            { path: 'account', element: <Account /> },
            { path: 'app', element: <DashboardApp /> },
            { path: 'user', element: <User /> },
            { path: 'profile', element: <Profile /> },
            { path: 'products', element: <Products /> },
            { path: 'trainers', element: <Trainer /> },
            { path: 'blog', element: <Blog /> },
            { path: 'training', element: <Training /> },
            { path: 'calendar', element: <Calendar /> },
            { path: 'meeting', element: <Meeting /> },
            { path: 'training/new', element: <NewTraining /> },
            { path: 'training/update/:id', element: <UpdateTraining /> },
            { path: 'training/details/:id', element: <TrainingDetails /> },
            { path: 'blogFront', element: <BlogFront /> },
            { path: 'add', element: <CreateAct /> },
            { path: 'new', element: <Add /> },
            { path: 'edit/:id', element: <EditAct /> },
            { path: 'api/read/detail/:id', element: <ShowDetailAct /> },
            user.role === 'MENTOR' &&{ path: 'course', element: <Course /> },
            user.role === 'STUDENT' &&{ path: 'course', element: <CourseStusent/> },
            { path: 'course/new', element: <NewCourse /> },
            user.role === 'STUDENT' && {path: 'course/details/:id', element: <coursesDetail />},
            user.role === 'MENTOR' && {path: 'course/details/:id', element: <CourseDetails />
            },
            { path: 'course/edit/:id', element: <EditCourse /> },
            { path: 'recommended', element: <Recommended /> },

          ]
        },
        {
          path: '404',
          element: <NotFound />
        },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    : [
        {
          path: '/',
          element: <LogoOnlyLayout />,
          children: [
            { path: '/', element: <Navigate to="/login" /> },
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
            { path: 'changepassword', element: <ResetPassword /> },
            { path: 'reset-password/:resetPassword', element: <ChangePassword /> },
            { path: '404', element: <NotFound /> },
            { path: 'verify/:token', element: <EmailVerified /> },
            { path: '*', element: <Navigate to="/404" /> }
          ]
        },
        { path: '*', element: <Navigate to="/login" replace /> }
      ];
  return useRoutes(routes);
}
