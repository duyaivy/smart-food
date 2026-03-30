import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import React, { type PropsWithChildren, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';

import { userApi } from '@/api/user.api';
import { useGlobalStore } from '@/lib/stores/use-global-store';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
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
      const data = notification.request.content.data;
      console.log('Notification nhận được:', data);
    },
    []
  );

  const handleNotificationResponse = useCallback(
    (response: Notifications.NotificationResponse) => {
      const data = response.notification.request.content.data;
      console.log('User tap notification:', data);
      // TODO: navigate theo data.screen
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
