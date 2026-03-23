export const ROUTE = {
  AUTH: {
    LOGIN: '/login',
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
