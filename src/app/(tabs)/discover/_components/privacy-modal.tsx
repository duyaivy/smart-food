import { TriangleAlert } from 'lucide-react-native';
import React from 'react';
import { Modal } from 'react-native';

import { Pressable, Text, View } from '@/components/ui';
import { Icon } from '@/components/ui/icon';

type PrivacyModalProps = {
  visible: boolean;
  onConfirm: () => void;
};

export function PrivacyModal({ visible, onConfirm }: PrivacyModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View className="w-full rounded-2xl bg-white p-5">
          <View className="mb-3 flex-row items-center gap-2">
            <Icon as={TriangleAlert} size={20} className="text-orange-500" />
            <Text className="text-lg font-bold text-black">
              Lưu ý về quyền riêng tư
            </Text>
          </View>

          <Text className="leading-6 text-neutral-700">
            Để cá nhân hóa nội dung Khám phá, SmartFood có thể sử dụng thông tin
            như độ tuổi, chiều cao, cân nặng và lịch sử ăn uống của bạn. Thông
            tin này được xử lý theo Chính sách bảo mật của ứng dụng.
          </Text>

          <Pressable
            onPress={onConfirm}
            className="mt-5 rounded-xl bg-primary py-3"
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text className="text-center font-semibold text-white">
              Đã hiểu
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
