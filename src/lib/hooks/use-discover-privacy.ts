import { useMMKVBoolean } from 'react-native-mmkv';

import { storage } from '@/lib/common/storage';

const HAS_SEEN_DISCOVER_PRIVACY = 'HAS_SEEN_DISCOVER_PRIVACY';

export const useDiscoverPrivacy = () => {
  const [hasSeenDiscoverPrivacy, setHasSeenDiscoverPrivacy] = useMMKVBoolean(
    HAS_SEEN_DISCOVER_PRIVACY,
    storage
  );

  return [hasSeenDiscoverPrivacy ?? false, setHasSeenDiscoverPrivacy] as const;
};
