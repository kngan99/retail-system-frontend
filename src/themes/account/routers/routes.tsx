import React from 'react';

export const accountsRoutes = [
  {
    path: '/account',
    name: 'home',
    title: 'Home Page',
    exact: true,
    permission: '',
    component: React.lazy(() => import('../pages/Home')),
    isLayout: false,
    isGuarded: false,
  },
  {
    path: '/account/manage',
    name: 'Manage Accounts',
    title: 'Manage Accounts',
    exact: true,
    permission: '',
    component: React.lazy(() => import('../../../modules/admin-account/pages/Manage')),
    isLayout: false,
    isGuarded: false,
  },
  {
    path: '/account/login',
    name: 'account.login',
    title: 'Login',
    exact: true,
    permission: '',
    component: React.lazy(() => import('../pages/Login')),
    isLayout: false,
    isGuarded: false,
  },
  {
    path: '/account/register',
    name: 'account.register',
    title: 'Register',
    exact: true,
    permission: '',
    component: React.lazy(() => import('../pages/Create')),
    isLayout: false,
    isGuarded: false,
  },
  {
    path: '/account/verify-email/:token',
    name: 'account.verified',
    title:'Account verification',
    exact: true,
    component: React.lazy(
      () => import('../pages/VerifiedEmail')
    ),
    isLayout: false,
    isGuarded: false,
  },
  {
    path: '/account/not-verified',
    name: 'account.not-verified',
    title:'Account not verified',
    exact: true,
    component: React.lazy(
      () => import('../pages/NotVerifiedEmail')
    ),
    isLayout: false,
    isGuarded: false,
  },
  {
    path: '/account/setup',
    name: 'account.setup',
    title:'Account setup',
    exact: true,
    component: React.lazy(
      () => import('../../../modules/account/pages/Setup')
    ),
    isLayout: false,
    isGuarded: false,
  },
];
