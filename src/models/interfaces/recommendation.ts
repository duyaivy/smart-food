import { type DishType } from './dish';
import { type IMissingIngredient } from './ingredient';

export interface MealSlotStructure {
  mainDish: number;
  soup: number;
  vegetable: number;
}

export interface MealStructure {
  breakfast: MealSlotStructure;
  lunch: MealSlotStructure;
  dinner: MealSlotStructure;
}

export interface RecommendationInput {
  planDays: number;
  startDate: string;
  mealStructure: MealStructure;
  goal: { targetKg: number };
}

export interface RecommendationMeal {
  dishId: string | number;
  role: DishType;
  missingIngredient?: IMissingIngredient[];
}

export interface Meal {
  type: 'mainDish' | 'soup' | 'vegetable';
}

export interface DailyMeals {
  breakfast: RecommendationMeal[];
  lunch: RecommendationMeal[];
  dinner: RecommendationMeal[];
}

export interface DailyNutrition {
  calories: number;
  protein: number;
  fat: number;
  carb: number;
}

export interface DailyPlan {
  day: number;
  date: string; // ISO date string
  meals: DailyMeals;
  nutrition: DailyNutrition;
}
export interface Summary {
  avgDailyCalories: number;
  targetCalories: number;
  deviation: number;
  avgDailyProtein: number;
  avgDailyCarbs: number;
  avgDailyFat: number;
}

export interface RecommendationPlan {
  summary: Summary;
  plan: DailyPlan[];
  shoppingList?: IMissingIngredient[];
}

export type RecommendationJobStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILED';

export interface RecommendationOutput {
  jobId: number;
  status: RecommendationJobStatus;
  input: RecommendationInput;
  output: RecommendationPlan;
  message?: string;
}

export interface CreateRecommendationResponse {
  jobId: number;
  status: RecommendationJobStatus;
}
