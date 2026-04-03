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
import { toDishId } from '@/lib/utils/format';

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

type NotificationPayload = {
  screen?: string;
  dishId?: number | string;
  action?: 'UPDATE' | 'DELETE' | 'CREATE' | string;
};

const syncDishByNotificationAction = async (payload: NotificationPayload) => {
  if (payload.screen !== 'DishDetail') return;
  if (
    payload.action !== 'UPDATE' &&
    payload.action !== 'DELETE' &&
    payload.action !== 'CREATE'
  ) {
    return;
  }

  const dishId = toDishId(payload.dishId);
  if (!dishId) return;

  const { removeDishDetail, setDishDetail, setStatus } =
    useDishStore.getState();

  setStatus('stale');

  if (payload.action === 'CREATE') {
    return;
  }

  if (payload.action === 'DELETE') {
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
  if (payload.action && payload.action !== 'CREATE') return;
  if (payload.screen !== 'DishDetail') return;

  const dishId = toDishId(payload.dishId);
  if (!dishId) return;

  router.push({
    pathname: ROUTE.STACK.DISCOVER.DISH_DETAIL,
    params: { id: String(dishId) },
  });
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
    const { setPushToken, pushToken } = useGlobalStore.getState();
    console.log('Push Token:', token);

    if (pushToken === token) {
      console.log('Token đã được lưu trữ, không gửi lại server');
      return;
    }

    setPushToken(token);
    await userApi.pushToken({
      token,
      deviceName: Device.deviceName || 'Unknown Device',
    });
  }, []);

  const handleNotificationReceived = useCallback(
    (notification: Notifications.Notification) => {
      const data = notification.request.content.data as NotificationPayload;
      console.log('Notification nhận được:', data);
      void syncDishByNotificationAction(data);
    },
    []
  );

  const handleNotificationResponse = useCallback(
    (response: Notifications.NotificationResponse) => {
      const data = response.notification.request.content
        .data as NotificationPayload;
      console.log('User tap notification:', data);
      void syncDishByNotificationAction(data);
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
