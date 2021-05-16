import React from 'react';

export const promotionsRoutes = [
  {
    path: '/promotion/manage',
    name: 'Manage Promotions',
    title: 'Manage Promotions',
    exact: true,
    permission: '',
    component: React.lazy(() => import('../pages/Home')),
    isLayout: false,
    isGuarded: false,
  },
];
