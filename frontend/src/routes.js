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
import Chat from './sections/@dashboard/blog/Chat';
import Blog from './pages/Blog';
import Cards from './pages/Cards';
import CardComponent from './pages/CardComponent';
import NotFound from './pages/Page404';
import Add from './sections/authentication/activities/Add';
import EditAct from './pages/EditAct';
import ShowDetailAct from './pages/ShowDetailAct';
import ShowDetailActFront from './pages/ShowDetailActFront';
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
import TrainingComponent from './pages/TrainingComponent';
import CartListComponent from './pages/CartListComponent';
import ChatFront from './sections/@dashboard/blog/ChatFront';
import UpdateTraining from './pages/UpdateTraining';
import Calendar from './pages/Calendar';
import { Profile } from './sections/profile/Profile';
import { Trainer } from './pages/Trainers';
import Trainings from './pages/Trainings';
import TrainingsDetail from './pages/TrainingsDetail';
import User from './pages/User';
import Emotion from './pages/emotion';

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
            { path: 'CartListComponent', element: <CartListComponent /> },
            { path: 'cardComponent', element: <CardComponent /> },
            { path: 'user', element: <User /> },
            user.role === 'MENTOR' && { path: 'card', element: <CartListComponent /> },
            user.role === 'STUDENT' && { path: 'card', element: <CardComponent /> },
            { path: 'profile', element: <Profile /> },
            { path: 'products', element: <Products /> },
            { path: 'trainers', element: <Trainer /> },
            user.role === 'MENTOR' && { path: 'blog', element: <Blog /> },
            user.role === 'MENTOR' && { path: 'training', element: <Training /> },
            user.role === 'STUDENT' && { path: 'training', element: <Trainings /> },
            { path: 'calendar', element: <Calendar /> },
            { path: 'meeting', element: <Meeting /> },
            { path: 'training/emotion', element: <Emotion /> },
            user.role === 'MENTOR' && {
              path: 'training/new',
              element: <NewTraining />
            },
            user.role === 'MENTOR' && {
              path: 'training/update/:id',
              element: <UpdateTraining />
            },
            user.role === 'STUDENT' && {
              path: 'training/details/:id',
              element: <TrainingsDetail />
            },
            user.role === 'MENTOR' && {
              path: 'training/details/:id',
              element: <TrainingDetails />
            },
            user.role === 'STUDENT' && { path: 'blog', element: <BlogFront /> },
            user.role === 'MENTOR' && { path: 'chat', element: <Chat /> },
            user.role === 'STUDENT' && { path: 'chat', element: <ChatFront /> },
            { path: 'add', element: <CreateAct /> },
            { path: 'new', element: <Add /> },
            { path: 'edit/:id', element: <EditAct /> },
            user.role === 'MENTOR' && { path: 'api/read/detail/:id', element: <ShowDetailAct /> },
            user.role === 'STUDENT' && {
              path: 'api/read/detail/front/:id',
              element: <ShowDetailActFront />
            },
            { path: 'course', element: <Course /> },
            { path: 'course/new', element: <NewCourse /> },
            { path: 'course/details/:id', element: <CourseDetails /> },
            { path: 'course/edit/:id', element: <EditCourse /> }
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
