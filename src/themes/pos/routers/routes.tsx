import React from 'react';

export const posRoutes = [
  {
    path: '/pos',
    name: 'pos',
    title: 'Point of Sales',
    exact: true,
    permission: '',
    component: React.lazy(() => import('../pages/Home')),
    isLayout: false,
    isGuarded: false,
  },
  {
    path: '/pos/past',
    name: 'pospast',
    title: 'History',
    exact: true,
    permission: '',
    component: React.lazy(() => import('../pages/History')),
    isLayout: false,
    isGuarded: false,
  },
  {
    path: '/pos/past/:sessionId',
    name: 'pospast',
    title: 'History',
    exact: true,
    permission: '',
    component: React.lazy(() => import('../pages/SessionDetail')),
    isLayout: false,
    isGuarded: false,
  },
];
