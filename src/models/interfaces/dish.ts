import { type Difficulty } from '../types/dish';
import { type IIngredient as IIngredientType } from './ingredient';
export interface MiniDish {
  id: number;
  name: string;
  prepTimeMin: number | null;
  cookTimeMin: number | null;
  description: string | null;
  difficulty: Difficulty;
  images: string[];
  calories?: number | null;
  type?: DishType | null;
  ingredients?: IIngredient[];
}

export interface DishListResult {
  control: { total: number; page: number; limit: number };
  results: MiniDish[];
}
export type DishType = 'MAINDISH' | 'SOUP' | 'VEGETABLE';

export interface IDishIngredient {
  // thành phần la nguyen lieu tho
  id: number;
  dishId: number;
  ingredientId: number;
  amount: number;
  unit: string;
  gramsEquivalent: number;
}

export interface Instruction {
  title: string;
  content: string;
}

export interface IIngredient {
  ingredient?: IIngredientType;
  id: number;
  name: string;
  quantity: string;
  isAvailable: boolean;
}
export interface IDish {
  id: number;
  name: string;
  instructions?: Instruction[];
  images?: string[];
  description?: string;
  prepTimeMin?: number;
  cookTimeMin?: number;
  difficulty: Difficulty;
  isDeleted: boolean;
  calories: number;
  createdAt: Date;
  updatedAt: Date;
  ingredients: IIngredient[];
  type: DishType;
}
