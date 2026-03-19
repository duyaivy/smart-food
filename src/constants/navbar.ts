import {
  Handshake,
  History,
  Info,
  LockKeyhole,
  LogOut,
  Settings,
  User2,
} from 'lucide-react-native';

import { type NavbarItem } from '@/models/interfaces/common';

export const USER_LIST_ITEM = [
  {
    Icon: User2,
    text: 'Chỉnh sửa thông tin',
    isChevron: true,
    href: '/(stacks)/profile/edit',
    color: '#111',
  },
  {
    Icon: Settings,
    text: 'Cài đặt',
    isChevron: true,
    href: '/(stacks)/profile/settings',
  },
  {
    Icon: History,
    text: 'Lịch sử nấu ăn',
    isChevron: false,
    href: '/(stacks)/profile/history-cooking',
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
    href: '/(stacks)/profile/about-us',
  },
  {
    Icon: Handshake,
    text: 'Điều khoản và chính sách',
    isChevron: false,
    href: '/(stacks)/profile/privacy',
  },
  {
    Icon: LogOut,
    text: 'Đăng xuất',
    isChevron: false,
    color: '#FF3B30',
  },
] satisfies NavbarItem[];
