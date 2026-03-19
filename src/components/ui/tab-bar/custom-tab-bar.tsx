import { type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  CENTER_BTN_COLOR_ACTIVE,
  CENTER_BTN_COLOR_DEFAULT,
  CENTER_BTN_SIZE,
  TAB_ACTIVE_COLOR,
  TAB_BAR_BG,
  TAB_BAR_BORDER_RADIUS,
  TAB_BAR_HEIGHT,
  TAB_CONFIG,
  TAB_INACTIVE_COLOR,
} from './tab-bar-config';

// ─── Constants ─────────────────────────────────────────────────────────────────

const CENTER_TAB_INDEX = 2;
const ICON_SIZE = 22;
const CENTER_ICON_SIZE = 26;
const LABEL_FONT_SIZE = 11;

// ─── Sub-components ────────────────────────────────────────────────────────────

interface RegularTabProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onPress: () => void;
  testID?: string;
}

function RegularTab({ icon: Icon, label, active, onPress, testID }: RegularTabProps) {
  const color = active ? TAB_ACTIVE_COLOR : TAB_INACTIVE_COLOR;
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={styles.regularTab}
      android_ripple={{ color: 'rgba(232,115,74,0.12)', borderless: true, radius: 32 }}
    >
      <Icon size={ICON_SIZE} color={color} strokeWidth={active ? 2.2 : 1.8} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </Pressable>
  );
}

interface CenterTabProps {
  active: boolean;
  onPress: () => void;
  testID?: string;
}

function CenterTab({ active, onPress, testID }: CenterTabProps) {
  const { Icon } = TAB_CONFIG[CENTER_TAB_INDEX];
  const bg = active ? CENTER_BTN_COLOR_ACTIVE : CENTER_BTN_COLOR_DEFAULT;

  return (
    <View style={styles.centerTabWrapper}>
      <Pressable
        testID={testID}
        onPress={onPress}
        style={[styles.centerBtn, { backgroundColor: bg }]}
        android_ripple={{ color: 'rgba(255,255,255,0.25)', borderless: true, radius: CENTER_BTN_SIZE / 2 }}
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
    <View style={[styles.outerWrapper, containerStyle]}>
      <View style={styles.bar}>
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

const SHADOW = Platform.select({
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

const styles = StyleSheet.create({
  outerWrapper: {
    backgroundColor: TAB_BAR_BG,
    borderTopLeftRadius: TAB_BAR_BORDER_RADIUS,
    borderTopRightRadius: TAB_BAR_BORDER_RADIUS,
    ...SHADOW,
  },
  bar: {
    flexDirection: 'row',
    height: TAB_BAR_HEIGHT,
    alignItems: 'flex-end',
    paddingBottom: 10,
    paddingHorizontal: 8,
  },
  regularTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 3,
    paddingBottom: 2,
    minHeight: 48, // accessibility minimum
  },
  label: {
    fontSize: LABEL_FONT_SIZE,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  // ── Center tab ────────────────────────────────────────────────────────────
  centerTabWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    // The button floats above the bar; we need extra space at top
    paddingTop: CENTER_BTN_SIZE / 2 + 4,
  },
  centerBtn: {
    width: CENTER_BTN_SIZE,
    height: CENTER_BTN_SIZE,
    borderRadius: CENTER_BTN_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    // Lift it above the bar surface
    position: 'absolute',
    top: -(CENTER_BTN_SIZE / 2) - 8,
    // Drop shadow for the floating button
    ...Platform.select({
      ios: {
        shadowColor: '#E8734A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.45,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});
