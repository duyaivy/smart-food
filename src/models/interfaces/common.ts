import { type LinkProps } from 'expo-router';
import { type LucideIcon } from 'lucide-react-native';

export interface NavbarItem {
  Icon: LucideIcon;
  text: string;
  isChevron: boolean;
  color?: string;
  href?: LinkProps['href'];
  onPress?: () => void;
}

export interface SuccessResponse<Data> {
  message: string;
  data: Data;
}

export interface ErrorResponse<Data = unknown> {
  code?: number;
  message: string;
  data?: Data | null;
}
export interface PaginationResponse<T> {
  control: { total: number; page: number; limit: number };
  results: T[];
}
