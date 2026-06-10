import { format } from 'date-fns';
import { Clock, Flame } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';

import { Card, CardContent } from '@/components/ui/card';
import { MacroBadge } from '@/components/ui/macro-badge';
import { Text } from '@/components/ui/text';
import { useDishDetail } from '@/lib/hooks/use-dish-detail';
import { type MealHistoryListItem } from '@/models/interfaces/meal';

type Props = {
  meal: MealHistoryListItem;
  onPress: () => void;
};

const mealTypeLabels: Record<string, string> = {
  BREAKFAST: 'Sáng',
  LUNCH: 'Trưa',
  DINNER: 'Tối',
};

const mealTypeColors: Record<string, { badge: string; dot: string }> = {
  BREAKFAST: { badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400' },
  LUNCH: { badge: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  DINNER: { badge: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-500' },
};

export const MealCard = ({ meal, onPress }: Props) => {
  const { dish } = useDishDetail(meal.dishId ?? 0);

  const mealType = meal.mealType || 'UNKNOWN';
  const typeLabel = mealTypeLabels[mealType] || 'Bữa ăn';
  const colors = mealTypeColors[mealType] || {
    badge: 'bg-neutral-100 text-neutral-700',
    dot: 'bg-neutral-400',
  };

  const mealName =
    meal.dish?.name ?? dish?.name ?? meal.customName ?? typeLabel;

  const eatenTime = meal.eatenAt ? format(new Date(meal.eatenAt), 'HH:mm') : '';

  const kcal = meal.totalKcal ? Math.round(meal.totalKcal) : null;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card className="mb-3">
        <CardContent className="flex-row items-start gap-3 pb-3 pt-4">
          {/* Dot indicator */}
          <View className={`mt-1 size-3 rounded-full ${colors.dot}`} />
          <View className="flex-1 gap-1">
            <View className="flex-row items-center gap-2">
              <View className={`rounded-full px-2 py-0.5 ${colors.badge}`}>
                <Text
                  className={`text-xs font-medium ${colors.badge.split(' ')[1]}`}
                >
                  {typeLabel}
                </Text>
              </View>
              <Text className="text-muted-foreground text-xs">{eatenTime}</Text>
            </View>
            <Text className="text-base font-semibold">{mealName}</Text>
            <View className="mt-1 flex-row items-center gap-3">
              <View className="flex-row items-center gap-1">
                <Clock size={14} className="text-muted-foreground" />
                <Text className="text-muted-foreground text-xs">
                  {eatenTime}
                </Text>
              </View>
              {kcal !== null && (
                <View className="flex-row items-center gap-1">
                  <Flame size={14} className="text-orange-500" />
                  <Text className="text-xs font-medium text-orange-600">
                    {kcal} kcal
                  </Text>
                </View>
              )}
            </View>
            {/* Macros row */}
            <View className="mt-2 flex-row gap-2">
              <MacroBadge
                label="Protein"
                value={meal.totalProtein || undefined}
                color="text-blue-600"
              />
              <MacroBadge
                label="Carb"
                value={meal.totalCarb || undefined}
                color="text-green-600"
              />
              <MacroBadge
                label="Fat"
                value={meal.totalFat || undefined}
                color="text-yellow-600"
              />
            </View>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
};
