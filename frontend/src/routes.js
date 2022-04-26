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
import CreateActivity from './sections/authentication/activities/CreateActivity';
import EditActivity from './sections/authentication/activities/EditActivity';
import Add from './sections/authentication/activities/Add';
import EditAct from './pages/EditAct';
import ChatBlog from './pages/ChatBlog';
import ShowDetailAct from './pages/ShowDetailAct';
import ShowDetailActFront from './pages/ShowDetailActFront';
import Training from './pages/Training';
import TrainingFront from './pages/TrainingFront';
import NewTraining from './pages/NewTraining';
import TrainingDetails from './pages/TrainingDetails';
import TrainingDetailsFront from './pages/TrainingDetailsFront';
import EmailVerified from './pages/EmailVerified';
import ChangePassword from './pages/ChangePassword';
import ResetPassword from './pages/ResetPassword';
import Account from './pages/Account';
import TrainingComponent from './pages/TrainingComponent';
import CartListComponent from './pages/CartListComponent';
import ChatFront from './sections/@dashboard/blog/ChatFront';
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
            { path: 'products', element: <Products /> },
            { path: 'blog', element: <Blog /> },
            { path: 'training', element: <Training /> },
            { path: 'trainingComponent', element: <TrainingComponent /> },
            { path: 'training/new', element: <NewTraining /> },
            { path: 'training/details/:id', element: <TrainingDetails /> },
            { path: 'training/details/front/:id', element: <TrainingDetailsFront /> },
            { path: 'blogFront', element: <BlogFront /> },
            { path: 'chat', element: <Chat /> },
            { path: 'chatFront', element: <ChatFront /> },
            { path: 'add', element: <CreateAct /> },
            { path: 'new', element: <Add /> },
            { path: 'edit/:id', element: <EditAct /> },
            { path: 'api/read/detail/:id', element: <ShowDetailAct /> },
            { path: 'api/read/detail/front/:id', element: <ShowDetailActFront /> }
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
            { path: '/', element: <Navigate to="/app" /> },
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
            { path: 'changepassword', element: <ResetPassword /> },
            { path: 'reset-password/:resetPassword', element: <ChangePassword /> },
            { path: '404', element: <NotFound /> },
            { path: 'verify/:token', element: <EmailVerified /> },
            { path: '*', element: <Navigate to="/404" /> }
          ]
        },
        { path: '*', element: <Navigate to="/404" replace /> }
      ];
  return useRoutes(routes);
}
