import React from 'react';

export const operationRoutes = [
  {
    path: '/operation',
    name: 'home',
    title: 'Operation home',
    exact: true,
    permission: '',
    component: React.lazy(() => import('../pages/Home')),
    isLayout: false,
    isGuarded: false,
  },
  {
    path: '/operation/recommend-products-position',
    name: 'recommend-products-position',
    title: 'Recommend Products Position',
    exact: true,
    permission: '',
    component: React.lazy(() => import('../../../modules/operation/pages/Recommend')),
    isLayout: false,
    isGuarded: false,
  },
  {
    path: '/operation/remove-broken-products',
    name: 'remove-broken-products',
    title: 'Remove Broken Products',
    exact: true,
    permission: '',
    component: React.lazy(() => import('../../../modules/operation/pages/ThrowAway')),
    isLayout: false,
    isGuarded: false,
  },
];
