import React from 'react';

export const storeRoutes = [
  {
    path: '/store',
    name: 'home',
    title: 'Store home',
    exact: true,
    permission: '',
    component: React.lazy(() => import('../pages/Home')),
    isLayout: false,
    isGuarded: false,
  },
  {
    path: '/store/manage',
    name: 'home',
    title: 'New Request',
    exact: true,
    permission: '',
    component: React.lazy(() => import('../../../modules/admin-store/pages/Manage')),
    isLayout: false,
    isGuarded: false,
  },
];
