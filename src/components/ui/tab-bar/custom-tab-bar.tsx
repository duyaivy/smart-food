import { type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Pressable, Text, View } from '@/components/ui';

import {
  CENTER_BTN_COLOR_ACTIVE,
  CENTER_BTN_COLOR_DEFAULT,
  CENTER_BTN_SIZE,
  TAB_ACTIVE_COLOR,
  TAB_BAR_BG,
  TAB_BAR_HEIGHT,
  TAB_CONFIG,
  TAB_INACTIVE_COLOR,
} from './tab-bar-config';

const CENTER_TAB_INDEX = 2;
const ICON_SIZE = 22;
const CENTER_ICON_SIZE = 26;

type RegularTabProps = {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onPress: () => void;
  testID?: string;
};

function RegularTab({
  icon: Icon,
  label,
  active,
  onPress,
  testID,
}: RegularTabProps) {
  const color = active ? TAB_ACTIVE_COLOR : TAB_INACTIVE_COLOR;
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      className="min-h-[48px] flex-1 items-center justify-end gap-[3px] pb-0.5"
      android_ripple={{
        color: 'rgba(232,115,74,0.12)',
        borderless: true,
        radius: 32,
      }}
    >
      <Icon size={ICON_SIZE} color={color} strokeWidth={active ? 2.2 : 1.8} />
      <Text
        className="text-[11px] font-semibold tracking-[0.1px]"
        style={{ color }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

type CenterTabProps = {
  active: boolean;
  onPress: () => void;
  testID?: string;
};

function CenterTab({ active, onPress, testID }: CenterTabProps) {
  const { Icon } = TAB_CONFIG[CENTER_TAB_INDEX];
  const bg = active ? CENTER_BTN_COLOR_ACTIVE : CENTER_BTN_COLOR_DEFAULT;

  return (
    <View
      className="flex-1 items-center justify-end"
      style={{ paddingTop: CENTER_BTN_SIZE / 2 + 4 }}
    >
      <Pressable
        testID={testID}
        onPress={onPress}
        className="absolute items-center justify-center rounded-full"
        style={[
          {
            width: CENTER_BTN_SIZE,
            height: CENTER_BTN_SIZE,
            top: -(CENTER_BTN_SIZE / 2) - 8,
            backgroundColor: bg,
          },
          centerButtonShadowStyle,
        ]}
        android_ripple={{
          color: 'rgba(255,255,255,0.25)',
          borderless: true,
          radius: CENTER_BTN_SIZE / 2,
        }}
      >
        <Icon size={CENTER_ICON_SIZE} color="#FFFFFF" strokeWidth={2.2} />
      </Pressable>
    </View>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const containerStyle: ViewStyle = {
    paddingBottom: Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0),
  };

  return (
    <View
      className="rounded-t-3xl"
      style={[
        { backgroundColor: TAB_BAR_BG },
        containerStyle,
        outerWrapperShadowStyle,
      ]}
    >
      <View
        className="flex-row items-end px-2 pb-2.5"
        style={{ height: TAB_BAR_HEIGHT }}
      >
        {TAB_CONFIG.map((tab) => {
          const routeIndex = state.routes.findIndex((r) => r.name === tab.name);
          if (routeIndex === -1) return null;

          const route = state.routes[routeIndex];
          const isFocused = state.index === routeIndex;

          const handlePress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              // Ensure absolute route mapping using exact href
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              router.push(tab.href as any);
            }
          };

          if (tab.isCenter) {
            return (
              <CenterTab
                key={tab.name}
                active={isFocused}
                onPress={handlePress}
                testID={tab.testID}
              />
            );
          }

          return (
            <RegularTab
              key={tab.name}
              icon={tab.Icon}
              label={tab.label}
              active={isFocused}
              onPress={handlePress}
              testID={tab.testID}
            />
          );
        })}
      </View>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const outerWrapperShadowStyle = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  android: {
    elevation: 12,
  },
});

const centerButtonShadowStyle = Platform.select({
  ios: {
    shadowColor: '#E8734A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
  },
  android: {
    elevation: 8,
  },
});
