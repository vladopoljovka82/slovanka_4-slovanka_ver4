import { MenuItem, MenuCategory } from '../types';
import { MENU_ITEMS } from '../data/menuData';

const MENU_ITEMS_STORAGE_KEY = 'slovanka_menu_items_v1';
const MENU_CATEGORIES_STORAGE_KEY = 'slovanka_menu_categories_v1';

export const DEFAULT_CATEGORIES: MenuCategory[] = [
  { key: 'pizze', label: 'Pizze', isTriplePrice: true },
  { key: 'paste', label: 'Paste & Rezanci' },
  { key: 'glavna', label: 'Glavna Jela' },
  { key: 'salate', label: 'Obrok Salate' },
  { key: 'poslastice', label: 'Palačinke & Poslastice' },
  { key: 'dorucak', label: 'Doručak & Topla Jela' },
];

export function getStoredCategories(): MenuCategory[] {
  if (typeof window === 'undefined') return DEFAULT_CATEGORIES;
  try {
    const data = localStorage.getItem(MENU_CATEGORIES_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(MENU_CATEGORIES_STORAGE_KEY, JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading categories from storage', e);
    return DEFAULT_CATEGORIES;
  }
}

export function saveStoredCategories(categories: MenuCategory[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MENU_CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    window.dispatchEvent(new CustomEvent('slovanka_menu_updated'));
  } catch (e) {
    console.error('Error saving categories', e);
  }
}

export function getStoredMenuItems(): MenuItem[] {
  if (typeof window === 'undefined') return MENU_ITEMS;
  try {
    const data = localStorage.getItem(MENU_ITEMS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(MENU_ITEMS_STORAGE_KEY, JSON.stringify(MENU_ITEMS));
      return MENU_ITEMS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading menu items from storage', e);
    return MENU_ITEMS;
  }
}

export function saveStoredMenuItems(items: MenuItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MENU_ITEMS_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('slovanka_menu_updated'));
  } catch (e) {
    console.error('Error saving menu items', e);
  }
}

export function addMenuItem(item: MenuItem): void {
  const items = getStoredMenuItems();
  items.unshift(item);
  saveStoredMenuItems(items);
}

export function updateMenuItem(updatedItem: MenuItem): void {
  const items = getStoredMenuItems();
  const idx = items.findIndex((i) => i.id === updatedItem.id);
  if (idx !== -1) {
    items[idx] = updatedItem;
    saveStoredMenuItems(items);
  }
}

export function deleteMenuItem(id: string): void {
  const items = getStoredMenuItems();
  const filtered = items.filter((i) => i.id !== id);
  saveStoredMenuItems(filtered);
}

export function addCategory(category: MenuCategory): void {
  const categories = getStoredCategories();
  if (categories.some((c) => c.key === category.key)) {
    return; // Already exists
  }
  categories.push(category);
  saveStoredCategories(categories);
}

export function deleteCategory(categoryKey: string): void {
  const categories = getStoredCategories();
  const filteredCategories = categories.filter((c) => c.key !== categoryKey);
  saveStoredCategories(filteredCategories);

  // Also remove items belonging to this category
  const items = getStoredMenuItems();
  const filteredItems = items.filter((i) => i.category !== categoryKey);
  saveStoredMenuItems(filteredItems);
}

export function resetMenuToDefault(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MENU_CATEGORIES_STORAGE_KEY, JSON.stringify(DEFAULT_CATEGORIES));
  localStorage.setItem(MENU_ITEMS_STORAGE_KEY, JSON.stringify(MENU_ITEMS));
  window.dispatchEvent(new CustomEvent('slovanka_menu_updated'));
}
