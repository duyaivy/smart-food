import type { MealType } from '@/models/interfaces/meal';

export interface DailyNutritionData {
  date: string;
  total: {
    calories: number;
    protein: number;
    carb: number;
    fat: number;
  };
  meals: {
    mealType: MealType;
    calories: number;
    protein: number;
    carb: number;
    fat: number;
  }[];
}

export interface WeeklyNutritionData {
  week: string;
  dailyAverage: {
    calories: number;
    protein: number;
    carb: number;
    fat: number;
  };
  dailyTotals: {
    date: string;
    calories: number;
    protein: number;
    carb: number;
    fat: number;
  }[];
}

export interface DailyRemainingData {
  date: string;
  remaining: {
    calories: number;
    protein: number;
    carb: number;
    fat: number;
  };
  percentageConsumed: {
    calories: number;
    protein: number;
    carb: number;
    fat: number;
  };
}
