import type { FridgeItemPriority } from '@/models/types/fridge';

import type { IIngredient } from './ingredient';

export interface IFridgeItem {
  id: number;
  fridgeId: number;
  ingredientId: number;
  dueDate: Date | string;
  priority: FridgeItemPriority;
  quantity: number;
  deleteAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  ingredient?: IIngredient;
}

export interface ICreateFridgeItemBody {
  ingredientId: number;
  quantity: number;
  dueDate: string;
  priority: FridgeItemPriority;
}

export interface IUpdateFridgeItemBody {
  quantity?: number;
  dueDate?: string;
  priority?: FridgeItemPriority;
}
