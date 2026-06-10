export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER';

export type Unit = 'GRAM' | 'NUMBER' | 'SPOON';

export type MealHistorySortBy = 'CREATED_AT';

// ----- Request types -----
export type MealIngredientInput = {
  ingredientId: number;
  amount: number;
  unit: Unit;
  gramsEquivalent: number;
};

export type CreateMealInput = {
  dishId?: number;
  customName?: string;
  mealType?: MealType;
  note?: string;
  eatenAt?: Date;
  missingIngredientIds?: number[];
  allowMissingIngredients?: boolean;
  customIngredients?: MealIngredientInput[];
};

export type GetMealHistoryParams = {
  page?: number;
  limit?: number;
  fromDate?: Date;
  toDate?: Date;
  dishId?: number;
  sortBy?: MealHistorySortBy;
  sortOrder?: 'asc' | 'desc';
};

// ----- Response types -----
export interface MealHistoryListItem {
  id: number;
  userId: number;
  dishId: number | null;
  customName: string | null;
  isCustom: boolean;
  mealType: MealType | null;
  note: string | null;
  tag: string | null;
  totalKcal: number | null;
  totalProtein: number | null;
  totalCarb: number | null;
  totalFat: number | null;
  eatenAt: string; // ISO datetime
  createdAt: string;
  dish?: {
    id: number;
    name: string;
    images: string[];
  } | null;
}

export interface MealIngredientSnapshot {
  id: number;
  ingredientId: number | null;
  ingredientName: string;
  amount: number;
  unit: string;
  gramsEquivalent: number;
  kcal: number | null;
  protein: number | null;
  carb: number | null;
  fat: number | null;
}

export interface MealHistoryDetail extends MealHistoryListItem {
  snapshots: MealIngredientSnapshot[];
}

export interface MealListResult<T> {
  control: {
    total: number;
    page: number;
    limit: number;
  };
  results: T[];
}
