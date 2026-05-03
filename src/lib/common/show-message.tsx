import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import FlashMessage, {
  hideMessage,
  type MessageOptions,
  showMessage as flashShowMessage,
} from 'react-native-flash-message';

import colors from '@/constants/colors';

export type AppMessageType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'default';

type ShowAppMessageParams = {
  message: string;
  description?: string;
  type?: AppMessageType;
  duration?: number;
  actionLabel?: string;
  onActionPress?: () => void;
};

const MESSAGE_CONFIG = Object.freeze({
  success: {
    backgroundColor: colors.success[50],
    titleColor: colors.success[800],
    descriptionColor: colors.success[700],
    iconColor: colors.success[700],
    iconName: 'checkmark-circle' as const,
  },
  error: {
    backgroundColor: colors.danger[50],
    titleColor: colors.danger[800],
    descriptionColor: colors.danger[700],
    iconColor: colors.danger[700],
    iconName: 'close-circle' as const,
  },
  warning: {
    backgroundColor: colors.warning[50],
    titleColor: colors.warning[800],
    descriptionColor: colors.warning[700],
    iconColor: colors.warning[700],
    iconName: 'warning' as const,
  },
  info: {
    backgroundColor: colors.primary[50],
    titleColor: colors.primary[800],
    descriptionColor: colors.primary[700],
    iconColor: colors.primary[700],
    iconName: 'information-circle' as const,
  },
  default: {
    backgroundColor: colors.neutral[50],
    titleColor: colors.neutral[900],
    descriptionColor: colors.neutral[700],
    iconColor: colors.neutral[700],
    iconName: 'notifications' as const,
  },
} as const);

export const showMessage = ({
  message,
  description,
  type = 'success',
  duration = 3000,
  actionLabel,
  onActionPress,
}: ShowAppMessageParams) => {
  const config = MESSAGE_CONFIG[type];
  const hasAction = Boolean(actionLabel);

  flashShowMessage({
    message: hasAction ? '' : message,
    description: hasAction ? undefined : description,
    type: 'default',
    position: 'top',
    floating: true,
    autoHide: true,
    duration: hasAction ? Math.max(duration, 8000) : duration,
    hideOnPress: !hasAction,

    icon: () => (
      <Ionicons
        name={config.iconName}
        size={22}
        color={config.iconColor}
        style={{ marginRight: 8 }}
      />
    ),

    renderCustomContent: () =>
      hasAction ? (
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: config.titleColor,
              fontSize: 14,
              fontWeight: '700',
              lineHeight: 20,
            }}
          >
            {message}
          </Text>

          {description ? (
            <Text
              style={{
                marginTop: 4,
                color: config.descriptionColor,
                fontSize: 13,
                lineHeight: 18,
              }}
            >
              {description}
            </Text>
          ) : null}

          <Pressable
            hitSlop={8}
            onPress={() => {
              hideMessage();
              onActionPress?.();
            }}
            style={({ pressed }) => ({
              alignSelf: 'flex-start',
              marginTop: 8,
              opacity: pressed ? 0.65 : 1,
              paddingVertical: 2,
            })}
          >
            <Text
              style={{
                color: colors.primary[800],
                fontSize: 13,
                fontWeight: '800',
              }}
            >
              {actionLabel}
            </Text>
          </Pressable>
        </View>
      ) : null,

    style: {
      backgroundColor: config.backgroundColor,
      borderRadius: 14,
      paddingVertical: 12,
      paddingHorizontal: 14,
      minHeight: 64,
      alignItems: 'center',
    },

    titleStyle: {
      color: config.titleColor,
      fontSize: 14,
      fontWeight: '700',
      lineHeight: 20,
    },

    textStyle: {
      color: config.descriptionColor,
      fontSize: 13,
      lineHeight: 18,
    },
  } as MessageOptions);
};

export { hideMessage };

export const FlashMessageProvider = () => {
  return <FlashMessage position="top" floating />;
};
