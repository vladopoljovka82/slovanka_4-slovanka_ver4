import { SiteContent } from '../types';

const SITE_CONTENT_STORAGE_KEY = 'slovanka_site_content_v1';

export const DEFAULT_SITE_CONTENT: SiteContent = {
  header: {
    logoTitle: 'SLOVANKA',
    logoSubtitle: 'Caffe & Pizzeria',
    locationTag: 'SELENČA',
    phone: '+381 (0) 21 774 012',
    address: 'M. Tita 165, 21425 Selenča, Vojvodina, Srbija',
    navAbout: 'O Nama',
    navMenu: 'Jelovnik',
    navAmbijent: 'Ambijent',
    navCocktails: 'Kokteli',
    navContact: 'Kontakt & Komentari',
  },
  hero: {
    eyebrow: 'Gastro Doživljaj',
    title: 'Raznovrsni ukusi i tradicija u prijatnom ambijentu.',
    description:
      'Dobrodošli u Slovanku. Mesto gde se hrskave italijanske pice, domaći vojvođanski specijaliteti i vrhunska kafa susreću u ambijentu stvorenom za opuštanje.',
    btnMenu: 'Istražite Jelovnik',
    btnComment: 'Ostavite Komentar',
    dishBadge: 'Preporuka Kuće',
    dishName: 'Slovan Pica sa Duplim Testom',
    dishPrice: '850 RSD',
    dishSize: 'velika',
    badge1: 'Originalna Receptura',
    badge2: 'Vrhunska Ocena Gostiju',
  },
  about: {
    eyebrow: 'Naša Priča',
    title: 'Ambijent za Svaki Trenutak Dana',
    description:
      'Bilo da je reč o prvoj jutarnjoj espreso kafi u prijatnom kutku terase, porodičnom ručku ili večeri uz društvo i bogatu trpezu, u Slovanki se osećate kao kod kuće.',
    card1Badge: 'Otvoreno Nebo',
    card1Title: 'Letnja Terasa i Sunčani Dani',
    card2Badge: 'Udobnost & Druženje',
    card2Title: 'Restoranska Sala sa Retro Šarmom',
    card3Badge: 'Vrhunski Zalogaj',
    card3Title: 'Originalna Receptura i Domaća Kafa',
  },
  specialties: {
    eyebrow: 'Ukus i Ambijent',
    title: 'Restoran & Pizzeria Slovanka',
    description:
      'Posvećeni smo stvaranju autentičnog gastronomskog ugođaja, gde je svaki zalogaj odraz ljubavi prema kvalitetnoj hrani, a svaki trenutak prilika za lepa sećanja i ugodne susrete.',
    fbLabel: 'Pratite nas na:',
    fbText: 'Facebook Stranici',
  },
  gallery: {
    eyebrow: 'Pogled Iznutra',
    title: 'Naš Ambijent',
    description: 'Harmonija detalja, toplina drveta i sunčana letnja terasa',
    item1Title: 'Prostrana Letnja Terasa',
    item1Category: 'Otvoreni Prostor',
    item2Title: 'Pica & Domaći Specijaliteti',
    item2Category: 'Kuhinja & Ukusi',
    item3Title: 'Retro Detalji & Cigla',
    item3Category: 'Enterijer Lokala',
    item4Title: 'Urednost & Gostoprimstvo',
    item4Category: 'Šank & Usluga',
    item5Title: 'Autentični Slovanka Detalji',
    item5Category: 'Dekoracija & Atmosfera',
    item6Title: 'Topli Ambijent & Rustični Tonovi',
    item6Category: 'Prijatna Atmosfera',
  },
  cocktails: {
    eyebrow: 'Osveženje',
    title: 'Signature Kokteli & Specijaliteti Šanka',
    description:
      'Istražite našu pažljivo kreiranu ponudu osvežavajućih bezalkoholnih koktela, pripremljenih sa svežim voćem, aromatičnim biljem i vrhunskim sirupima.',
    bottomNote:
      'Svi naši kokteli se pripremaju na licu mesta od svežeg voća, prirodnih sirupa i domaćih biljaka. Pitajte naše osoblje za sezonska osveženja!',
  },
  contact: {
    eyebrow: 'Kontakt & Lokacija',
    title: 'Posetite Nas ili Ostavite Vaš Utisak',
    address: 'Maršala Tita 165, 21425 Selenča',
    phone: '+381 (0) 21 774 012',
    mobile: '+381 (0) 62 895 4410',
    email: 'info@slovankacaffe.com',
    hoursWeek: 'Ponedeljak – Četvrtak: 08:00 – 23:00',
    hoursWeekend: 'Petak – Nedelja: 08:00 – 24:00',
    note: 'Kuhinja prima porudžbine do 22:30h',
    formTitle: 'Ostavite Vaš Utisak',
    formDesc: 'Podelite svoje iskustvo sa nama. Vaš komentar će biti objavljen nakon kratkog pregleda.',
  },
  footer: {
    title: 'SLOVANKA',
    subtitle: 'CAFFE PIZZERIA',
    aboutText:
      'Slovanka Caffe Pizzeria u Selenči – tradicija dobre hrane, hrskavih pica i prijatnog druženja od 1993. godine.',
    copyright: '© 2026 Slovanka Caffe Pizzeria. Sva prava zadržana.',
    downloadText: 'Preuzmi sajt',
  },
};

export function getSiteContent(): SiteContent {
  if (typeof window === 'undefined') return DEFAULT_SITE_CONTENT;
  try {
    const data = localStorage.getItem(SITE_CONTENT_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(SITE_CONTENT_STORAGE_KEY, JSON.stringify(DEFAULT_SITE_CONTENT));
      return DEFAULT_SITE_CONTENT;
    }
    const parsed = JSON.parse(data);
    // Deep merge with defaults in case of missing keys
    return {
      header: { ...DEFAULT_SITE_CONTENT.header, ...(parsed.header || {}) },
      hero: { ...DEFAULT_SITE_CONTENT.hero, ...(parsed.hero || {}) },
      about: { ...DEFAULT_SITE_CONTENT.about, ...(parsed.about || {}) },
      specialties: { ...DEFAULT_SITE_CONTENT.specialties, ...(parsed.specialties || {}) },
      gallery: { ...DEFAULT_SITE_CONTENT.gallery, ...(parsed.gallery || {}) },
      cocktails: { ...DEFAULT_SITE_CONTENT.cocktails, ...(parsed.cocktails || {}) },
      contact: { ...DEFAULT_SITE_CONTENT.contact, ...(parsed.contact || {}) },
      footer: { ...DEFAULT_SITE_CONTENT.footer, ...(parsed.footer || {}) },
    };
  } catch (e) {
    console.error('Error reading site content', e);
    return DEFAULT_SITE_CONTENT;
  }
}

export function saveSiteContent(content: SiteContent): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SITE_CONTENT_STORAGE_KEY, JSON.stringify(content));
    window.dispatchEvent(new CustomEvent('slovanka_content_updated'));
  } catch (e) {
    console.error('Error saving site content', e);
  }
}

export function resetSiteContent(): SiteContent {
  if (typeof window === 'undefined') return DEFAULT_SITE_CONTENT;
  try {
    localStorage.setItem(SITE_CONTENT_STORAGE_KEY, JSON.stringify(DEFAULT_SITE_CONTENT));
    window.dispatchEvent(new CustomEvent('slovanka_content_updated'));
    return DEFAULT_SITE_CONTENT;
  } catch (e) {
    console.error('Error resetting site content', e);
    return DEFAULT_SITE_CONTENT;
  }
}
