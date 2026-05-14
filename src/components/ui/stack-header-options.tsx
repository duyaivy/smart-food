import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Platform, TouchableOpacity } from 'react-native';

import { ROUTE } from '@/constants/route';

// ─── Tokens ───────────────────────────────────────────────────────────────────

const HEADER_BG_LIGHT = '#FFFFFF';
const HEADER_BG_DARK = '#111111';
const HEADER_TITLE_LIGHT = '#1A1A1A';
const HEADER_TITLE_DARK = '#F5F5F5';
const BACK_ICON_COLOR_LIGHT = '#1A1A1A';
const BACK_ICON_COLOR_DARK = '#F5F5F5';
const BACK_ICON_SIZE = 24;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StackHeaderConfig {
  /** Screen title shown in the center of the header */
  title: string;
  /** Whether the app is in dark mode — pass `colorScheme === 'dark'` */
  dark?: boolean;
  /** Override or append extra options */
  extra?: NativeStackNavigationOptions;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Returns a consistent `NativeStackNavigationOptions` object for all child
 * screens inside `(stacks)/`. Use this in every domain `_layout.tsx` to keep
 * headers visually identical across the app.
 *
 * @example
 * ```tsx
 * <Stack.Screen name="edit" options={stackHeaderOptions({ title: 'Chỉnh sửa hồ sơ' })} />
 * ```
 */
export function stackHeaderOptions({
  title,
  dark = false,
  extra = {},
}: StackHeaderConfig): NativeStackNavigationOptions {
  const bg = dark ? HEADER_BG_DARK : HEADER_BG_LIGHT;
  const titleColor = dark ? HEADER_TITLE_DARK : HEADER_TITLE_LIGHT;
  const iconColor = dark ? BACK_ICON_COLOR_DARK : BACK_ICON_COLOR_LIGHT;

  return {
    headerShown: true,
    title,
    headerTitleAlign: 'center',
    headerShadowVisible: false,
    headerStyle: { backgroundColor: bg },
    headerTitleStyle: {
      fontSize: 18,
      fontWeight: '600',
      color: titleColor,
    },
    headerTintColor: iconColor,
    headerLeft: () => (
      <TouchableOpacity
        onPress={() => {
          if (router.canGoBack()) router.back();
          else router.push(ROUTE.STACK.DISCOVER.INGREDIENT);
        }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={{
          paddingHorizontal: Platform.OS === 'ios' ? 0 : 4,
        }}
        accessibilityLabel="Go back"
        accessibilityRole="button"
      >
        <ChevronLeft size={BACK_ICON_SIZE} color={iconColor} />
      </TouchableOpacity>
    ),
    ...extra,
  };
}
