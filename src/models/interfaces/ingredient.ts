import { type UnitType } from '../types/dish';

export interface IIngredient {
  id: number;
  name: string;
  images?: string[];
  categoryId?: number;
  description?: string;
  isDeleted: boolean;
  protein?: number;
  unit?: UnitType;
  fat?: number;
  carb?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  description?: string;
  isDeleted?: boolean;
}

export interface ICategoryDetail extends ICategory {
  ingredients: IIngredient[];
}
