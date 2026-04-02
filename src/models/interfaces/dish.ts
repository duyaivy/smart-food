import { type Difficulty } from '../types/dish';

export interface MiniDish {
  id: number;
  name: string;
  prepTimeMin: number | null;
  cookTimeMin: number | null;
  description: string | null;
  difficulty: Difficulty;
  images: string[];
  calories?: number | null;
}

export interface DishListResult {
  control: { total: number; page: number; limit: number };
  results: MiniDish[];
}

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
}
