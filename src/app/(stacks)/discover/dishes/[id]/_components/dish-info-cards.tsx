import { Clock3, Gauge, Utensils } from 'lucide-react-native';
import React from 'react';

import { Text, View } from '@/components/ui';
import { Icon } from '@/components/ui/icon';
import { DIFFICULTY_MAP } from '@/constants/common';
import { cn } from '@/lib/common/utils';
import { type Difficulty } from '@/models/types/dish';

type Props = {
  prepTimeMin?: number | null;
  cookTimeMin?: number | null;
  difficulty?: Difficulty | null;
};

type InfoCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
  valueClassName?: string;
};

function InfoCard({ title, value, icon, valueClassName }: InfoCardProps) {
  return (
    <View className="flex-1 flex-row items-center gap-2 rounded-xl bg-white p-3">
      {icon}
      <View>
        <Text className="text-label text-neutral-700">{title}</Text>
        <Text
          className={cn(
            'text-body-m font-semibold text-foreground',
            valueClassName
          )}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

export function DishInfoCards({ prepTimeMin, cookTimeMin, difficulty }: Props) {
  const difficultyMeta = difficulty ? DIFFICULTY_MAP[difficulty] : null;

  return (
    <View className="flex-row gap-2">
      <InfoCard
        title="Chuẩn bị"
        value={`${prepTimeMin ?? 0} phút`}
        icon={<Icon as={Utensils} className="text-primary-700" size={18} />}
      />
      <InfoCard
        title="Nấu ăn"
        value={`${cookTimeMin ?? 0} phút`}
        icon={<Icon as={Clock3} className="text-secondary-700" size={18} />}
      />
      <InfoCard
        title="Độ khó"
        value={difficultyMeta?.label ?? 'N/A'}
        valueClassName={difficultyMeta?.textClassName}
        icon={
          <Icon
            as={Gauge}
            className={difficultyMeta?.iconClassName ?? 'text-neutral-500'}
            size={18}
          />
        }
      />
    </View>
  );
}
