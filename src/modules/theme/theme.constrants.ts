import { AdminMenuDto } from "./theme.dto";

export const adminMenu: AdminMenuDto[] = [
  {
    url: '/pos',
    label: 'Point of sale',
    icon: 'ico ico-accounts',
    isShow: true,
  },
  {
    url: '/account/manage',
    label: 'Manage Accounts',
    icon: 'ico ico-accounts',
    isShow: true,
  },
  {
    url: '/product/manage',
    label: 'Manage Products',
    icon: 'ico ico-accounts',
    isShow: true,
  },
  {
    url: '/promotion/manage',
    label: 'Manage Promotions',
    icon: 'ico ico-accounts',
    isShow: true,
  },
  {
    url: '/pos/past',
    label: 'Manage Sesions And Orders',
    icon: 'ico ico-accounts',
    isShow: true,
  },
  {
    url: '/',
    label: 'Setting',
    icon: 'ico ico-noti',
    isShow: true,
  },
];
