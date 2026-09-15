export interface MenuItem {
  id: string;
  name: string;
  category: string;
  ingredients: string;
  prices: {
    single?: string;
    small?: string;
    large?: string;
    family?: string;
  };
  badge?: string;
  weight?: string;
}

export interface MenuCategory {
  key: string;
  label: string;
  isTriplePrice?: boolean;
}

export interface CocktailItem {
  id: string;
  name: string;
  category: string;
  ingredients: string;
  description: string;
  image: string;
  badge?: string;
}

export interface SiteContent {
  header: {
    logoTitle: string;
    logoSubtitle: string;
    locationTag: string;
    phone: string;
    address: string;
    navAbout: string;
    navMenu: string;
    navAmbijent: string;
    navCocktails: string;
    navContact: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    btnMenu: string;
    btnComment: string;
    dishBadge: string;
    dishName: string;
    dishPrice: string;
    dishSize: string;
    badge1: string;
    badge2: string;
  };
  about: {
    eyebrow: string;
    title: string;
    description: string;
    card1Badge: string;
    card1Title: string;
    card2Badge: string;
    card2Title: string;
    card3Badge: string;
    card3Title: string;
  };
  specialties: {
    eyebrow: string;
    title: string;
    description: string;
    fbLabel: string;
    fbText: string;
  };
  gallery: {
    eyebrow: string;
    title: string;
    description: string;
    item1Title: string;
    item1Category: string;
    item2Title: string;
    item2Category: string;
    item3Title: string;
    item3Category: string;
    item4Title: string;
    item4Category: string;
    item5Title: string;
    item5Category: string;
    item6Title: string;
    item6Category: string;
  };
  cocktails: {
    eyebrow: string;
    title: string;
    description: string;
    bottomNote: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    address: string;
    phone: string;
    mobile: string;
    email: string;
    hoursWeek: string;
    hoursWeekend: string;
    note: string;
    formTitle: string;
    formDesc: string;
  };
  footer: {
    title: string;
    subtitle: string;
    aboutText: string;
    copyright: string;
    downloadText: string;
  };
}

export interface ReservationData {
  fullName: string;
  phone: string;
  guests: string;
  date: string;
  time: string;
  specialRequest?: string;
}

export interface CommentData {
  id?: string;
  fullName: string;
  contact?: string;
  rating: number;
  comment: string;
  createdAt?: string;
  status?: 'pending' | 'approved';
  emailSent?: boolean;
}
