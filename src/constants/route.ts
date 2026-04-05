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
    COOKING: '/(tabs)/cooking',
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
    PROFILE: {
      ABOUT_US: '/(stacks)/profile/about-us',
      EDIT: '/(stacks)/profile/edit',
      HISTORY_COOKING: '/(stacks)/profile/history-cooking',
      PRIVACY: '/(stacks)/profile/privacy',
      SETTINGS: '/(stacks)/profile/settings',
      SMART_SCALE: '/(stacks)/profile/smart-scale',
    },
  },
} as const;