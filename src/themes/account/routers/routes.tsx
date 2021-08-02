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
  {
    path: '/account/edit/:id',
    name: 'Edit Accounts',
    title: 'Edit Accounts',
    exact: true,
    permission: '',
    component: React.lazy(
      () => import('../../../modules/admin-account/pages/EditAccount')
    ),
    isLayout: false,
    isGuarded: false,
  },
  {
    path: '/account/deleted',
    name: 'Restore Accounts',
    title: 'Restore Accounts',
    exact: true,
    permission: '',
    component: React.lazy(
      () => import('../../../modules/admin-account/pages/ManageDeleted')
    ),
    isLayout: false,
    isGuarded: false,
  },
  {
    path: '/account/forgotpassword',
    name: 'Forgot Password',
    title: 'Forgot Password',
    exact: true,
    permission: '',
    component: React.lazy(
      () => import('../../../themes/account/pages/ForgotPassword')
    ),
    isLayout: false,
    isGuarded: false,
  },
  {
    path: '/account/reset-password/:token',
    name: 'Reset Password',
    title: 'Reset Password',
    exact: true,
    permission: '',
    component: React.lazy(
      () => import('../../../themes/account/pages/ResetPassword')
    ),
    isLayout: false,
    isGuarded: false,
  },
];
