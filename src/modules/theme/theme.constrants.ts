import { AdminMenuDto } from "./theme.dto";

export const adminMenu: AdminMenuDto[] = [
  {
    url: '/',
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
    url: '/',
    label: 'Setting',
    icon: 'ico ico-noti',
    isShow: true,
  },
];
