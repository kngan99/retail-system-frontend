import React from 'react';

export const warehouseRoutes = [
  {
    path: '/warehouse',
    name: 'home',
    title: 'Warehouse home',
    exact: true,
    permission: '',
    component: React.lazy(() => import('../pages/Home')),
    isLayout: false,
    isGuarded: false,
  },
  {
    path: '/warehouse/new-request-goods-note',
    name: 'home',
    title: 'Warehouse home',
    exact: true,
    permission: '',
    component: React.lazy(() => import('../../../modules/warehouse/pages/CreateRequestGoodsNote')),
    isLayout: false,
    isGuarded: false,
  },
];
