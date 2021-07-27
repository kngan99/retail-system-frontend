import React from 'react';

export const productsRoutes = [
  {
    path: '/product',
    name: 'home',
    title: 'Home Page',
    exact: true,
    permission: '',
    component: React.lazy(() => import('../pages/Home')),
    isLayout: false,
    isGuarded: false,
  },
  {
    path: '/product/manage',
    name: 'Manage Products',
    title: 'Manage Products',
    exact: true,
    permission: '',
    component: React.lazy(() => import('../../../modules/admin-product/pages/Manage')),
    isLayout: false,
    isGuarded: false,
  },
];
