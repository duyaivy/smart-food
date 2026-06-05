export const ROUTE = {
  AUTH: {
    SIGNIN: '/(stacks)/auth/signin',
    SIGN_UP: '/(stacks)/auth/signup',
    FORGOT_PASSWORD: '/(stacks)/auth/forgot-password',
    RESET_PASSWORD: '/(stacks)/auth/reset-password',
    VERIFY_EMAIL: '/(stacks)/auth/verify-email',
    ONBOARDING: '/onboarding',
  },

  TAB: {
    HOME: '/(tabs)/',
    DISCOVER: '/(tabs)/discover',
    RECOMMENDATION: '/(tabs)/recommendation',
    FRIDGE: '/(tabs)/fridge',
    PROFILE: '/(tabs)/profile',
  },

  STACK: {
    SEARCH: {
      ROOT: '/(stacks)/search',
    },

    DISCOVER: {
      ROOT: '/(stacks)/discover',
      DISH_LIST: '/(stacks)/discover/dishes',
      DISH_DETAIL: '/(stacks)/discover/dishes/[id]',
      INGREDIENT: '/(stacks)/discover/ingredients',
      INGREDIENT_DETAIL: '/(stacks)/discover/ingredients/[id]',
    },
    RECOMMENDATION: {
      REQUEST: '/(tabs)/recommendation',
      RESULT: '/(tabs)/recommendation',
    },
    PROFILE: {
      ABOUT_US: '/profile/about-us',
      EDIT: '/profile/edit',
      HISTORY_COOKING: '/profile/history-cooking',
      PRIVACY: '/profile/privacy',
      SETTINGS: '/profile/settings',
      SMART_SCALE: '/profile/smart-scale',
      SMART_SCALE_SCAN_QR: '/profile/smart-scale-scan-qr',
    },
  },
} as const;
