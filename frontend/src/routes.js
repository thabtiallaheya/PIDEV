import { Navigate, useRoutes } from 'react-router-dom';
// layouts
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
import CreateActivity from './sections/authentication/activities/CreateActivity';
import EditActivity from './sections/authentication/activities/EditActivity';
import Add from './sections/authentication/activities/Add';
import EditAct from './pages/EditAct';
import showDetailAct from './pages/ShowDetailAct';
import ShowDetailAct from './pages/ShowDetailAct';

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: <User /> },
        { path: 'products', element: <Products /> },
        { path: 'blog', element: <Blog /> },
        { path: 'blogFront', element: <BlogFront /> },
        { path: 'add', element: <CreateAct /> },
        { path: 'new', element: <Add /> },
        { path: 'edit/:id', element: <EditAct /> },
        { path: 'api/read/detail/:id', element: <ShowDetailAct /> }
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
