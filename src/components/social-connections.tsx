import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useColorScheme } from 'nativewind';
import { Platform, View } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';

const SOCIAL_CONNECTION_STRATEGIES = [
  {
    type: 'oauth_apple',
    label: 'Apple',
  },
  {
    type: 'oauth_google',
    label: 'Google',
  },
  {
    type: 'oauth_github',
    label: 'GitHub',
  },
] as const;

export function SocialConnections() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  function renderIcon(type: (typeof SOCIAL_CONNECTION_STRATEGIES)[number]['type']) {
    switch (type) {
      case 'oauth_apple':
        return <AntDesign name="apple1" size={18} color={isDark ? 'white' : 'black'} />;
      case 'oauth_google':
        return <AntDesign name="google" size={18} color="#DB4437" />;
      case 'oauth_github':
        return <AntDesign name="github" size={18} color={isDark ? 'white' : 'black'} />;
      default:
        return <FontAwesome name="circle" size={18} color={isDark ? 'white' : 'black'} />;
    }
  }

  return (
    <View className="gap-2 sm:flex-row sm:gap-3">
      {SOCIAL_CONNECTION_STRATEGIES.map((strategy) => {
        return (
          <Button
            key={strategy.type}
            variant="outline"
            size="sm"
            className="h-11 flex-row items-center justify-center gap-2 border-zinc-700 bg-zinc-800 sm:flex-1"
            onPress={() => {
              // TODO: Xử lý đăng nhập mạng xã hội
            }}
          >
            {renderIcon(strategy.type)}
            {Platform.OS !== 'web' ? (
              <Text className="text-sm text-white">{strategy.label}</Text>
            ) : null}
          </Button>
        );
      })}
    </View>
  );
}