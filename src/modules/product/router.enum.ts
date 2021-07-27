export enum DEFAULT_ROUTERS {
  LOGIN = '/account/login',
  FORGOT_PASSWORD = '/account/forgotpassword',
  RESET_PASSWORD_TOKEN = '/account/reset-password/:token',
  VERIFY_EMAIL = '/account/verify-email/:token',
  SET_PASSWORD_TOKEN = '/account/set-password/:token',
  CREATE = '/account/register',
  SETUP = '/account/setup',
  THANKYOU = '/account/thankyou/:action'
}

export enum DEFAULT_ACTION_ROUTERS {
  THANKYOU = '/account/thankyou/',
}

export enum DEFAULT_API {
  PREFIX = 'api/acount',
}

export enum VERIFIED_STATUS {
  UNVERIFIED,
  PENDING,
  VERIFIED,
}
