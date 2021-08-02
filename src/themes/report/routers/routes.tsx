import React from 'react';

export const reportRoutes = [
  {
    path: '/report',
    name: 'report',
    title: 'Report',
    exact: true,
    permission: '',
    component: React.lazy(() => import('../../../modules/report/pages/Report')),
    isLayout: false,
    isGuarded: false,
  },
];
