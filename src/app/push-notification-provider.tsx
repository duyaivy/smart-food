import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import React, { type PropsWithChildren, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';

import { dishApi } from '@/api/dish.api';
import { userApi } from '@/api/user.api';
import { ROUTE } from '@/constants/route';
import { useDishStore } from '@/lib/stores/use-dish-store';
import { useGlobalStore } from '@/lib/stores/use-global-store';
import { useIngredientStore } from '@/lib/stores/use-ingredient-store';
import { toIntegerId } from '@/lib/utils/format';
import {
  NOTIFICATION_ACTION,
  NOTIFICATION_SCREEN,
  type NotificationAction,
  type NotificationPayload,
} from '@/models/types/notification';

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const title = notification.request.content.title?.trim();
    const body = notification.request.content.body?.trim();
    const shouldShow = Boolean(title || body);

    return {
      shouldShowAlert: shouldShow,
      shouldPlaySound: shouldShow,
      shouldSetBadge: false,
      shouldShowBanner: shouldShow,
      shouldShowList: shouldShow,
    };
  },
});

const getProjectId = (): string | null => {
  return Constants.expoConfig?.extra?.eas?.projectId ?? null;
};

const setupAndroidChannel = async () => {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
  });
};

const isSupportedNotificationAction = (
  action: NotificationPayload['action']
): action is NotificationAction => {
  return (
    action === NOTIFICATION_ACTION.CREATE ||
    action === NOTIFICATION_ACTION.UPDATE ||
    action === NOTIFICATION_ACTION.DELETE
  );
};

const syncIngredientByNotificationAction = async (
  payload: NotificationPayload
) => {
  if (payload.screen !== NOTIFICATION_SCREEN.INGREDIENT_DETAIL) return;
  if (!isSupportedNotificationAction(payload.action)) return;

  const ingredientId = toIntegerId(payload.ingredientId);
  if (!ingredientId) return;

  const { setStatus } = useIngredientStore.getState();
  setStatus('stale');

  if (payload.action === NOTIFICATION_ACTION.DELETE) {
    return;
  }

  try {
  } catch (error) {
    console.error('Sync nguyên liệu từ notification thất bại:', error);
  }
};

const syncDishByNotificationAction = async (payload: NotificationPayload) => {
  if (payload.screen !== NOTIFICATION_SCREEN.DISH_DETAIL) return;
  if (!isSupportedNotificationAction(payload.action)) return;

  const dishId = toIntegerId(payload.dishId);
  if (!dishId) return;

  const { removeDishDetail, setDishDetail, setStatus } =
    useDishStore.getState();

  setStatus('stale');

  if (payload.action === NOTIFICATION_ACTION.CREATE) {
    return;
  }

  if (payload.action === NOTIFICATION_ACTION.DELETE) {
    removeDishDetail(dishId);
    return;
  }

  try {
    const { data } = await dishApi.getDishDetail(String(dishId));
    setDishDetail(dishId, data.data);
  } catch (error) {
    removeDishDetail(dishId);
    console.error('Sync món ăn từ notification thất bại:', error);
  }
};

const navigateByNotificationPayload = (payload: NotificationPayload) => {
  if (payload.action && payload.action !== NOTIFICATION_ACTION.CREATE) return;
  if (payload.screen === NOTIFICATION_SCREEN.DISH_DETAIL) {
    const dishId = toIntegerId(payload.dishId);
    if (!dishId) return;

    router.push({
      pathname: ROUTE.STACK.DISCOVER.DISH_DETAIL,
      params: { id: String(dishId) },
    });
    return;
  }

  if (payload.screen === NOTIFICATION_SCREEN.INGREDIENT_DETAIL) {
    const ingredientId = toIntegerId(payload.ingredientId);
    if (!ingredientId) return;

    router.push({
      pathname: ROUTE.STACK.DISCOVER.INGREDIENT_DETAIL,
      params: { id: String(ingredientId) },
    });
  }
};

const registerForPushNotificationsAsync = async (): Promise<string | null> => {
  if (!Device.isDevice) {
    console.warn('Push Notifications chỉ hoạt động trên thiết bị thật');
    return null;
  }

  await setupAndroidChannel();

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  const finalStatus =
    existingStatus === 'granted'
      ? existingStatus
      : (await Notifications.requestPermissionsAsync()).status;

  if (finalStatus !== 'granted') {
    console.warn('User từ chối quyền thông báo');
    return null;
  }

  const projectId = getProjectId();
  if (!projectId) {
    console.error('Thiếu projectId trong app.json > extra.eas.projectId');
    return null;
  }

  try {
    const { data: token } = await Notifications.getExpoPushTokenAsync({
      projectId,
    });
    return token;
  } catch (error) {
    console.error('Lỗi khi lấy push token:', error);
    return null;
  }
};

const PushNotificationManager: React.FC<PropsWithChildren> = ({ children }) => {
  const handleToken = useCallback(async () => {
    const token = await registerForPushNotificationsAsync();
    if (!token) return;
    const {
      setPushToken,
      pushToken,
      setHasRegisteredPushToken,
      hasRegisteredPushToken,
    } = useGlobalStore.getState();

    console.log('Push Token:', token);

    if (pushToken === token && hasRegisteredPushToken) {
      console.log(
        'Token đã được lưu trữ và đã được đăng ký, không gửi lại server'
      );
      return;
    }

    userApi
      .pushToken({
        token,
        deviceName: Device.deviceName || 'Unknown Device',
      })
      .then(() => {
        console.log('Đã gửi push token lên server');
        setPushToken(token);
        setHasRegisteredPushToken(true);
      })
      .catch((error) => {
        console.error('Lỗi khi gửi push token lên server:', error);
      });
  }, []);

  const handleNotificationReceived = useCallback(
    (notification: Notifications.Notification) => {
      const data = notification.request.content.data as NotificationPayload;
      console.log('Notification nhận được:', data);
      void syncDishByNotificationAction(data);
      void syncIngredientByNotificationAction(data);
    },
    []
  );

  const handleNotificationResponse = useCallback(
    (response: Notifications.NotificationResponse) => {
      const data = response.notification.request.content
        .data as NotificationPayload;
      console.log('User tap notification:', data);
      void syncDishByNotificationAction(data);
      void syncIngredientByNotificationAction(data);
      navigateByNotificationPayload(data);
    },
    []
  );

  useEffect(() => {
    handleToken();

    const receivedSubscription = Notifications.addNotificationReceivedListener(
      handleNotificationReceived
    );

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener(
        handleNotificationResponse
      );

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, [handleToken, handleNotificationReceived, handleNotificationResponse]);

  return <>{children}</>;
};

export default PushNotificationManager;
