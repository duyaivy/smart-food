import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { type Meal } from '@/models/interfaces/recommendation';

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  /** Meal name */
  name: string;
  /** Total calories */
  calories: number;
  /** Protein in grams */
  protein: number;
  /** Fat in grams */
  fat: number;
  /** Carbs in grams */
  carb: number;
  /** Meal type for icon/label */
  type: Meal['type'];
  onCookNow?: () => void;
  onSwap?: () => void;
};

// ─── Type Label Map ───────────────────────────────────────────────────────────

const TYPE_LABEL: Record<Meal['type'], string> = {
  mainDish: '🍽️ Món chính',
  soup: '🥣 Canh / Nước',
  vegetable: '🥦 Rau xanh',
};

// ─── Component ────────────────────────────────────────────────────────────────

function MealCardBase({
  name,
  calories,
  protein,
  fat,
  carb,
  type,
  onCookNow,
  onSwap,
}: Props) {
  return (
    <View style={styles.card}>
      {/* Header row */}
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <Text className="text-label font-medium text-green-700">
            {TYPE_LABEL[type]}
          </Text>
          <Text className="mt-0.5 text-body-s font-semibold text-neutral-900">
            {name}
          </Text>
        </View>
        <View style={styles.calBadge}>
          <Text className="text-label font-bold text-orange-600">
            {calories}
          </Text>
          <Text className="text-xs text-neutral-500">kcal</Text>
        </View>
      </View>

      {/* Macro chips */}
      <View style={styles.macroRow}>
        <MacroChip label="Đạm" value={protein} color="#4ADE80" />
        <MacroChip label="Béo" value={fat} color="#FB923C" />
        <MacroChip label="Bột" value={carb} color="#FACC15" />
      </View>

      {/* Actions */}
      {(onSwap ?? onCookNow) ? (
        <View style={styles.actions}>
          {onSwap ? (
            <Pressable
              onPress={onSwap}
              style={[styles.btn, styles.btnOutline]}
              android_ripple={{
                color: 'rgba(239,68,68,0.12)',
                borderless: true,
              }}
            >
              <Text className="text-sm font-semibold text-red-500">
                Món khác
              </Text>
            </Pressable>
          ) : null}
          {onCookNow ? (
            <Pressable
              onPress={onCookNow}
              style={[styles.btn, styles.btnFilled]}
              android_ripple={{
                color: 'rgba(255,255,255,0.25)',
                borderless: true,
              }}
            >
              <Text className="text-sm font-semibold text-white">
                Nấu ăn ngay
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

// ─── Macro Chip ───────────────────────────────────────────────────────────────

function MacroChip({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <View style={[styles.chip, { borderColor: color }]}>
      <Text className="text-xs text-neutral-600">
        {label} {value}g
      </Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleGroup: { flex: 1, paddingRight: 8 },
  calBadge: { alignItems: 'flex-end' },
  macroRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  chip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  actions: { flexDirection: 'row', gap: 8 },
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
  btnOutline: { borderWidth: 1.5, borderColor: '#EF4444' },
  btnFilled: { backgroundColor: '#22C55E' },
});

/**
 * Memoized meal card. Accepts only primitives so FlashList's
 * item comparison works correctly (list-performance-item-memo rule).
 */
export const MealCard = memo(MealCardBase);
