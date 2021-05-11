import { AdminMenuDto } from "./theme.dto";

export const adminMenu: AdminMenuDto[] = [
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
    url: '/warehouse/request-goods-note-cart/manage',
    label: 'Manage Goods Request',
    icon: 'ico ico-noti-order',
    isShow: true,
  },
  {
    url: '/',
    label: 'Setting',
    icon: 'ico ico-noti',
    isShow: true,
  },
];
