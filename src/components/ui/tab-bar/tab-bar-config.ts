import {
  Flame,
  Home,
  Lightbulb,
  Refrigerator,
  User,
  type LucideIcon,
} from 'lucide-react-native';

// ─── Design Tokens ─────────────────────────────────────────────────────────────

export const TAB_ACTIVE_COLOR = '#E8734A';
export const TAB_INACTIVE_COLOR = '#A0A0A0';
export const TAB_BAR_BG = '#FFFFFF';
export const TAB_BAR_HEIGHT = 68;
export const TAB_BAR_BORDER_RADIUS = 24;

export const CENTER_BTN_SIZE = 60;
export const CENTER_BTN_COLOR_ACTIVE = '#D4623D';
export const CENTER_BTN_COLOR_DEFAULT = '#E8734A';

// ─── Tab Item Definition ───────────────────────────────────────────────────────

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
    href: '/',
    label: 'Trang chủ',
    Icon: Home,
    testID: 'home-tab',
  },
  {
    name: 'discover/index',
    href: '/discover',
    label: 'Khám phá',
    Icon: Lightbulb,
    testID: 'discover-tab',
  },
  {
    name: 'cooking/index',
    href: '/cooking',
    label: 'Nấu ăn',
    Icon: Flame,
    isCenter: true,
    testID: 'cooking-tab',
  },
  {
    name: 'fridge/index',
    href: '/fridge',
    label: 'Tủ lạnh',
    Icon: Refrigerator,
    testID: 'fridge-tab',
  },
  {
    name: 'profile/index',
    href: '/profile',
    label: 'Cá nhân',
    Icon: User,
    testID: 'profile-tab',
  },
];
