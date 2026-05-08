import {
  Home,
  Lightbulb,
  type LucideIcon,
  Refrigerator,
  Sparkles,
  User,
} from 'lucide-react-native';

import { ROUTE } from '@/constants/route';

export const TAB_ACTIVE_COLOR = '#E8734A';
export const TAB_INACTIVE_COLOR = '#A0A0A0';
export const TAB_BAR_BG = '#FFFFFF';
export const TAB_BAR_HEIGHT = 68;
export const TAB_BAR_BORDER_RADIUS = 24;

export const CENTER_BTN_SIZE = 60;
export const CENTER_BTN_COLOR_ACTIVE = '#D4623D';
export const CENTER_BTN_COLOR_DEFAULT = '#E8734A';

export interface TabItem {
  /** Route name as registered in Tabs.Screen */
  name: string;
  /** Exact href for router.push */
  href: string;
  /** User-facing label */
  label: string;
  /** Lucide icon component */
  Icon: LucideIcon;
  /** If true, this tab renders as the floating center action button */
  isCenter?: boolean;
  /** testID for accessibility/testing */
  testID?: string;
}

// ─── Tab Config ────────────────────────────────────────────────────────────────
// Order matters — laid out left-to-right. Center tab must be at index 2.

export const TAB_CONFIG: TabItem[] = [
  {
    name: 'index',
    href: ROUTE.TAB.HOME,
    label: 'Trang chủ',
    Icon: Home,
    testID: 'home-tab',
  },
  {
    name: 'discover/index',
    href: ROUTE.TAB.DISCOVER,
    label: 'Khám phá',
    Icon: Lightbulb,
    testID: 'discover-tab',
  },
  {
    name: 'recommendation/index',
    href: ROUTE.TAB.RECOMMENDATION,
    label: 'Gợi ý',
    Icon: Sparkles,
    isCenter: true,
    testID: 'recommendation-tab',
  },
  {
    name: 'fridge/index',
    href: ROUTE.TAB.FRIDGE,
    label: 'Tủ lạnh',
    Icon: Refrigerator,
    testID: 'fridge-tab',
  },
  {
    name: 'profile/index',
    href: ROUTE.TAB.PROFILE,
    label: 'Cá nhân',
    Icon: User,
    testID: 'profile-tab',
  },
];
