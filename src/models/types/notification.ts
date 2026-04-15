export const NOTIFICATION_SCREEN = {
  DISH_DETAIL: 'DishDetail',
  INGREDIENT_DETAIL: 'IngredientDetail',
} as const;

export const NOTIFICATION_ACTION = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
} as const;

export type NotificationScreen =
  (typeof NOTIFICATION_SCREEN)[keyof typeof NOTIFICATION_SCREEN];
export type NotificationAction =
  (typeof NOTIFICATION_ACTION)[keyof typeof NOTIFICATION_ACTION];

export type NotificationPayload = {
  screen?: NotificationScreen | string;
  dishId?: number | string;
  ingredientId?: number | string;
  action?: NotificationAction | string;
};
