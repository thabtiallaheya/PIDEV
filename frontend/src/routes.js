import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import { useSelector } from 'react-redux';
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import Products from './pages/Products';
import Blog from './pages/Blog';
import User from './pages/User';
import NotFound from './pages/Page404';
import EmailVerified from './pages/EmailVerified';
import ChangePassword from './pages/ChangePassword';
import ResetPassword from './pages/ResetPassword';

// ----------------------------------------------------------------------

export default function Router() {
  const user = useSelector((state) => state.user);
  console.log(user);
  const routes = user
    ? [
        {
          path: '/',
          element: <DashboardLayout />
        },
        { path: 'login', element: <DashboardLayout /> },

        {
          path: '/dashboard',
          element: <DashboardLayout />,
          children: [
            { path: 'app', element: <DashboardApp /> },
            { path: 'user', element: <User /> },
            { path: 'products', element: <Products /> },
            { path: 'blog', element: <Blog /> }
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
            { path: '/', element: <Navigate to="/dashboard/app" /> },
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
