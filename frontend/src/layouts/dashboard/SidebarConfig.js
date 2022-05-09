// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const sidebarConfig = [
  // {
  //   title: 'dashboard',
  //   path: '/app',
  //   icon: getIcon('eva:pie-chart-2-fill')
  // },
  {
    title: 'carts',
    path: '/card',
    icon: getIcon('eva:shopping-bag-fill')
  },
  // {
  //   title: 'product',
  //   path: '/dashboard/products',
  //   icon: getIcon('eva:shopping-bag-fill')
  // },
  {
    title: 'user',
    path: '/user',
    icon: getIcon('fa6-solid:users-gear')
  },
  // {
  //   title: 'product',
  //   path: '/dashboard/products',
  //   icon: getIcon('eva:shopping-bag-fill')
  // },
  {
    title: 'activity',
    path: '/blog',
    icon: getIcon('icon-park-outline:activity-source')
  },
  {
    title: 'training',
    path: '/training',
    icon: getIcon('healthicons:i-training-class')
  },
  {
    title: 'trainers',
    path: '/trainers',
    icon: getIcon('fa-solid:chalkboard-teacher')
  },
  {
    title: 'Course',
    path: '/course',
    icon: getIcon('eva:file-text-fill')
  },
  {
    title: 'calendar',
    path: '/calendar',
    icon: getIcon('bi:calendar-week-fill')
  },
  {
    title: 'Not found',
    path: '/404',
    icon: getIcon('eva:alert-triangle-fill')
  }
];

export default sidebarConfig;
