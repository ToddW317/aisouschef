import { create } from 'zustand';
import { PantryItem } from '../types';

interface PantryStore {
  items: PantryItem[];
  addItem: (item: PantryItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
}

export const usePantryStore = create<PantryStore>((set) => ({
  items: [],
  addItem: (item) => 
    set((state) => ({
      items: [...state.items, item]
    })),
  removeItem: (id) => 
    set((state) => ({
      items: state.items.filter(item => item.id !== id)
    })),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    })),
})); 