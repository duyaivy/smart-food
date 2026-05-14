import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { type DailyNutrition } from '@/models/interfaces/recommendation';

type Props = {
  date: string;
  dayLabel: string;
  nutrition: DailyNutrition;
};

type MacroBarProps = {
  label: string;
  value: number;
  target: number;
  color: string;
};

function MacroBar({ label, value, target, color }: MacroBarProps) {
  const pct = target > 0 ? Math.min((value / target) * 100, 100) : 0;

  return (
    <View style={styles.macroWrapper}>
      <Text className="text-label font-semibold text-neutral-800">{label}</Text>
      <Text className="mt-0.5 text-xs text-neutral-500">
        {Math.round(value)}/{target}g
      </Text>
      <View style={styles.track}>
        <View
          style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]}
        />
      </View>
    </View>
  );
}

function DailySummaryBase({ date, dayLabel, nutrition }: Props) {
  const calories = nutrition.calories ?? 0;
  const protein = nutrition.protein ?? 0;
  const fat = nutrition.fat ?? 0;
  const carb = nutrition.carb ?? 0;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text className="text-body-s font-bold text-neutral-900">
            {dayLabel}
          </Text>
          <Text className="text-label text-neutral-500">{date}</Text>
        </View>
        <View style={styles.calGroup}>
          <Text className="text-label text-neutral-500">Tổng calo</Text>
          <Text className="text-xl font-bold text-green-500">
            {Math.round(calories)}
          </Text>
        </View>
      </View>

      <View style={styles.macroRow}>
        <MacroBar
          label="Chất đạm"
          value={protein}
          target={90}
          color="#4ADE80"
        />
        <MacroBar label="Chất béo" value={fat} target={70} color="#FB923C" />
        <MacroBar label="Tinh bột" value={carb} target={110} color="#FACC15" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    gap: 14,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  calGroup: { alignItems: 'flex-end' },
  macroRow: { flexDirection: 'row', gap: 12 },
  macroWrapper: { flex: 1 },
  track: {
    marginTop: 4,
    height: 5,
    borderRadius: 99,
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 99 },
});

export const DailySummary = memo(DailySummaryBase);
