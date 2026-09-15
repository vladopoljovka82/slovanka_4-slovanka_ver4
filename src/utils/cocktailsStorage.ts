import { CocktailItem } from '../types';

const COCKTAILS_STORAGE_KEY = 'slovanka_cocktails_v1';

export const DEFAULT_COCKTAILS: CocktailItem[] = [
  {
    id: 'koktel-1',
    name: 'Virgin Mojito',
    category: 'Osvežavajući Mocktail',
    ingredients: 'Limeta • Sveža nana • Smeđi šećer • Gazirana voda • Drobljeni led',
    description:
      'Vrhunski balans sveže ceđene limete, aromatičnih listića nane i penušave svežine preko finog leda. Idealan izbor za vrele letnje dane na našoj terasi.',
    image: './koktel1.jpg',
    badge: 'Favorit Gostiju',
  },
  {
    id: 'koktel-2',
    name: 'Safe Spritz',
    category: 'Aperitiv Bez Alkohola',
    ingredients: 'Crvena pomorandža • Ruzmarin • Bitter tonik • Penušava voda',
    description:
      'Elegantna letnja kreacija sa sočnim kriškama pomorandže, aromatičnim ruzmarinom i prepoznatljivim gorko-slatkim notama mediteranskog spritza.',
    image: './koktel2.jpg',
    badge: 'Preporuka Kuće',
  },
  {
    id: 'koktel-3',
    name: 'Berry Smash',
    category: 'Voćna Eksplozija',
    ingredients: 'Šumsko voće • Borovnice • Maline • Svež limun • Menta',
    description:
      'Bogata fuzija mrvljenih borovnica i malina sa citrusnim notama i aromatičnom mentom na obilnom drobljenom ledu. Punoća ukusa u svakom gutljaju.',
    image: './koktel3.jpg',
    badge: '',
  },
  {
    id: 'koktel-4',
    name: 'Tropical Passion',
    category: 'Egzotični Miks',
    ingredients: 'Marakuja • Mango nektar • Limeta • Penušavi tonik',
    description:
      'Harmoničan spoj egzotične marakuje i baršunastog manga, prožet svežinom limete i delikatnim mehurićima za pravo tropsko rashlađenje.',
    image: './koktel4.jpg',
    badge: '',
  },
];

export function getStoredCocktails(): CocktailItem[] {
  if (typeof window === 'undefined') return DEFAULT_COCKTAILS;
  try {
    const raw = localStorage.getItem(COCKTAILS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(COCKTAILS_STORAGE_KEY, JSON.stringify(DEFAULT_COCKTAILS));
      return DEFAULT_COCKTAILS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length >= 4) {
      return parsed;
    }
    return DEFAULT_COCKTAILS;
  } catch (e) {
    console.error('Error reading cocktails from localStorage', e);
    return DEFAULT_COCKTAILS;
  }
}

export function saveStoredCocktails(cocktails: CocktailItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(COCKTAILS_STORAGE_KEY, JSON.stringify(cocktails));
    window.dispatchEvent(new CustomEvent('slovanka_cocktails_updated', { detail: cocktails }));
  } catch (e) {
    console.error('Error saving cocktails to localStorage', e);
  }
}

export function resetStoredCocktails(): CocktailItem[] {
  if (typeof window === 'undefined') return DEFAULT_COCKTAILS;
  try {
    localStorage.setItem(COCKTAILS_STORAGE_KEY, JSON.stringify(DEFAULT_COCKTAILS));
    window.dispatchEvent(new CustomEvent('slovanka_cocktails_updated', { detail: DEFAULT_COCKTAILS }));
    return DEFAULT_COCKTAILS;
  } catch (e) {
    console.error('Error resetting cocktails', e);
    return DEFAULT_COCKTAILS;
  }
}
