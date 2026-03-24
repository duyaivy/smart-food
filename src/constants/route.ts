export const ROUTE = {
  AUTH: {
    SIGNIN: '/signin',
    SIGN_UP: '/signup',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    VERIFY_EMAIL: '/verify-email',
    ONBOARDING: '/onboarding',
  },

  TAB: {
    HOME: '/',
    DISCOVER: '/discover',
    COOKING: '/cooking',
    FRIDGE: '/fridge',
    PROFILE: '/profile',
  },
  STACK: {
    SEARCH: {
      ROOT: '/search',
    },
    PROFILE: {
      ABOUT_US: '/profile/about-us',
      EDIT: '/profile/edit',
      HISTORY_COOKING: '/profile/history-cooking',
      PRIVACY: '/profile/privacy',
      SETTINGS: '/profile/settings',
    },
  },
} as const;
