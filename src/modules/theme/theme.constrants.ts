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
    url: '/warehouse/request-goods-note-cart/manage',
    label: 'Manage Goods Request',
    icon: 'ico ico-noti-order',
    isShow: true,
  },
  {
    url: '/warehouse/manage',
    label: 'Manage Warehouses',
    icon: 'ico ico-pickup',
    isShow: true,
  },
  {
    url: '/store/manage',
    label: 'Manage Store',
    icon: 'ico ico-standard',
    isShow: true,
  },
  {
    url: '/report',
    label: 'Report',
    icon: 'ico ico-term',
    isShow: true,
  },
  {
    url: '/operation/remove-broken-products',
    label: 'Manage Disposal',
    icon: 'ico ico-map-note',
    isShow: false,
  },
  {
    url: '/operation/recommend-products-position',
    label: 'Position Recommend',
    icon: 'ico ico-orders',
    isShow: false,
  },
];
