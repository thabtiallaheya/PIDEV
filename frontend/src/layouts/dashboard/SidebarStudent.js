// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const sidebarStudent = [
  /*{
    title: 'dashboard',
    path: '/app',
    icon: getIcon('eva:pie-chart-2-fill')
  },*/
  {
    title: 'My cart',
    path: '/cardComponent',
    icon: getIcon('eva:shopping-bag-fill')
  },
  {
    title: 'course',
    path: '/dashboard/products',
    icon: getIcon('eva:file-text-fill')
  },
  {
    title: 'activity',
    path: '/blogFront',
    icon: getIcon('eva:file-text-fill')
  },
  {
    title: 'training',
    path: '/trainingComponent',
    icon: getIcon('eva:file-text-fill')
  },
  {
    title: 'login',
    path: '/login',
    icon: getIcon('eva:lock-fill')
  },
  {
    title: 'register',
    path: '/register',
    icon: getIcon('eva:person-add-fill')
  },
  {
    title: 'Not found',
    path: '/404',
    icon: getIcon('eva:alert-triangle-fill')
  }
];

export default sidebarStudent;
