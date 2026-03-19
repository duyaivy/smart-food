import {
  Handshake,
  History,
  Info,
  LockKeyhole,
  LogOut,
  Settings,
  User2,
} from 'lucide-react-native';

import { ROUTE } from '@/constants/route';
import { type NavbarItem } from '@/models/interfaces/common';

export const USER_LIST_ITEM = [
  {
    Icon: User2,
    text: 'Chỉnh sửa thông tin',
    isChevron: true,
    href: ROUTE.STACK.PROFILE.EDIT,
    color: '#111',
  },
  {
    Icon: Settings,
    text: 'Cài đặt',
    isChevron: true,
    href: ROUTE.STACK.PROFILE.SETTINGS,
  },
  {
    Icon: History,
    text: 'Lịch sử nấu ăn',
    isChevron: false,
    href: ROUTE.STACK.PROFILE.HISTORY_COOKING,
  },
  {
    Icon: LockKeyhole,
    text: 'Quên mật khẩu',
    isChevron: false,
  },
] satisfies NavbarItem[];

export const OTHER_LIST_ITEM = [
  {
    Icon: Info,
    text: 'Về chúng tôi',
    isChevron: false,
    href: ROUTE.STACK.PROFILE.ABOUT_US,
  },
  {
    Icon: Handshake,
    text: 'Điều khoản và chính sách',
    isChevron: false,
    href: ROUTE.STACK.PROFILE.PRIVACY,
  },
  {
    Icon: LogOut,
    text: 'Đăng xuất',
    isChevron: false,
    color: '#FF3B30',
  },
] satisfies NavbarItem[];
