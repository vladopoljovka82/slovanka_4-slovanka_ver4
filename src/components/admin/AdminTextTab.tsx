import React, { useState } from 'react';
import {
  Save,
  RotateCcw,
  Undo2,
  Check,
  Navigation,
  Home,
  BookOpen,
  Sparkles,
  Image as ImageIcon,
  GlassWater,
  MapPin,
  LayoutGrid,
} from 'lucide-react';
import { SiteContent } from '../../types';
import {
  getSiteContent,
  saveSiteContent,
  resetSiteContent,
} from '../../utils/siteContentStorage';

type SectionKey =
  | 'header'
  | 'hero'
  | 'about'
  | 'specialties'
  | 'gallery'
  | 'cocktails'
  | 'contact'
  | 'footer';

export const AdminTextTab: React.FC = () => {
  const [formData, setFormData] = useState<SiteContent>(() => getSiteContent());
  const [activeSection, setActiveSection] = useState<SectionKey>('header');
  const [notification, setNotification] = useState<{
    type: 'success' | 'info';
    message: string;
  } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    saveSiteContent(formData);
    showNotification('Sve izmene teksta su uspešno sačuvane i primenjene na sajtu!');
  };

  const handleDiscard = () => {
    setFormData(getSiteContent());
    showNotification('Nesačuvane izmene su odbačene.', 'info');
  };

  const handleResetDefaults = () => {
    if (
      confirm(
        'Da li ste sigurni da želite da vratite sve tekstove sajta na fabričke (originalne) vrednosti?'
      )
    ) {
      const reset = resetSiteContent();
      setFormData(reset);
      showNotification('Svi tekstovi sajta su vraćeni na fabrička podešavanja.');
    }
  };

  const sectionsList: { key: SectionKey; label: string; icon: React.ReactNode }[] = [
    { key: 'header', label: '1. Heder', icon: <Navigation className="w-3.5 h-3.5" /> },
    { key: 'hero', label: '2. Hero', icon: <Home className="w-3.5 h-3.5" /> },
    { key: 'about', label: '3. Naša Priča', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { key: 'specialties', label: '4. Ukus i Ambijent', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { key: 'gallery', label: '5. Pogled Iznutra / Ambijent', icon: <ImageIcon className="w-3.5 h-3.5" /> },
    { key: 'cocktails', label: '6. Kokteli', icon: <GlassWater className="w-3.5 h-3.5" /> },
    { key: 'contact', label: '7. Kontakt & Lokacija', icon: <MapPin className="w-3.5 h-3.5" /> },
    { key: 'footer', label: '8. Footer', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Toast Alert */}
      {notification && (
        <div
          className={`mx-6 mt-3 px-4 py-2.5 rounded text-xs flex items-center justify-between shadow-xs ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-stone-100 text-stone-800 border border-stone-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Section Switcher Tabs Bar */}
      <div className="p-3 bg-[#f4f0e8] border-b border-[#e5dfd5] flex items-center space-x-1.5 overflow-x-auto shrink-0">
        {sectionsList.map((sec) => (
          <button
            key={sec.key}
            type="button"
            onClick={() => setActiveSection(sec.key)}
            className={`px-3 py-1.5 rounded-sm text-xs font-medium whitespace-nowrap flex items-center space-x-1.5 transition-colors ${
              activeSection === sec.key
                ? 'bg-[#1e1c18] text-white shadow-xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-400'
            }`}
          >
            {sec.icon}
            <span>{sec.label}</span>
          </button>
        ))}
      </div>

      {/* Editable Fields Form Container */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
        {/* 1. HEDER SECTION */}
        {activeSection === 'header' && (
          <div className="space-y-4">
            <div className="pb-3 border-b border-stone-200">
              <h4 className="font-serif text-base font-semibold text-[#1e1c18]">
                1. Heder (Zaglavlje Sajta)
              </h4>
              <p className="text-xs text-[#767269]">
                Podešavanje naziva brenda, logotipa, kontakt telefona i navigacionih linkova u zaglavlju.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                  Glavni Logo Naziv
                </label>
                <input
                  type="text"
                  value={formData.header.logoTitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      header: { ...formData.header, logoTitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 text-xs font-serif font-bold uppercase focus:outline-none focus:border-[#1e1c18] rounded-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                  Podnaslov Ispod Loga
                </label>
                <input
                  type="text"
                  value={formData.header.logoSubtitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      header: { ...formData.header, logoSubtitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 text-xs uppercase focus:outline-none focus:border-[#1e1c18] rounded-sm bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                  Oznaka Lokacije (Grad)
                </label>
                <input
                  type="text"
                  value={formData.header.locationTag}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      header: { ...formData.header, locationTag: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 text-xs uppercase tracking-widest font-semibold text-[#bda068] focus:outline-none focus:border-[#1e1c18] rounded-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                  Telefon u Hederu
                </label>
                <input
                  type="text"
                  value={formData.header.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      header: { ...formData.header, phone: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 text-xs font-mono focus:outline-none focus:border-[#1e1c18] rounded-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                  Puna Adresa u Hederu
                </label>
                <input
                  type="text"
                  value={formData.header.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      header: { ...formData.header, address: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 text-xs focus:outline-none focus:border-[#1e1c18] rounded-sm bg-white"
                />
              </div>
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-sm space-y-3">
              <span className="text-xs uppercase tracking-wider text-stone-700 font-semibold block">
                Nazivi Linkova Glavne Navigacije
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">
                    Link 1
                  </label>
                  <input
                    type="text"
                    value={formData.header.navAbout}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        header: { ...formData.header, navAbout: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 border border-stone-300 text-xs rounded-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">
                    Link 2
                  </label>
                  <input
                    type="text"
                    value={formData.header.navMenu}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        header: { ...formData.header, navMenu: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 border border-stone-300 text-xs rounded-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">
                    Link 3
                  </label>
                  <input
                    type="text"
                    value={formData.header.navAmbijent}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        header: { ...formData.header, navAmbijent: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 border border-stone-300 text-xs rounded-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">
                    Link 4
                  </label>
                  <input
                    type="text"
                    value={formData.header.navCocktails}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        header: { ...formData.header, navCocktails: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 border border-stone-300 text-xs rounded-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">
                    Link 5
                  </label>
                  <input
                    type="text"
                    value={formData.header.navContact}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        header: { ...formData.header, navContact: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 border border-stone-300 text-xs rounded-sm bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. HERO SECTION */}
        {activeSection === 'hero' && (
          <div className="space-y-4">
            <div className="pb-3 border-b border-stone-200">
              <h4 className="font-serif text-base font-semibold text-[#1e1c18]">
                2. Početna (Hero) Sekcija
              </h4>
              <p className="text-xs text-[#767269]">
                Kompletan tekst početne sekcije na vrhu stranice (naslov, opis, dugmad, istaknuto jelo i bedževi).
              </p>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                Mali Nadnaslov (Eyebrow)
              </label>
              <input
                type="text"
                value={formData.hero.eyebrow}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, eyebrow: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-stone-300 text-xs focus:outline-none focus:border-[#1e1c18] rounded-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                Glavni Naslov Sekcije (H1)
              </label>
              <input
                type="text"
                value={formData.hero.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, title: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-stone-300 text-sm font-serif italic focus:outline-none focus:border-[#1e1c18] rounded-sm bg-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                Opisni Pasus
              </label>
              <textarea
                rows={3}
                value={formData.hero.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, description: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-stone-300 text-xs focus:outline-none focus:border-[#1e1c18] rounded-sm bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                  Tekst Glavnog Dugmeta
                </label>
                <input
                  type="text"
                  value={formData.hero.btnMenu}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, btnMenu: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 text-xs rounded-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                  Tekst Sporednog Dugmeta
                </label>
                <input
                  type="text"
                  value={formData.hero.btnComment}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, btnComment: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 text-xs rounded-sm bg-white"
                />
              </div>
            </div>

            {/* Istaknuto jelo na slici */}
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-sm space-y-3">
              <span className="text-xs uppercase tracking-wider text-stone-700 font-semibold block">
                Istaknuto Jelo (Preporuka na Slici)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] text-stone-500 mb-1">Značka (Badge)</label>
                  <input
                    type="text"
                    value={formData.hero.dishBadge}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, dishBadge: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 border border-stone-300 text-xs rounded-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-stone-500 mb-1">Naziv Jela</label>
                  <input
                    type="text"
                    value={formData.hero.dishName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, dishName: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 border border-stone-300 text-xs rounded-sm bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-stone-500 mb-1">Cena</label>
                  <input
                    type="text"
                    value={formData.hero.dishPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, dishPrice: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 border border-stone-300 text-xs rounded-sm bg-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-stone-500 mb-1">Veličina / Porcija</label>
                  <input
                    type="text"
                    value={formData.hero.dishSize}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, dishSize: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 border border-stone-300 text-xs rounded-sm bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Oznake poverenja */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                  Oznaka Poverenja 1 (Kulinarska Receptura)
                </label>
                <input
                  type="text"
                  value={formData.hero.badge1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, badge1: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 text-xs rounded-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                  Oznaka Poverenja 2 (Ocena Gostiju)
                </label>
                <input
                  type="text"
                  value={formData.hero.badge2}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, badge2: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 text-xs rounded-sm bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. NAŠA PRIČA SECTION */}
        {activeSection === 'about' && (
          <div className="space-y-4">
            <div className="pb-3 border-b border-stone-200">
              <h4 className="font-serif text-base font-semibold text-[#1e1c18]">
                3. Naša Priča
              </h4>
              <p className="text-xs text-[#767269]">
                Podešavanje teksta sekcije Naša Priča — naslov, opis iznad slika i tekstovi na samim fotografijama.
              </p>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                Nadnaslov Sekcije
              </label>
              <input
                type="text"
                value={formData.about.eyebrow}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    about: { ...formData.about, eyebrow: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-stone-300 text-xs rounded-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                Glavni Naslov Sekcije
              </label>
              <input
                type="text"
                value={formData.about.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    about: { ...formData.about, title: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-stone-300 text-sm font-serif font-semibold rounded-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                Tekst Iznad Slika (Opisni Pasus)
              </label>
              <textarea
                rows={3}
                value={formData.about.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    about: { ...formData.about, description: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-stone-300 text-xs rounded-sm bg-white"
              />
            </div>

            <div className="pt-3 border-t border-stone-200 space-y-4">
              <h5 className="font-serif text-sm font-medium text-stone-800">
                Tekstovi na Fotografijama (3 Kartice)
              </h5>

              {/* Slika 1 */}
              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-sm grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">
                    Slika 1 (Terasa) - Oznaka
                  </label>
                  <input
                    type="text"
                    value={formData.about.card1Badge}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: { ...formData.about, card1Badge: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 border border-stone-300 text-xs rounded-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">
                    Slika 1 (Terasa) - Naslov
                  </label>
                  <input
                    type="text"
                    value={formData.about.card1Title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: { ...formData.about, card1Title: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 border border-stone-300 text-xs rounded-sm bg-white font-medium"
                  />
                </div>
              </div>

              {/* Slika 2 */}
              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-sm grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">
                    Slika 2 (Sala) - Oznaka
                  </label>
                  <input
                    type="text"
                    value={formData.about.card2Badge}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: { ...formData.about, card2Badge: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 border border-stone-300 text-xs rounded-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">
                    Slika 2 (Sala) - Naslov
                  </label>
                  <input
                    type="text"
                    value={formData.about.card2Title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: { ...formData.about, card2Title: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 border border-stone-300 text-xs rounded-sm bg-white font-medium"
                  />
                </div>
              </div>

              {/* Slika 3 */}
              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-sm grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">
                    Slika 3 (Kafa / Receptura) - Oznaka
                  </label>
                  <input
                    type="text"
                    value={formData.about.card3Badge}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: { ...formData.about, card3Badge: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 border border-stone-300 text-xs rounded-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">
                    Slika 3 (Kafa / Receptura) - Naslov
                  </label>
                  <input
                    type="text"
                    value={formData.about.card3Title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: { ...formData.about, card3Title: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 border border-stone-300 text-xs rounded-sm bg-white font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. UKUS I AMBIJENT SECTION */}
        {activeSection === 'specialties' && (
          <div className="space-y-4">
            <div className="pb-3 border-b border-stone-200">
              <h4 className="font-serif text-base font-semibold text-[#1e1c18]">
                4. Ukus i Ambijent (Maslinasti Baner)
              </h4>
              <p className="text-xs text-[#767269]">
                Istaknuta maslinasta sekcija sa posvećenošću kvalitetu i dugmetom ka Facebook stranici.
              </p>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                Nadnaslov Sekcije
              </label>
              <input
                type="text"
                value={formData.specialties.eyebrow}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specialties: { ...formData.specialties, eyebrow: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-stone-300 text-xs rounded-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                Glavni Naslov Sekcije
              </label>
              <input
                type="text"
                value={formData.specialties.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specialties: { ...formData.specialties, title: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-stone-300 text-sm font-serif font-semibold rounded-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                Opisni Pasus
              </label>
              <textarea
                rows={3}
                value={formData.specialties.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specialties: { ...formData.specialties, description: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-stone-300 text-xs rounded-sm bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                  Oznaka Pored Facebook Linka
                </label>
                <input
                  type="text"
                  value={formData.specialties.fbLabel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specialties: { ...formData.specialties, fbLabel: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 text-xs rounded-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                  Tekst na Facebook Dugmetu
                </label>
                <input
                  type="text"
                  value={formData.specialties.fbText}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specialties: { ...formData.specialties, fbText: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 text-xs rounded-sm bg-white font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* 5. POGLED IZNUTRA / NAŠ AMBIJENT */}
        {activeSection === 'gallery' && (
          <div className="space-y-4">
            <div className="pb-3 border-b border-stone-200">
              <h4 className="font-serif text-base font-semibold text-[#1e1c18]">
                5. Pogled Iznutra / Naš Ambijent
              </h4>
              <p className="text-xs text-[#767269]">
                Podešavanje naslova sekcije galerije, opisa, kao i natpisa i kategorija na slikama u bento mozaiku.
              </p>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                Nadnaslov Sekcije
              </label>
              <input
                type="text"
                value={formData.gallery.eyebrow}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gallery: { ...formData.gallery, eyebrow: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-stone-300 text-xs rounded-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                Glavni Naslov Sekcije
              </label>
              <input
                type="text"
                value={formData.gallery.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gallery: { ...formData.gallery, title: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-stone-300 text-sm font-serif font-semibold uppercase rounded-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                Podnaslov / Opis Ispod Naslova
              </label>
              <input
                type="text"
                value={formData.gallery.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gallery: { ...formData.gallery, description: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-stone-300 text-xs rounded-sm bg-white"
              />
            </div>

            <div className="pt-3 border-t border-stone-200 space-y-3">
              <h5 className="font-serif text-sm font-medium text-stone-800">
                Natpisi na Fotografijama Galerije
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Slika 1 */}
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-sm">
                  <span className="text-[11px] font-semibold text-stone-700 block mb-2">
                    Fotografija 1 (Letnja Terasa)
                  </span>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[10px] text-stone-500">Naslov na slici</label>
                      <input
                        type="text"
                        value={formData.gallery.item1Title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            gallery: { ...formData.gallery, item1Title: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-1 border border-stone-300 text-xs rounded-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500">Kategorija</label>
                      <input
                        type="text"
                        value={formData.gallery.item1Category}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            gallery: { ...formData.gallery, item1Category: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-1 border border-stone-300 text-xs rounded-sm bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Slika 2 */}
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-sm">
                  <span className="text-[11px] font-semibold text-stone-700 block mb-2">
                    Fotografija 2 (Pica & Specijaliteti)
                  </span>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[10px] text-stone-500">Naslov na slici</label>
                      <input
                        type="text"
                        value={formData.gallery.item2Title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            gallery: { ...formData.gallery, item2Title: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-1 border border-stone-300 text-xs rounded-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500">Kategorija</label>
                      <input
                        type="text"
                        value={formData.gallery.item2Category}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            gallery: { ...formData.gallery, item2Category: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-1 border border-stone-300 text-xs rounded-sm bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Slika 3 */}
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-sm">
                  <span className="text-[11px] font-semibold text-stone-700 block mb-2">
                    Fotografija 3 (Retro Detalji)
                  </span>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[10px] text-stone-500">Naslov na slici</label>
                      <input
                        type="text"
                        value={formData.gallery.item3Title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            gallery: { ...formData.gallery, item3Title: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-1 border border-stone-300 text-xs rounded-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500">Kategorija</label>
                      <input
                        type="text"
                        value={formData.gallery.item3Category}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            gallery: { ...formData.gallery, item3Category: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-1 border border-stone-300 text-xs rounded-sm bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Slika 4 */}
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-sm">
                  <span className="text-[11px] font-semibold text-stone-700 block mb-2">
                    Fotografija 4 (Urednost & Šank)
                  </span>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[10px] text-stone-500">Naslov na slici</label>
                      <input
                        type="text"
                        value={formData.gallery.item4Title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            gallery: { ...formData.gallery, item4Title: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-1 border border-stone-300 text-xs rounded-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500">Kategorija</label>
                      <input
                        type="text"
                        value={formData.gallery.item4Category}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            gallery: { ...formData.gallery, item4Category: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-1 border border-stone-300 text-xs rounded-sm bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Slika 5 */}
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-sm">
                  <span className="text-[11px] font-semibold text-stone-700 block mb-2">
                    Fotografija 5 (Dekoracija)
                  </span>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[10px] text-stone-500">Naslov na slici</label>
                      <input
                        type="text"
                        value={formData.gallery.item5Title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            gallery: { ...formData.gallery, item5Title: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-1 border border-stone-300 text-xs rounded-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500">Kategorija</label>
                      <input
                        type="text"
                        value={formData.gallery.item5Category}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            gallery: { ...formData.gallery, item5Category: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-1 border border-stone-300 text-xs rounded-sm bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Slika 6 */}
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-sm">
                  <span className="text-[11px] font-semibold text-stone-700 block mb-2">
                    Fotografija 6 (Topli Rustični Tonovi)
                  </span>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[10px] text-stone-500">Naslov na slici</label>
                      <input
                        type="text"
                        value={formData.gallery.item6Title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            gallery: { ...formData.gallery, item6Title: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-1 border border-stone-300 text-xs rounded-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500">Kategorija</label>
                      <input
                        type="text"
                        value={formData.gallery.item6Category}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            gallery: { ...formData.gallery, item6Category: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-1 border border-stone-300 text-xs rounded-sm bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. KOKTELI SECTION */}
        {activeSection === 'cocktails' && (
          <div className="space-y-4">
            <div className="pb-3 border-b border-stone-200">
              <h4 className="font-serif text-base font-semibold text-[#1e1c18]">
                6. Kokteli (Tekst Iznad i Ispod Slika)
              </h4>
              <p className="text-xs text-[#767269]">
                Podešavanje naslova sekcije, uvodnog teksta iznad koktela i završne napomene ispod ponude koktela.
              </p>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                Nadnaslov Sekcije
              </label>
              <input
                type="text"
                value={formData.cocktails.eyebrow}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cocktails: { ...formData.cocktails, eyebrow: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-stone-300 text-xs rounded-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                Glavni Naslov Sekcije
              </label>
              <input
                type="text"
                value={formData.cocktails.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cocktails: { ...formData.cocktails, title: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-stone-300 text-sm font-serif font-semibold rounded-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                Tekst Iznad Slika Koktela (Opis Ponude)
              </label>
              <textarea
                rows={3}
                value={formData.cocktails.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cocktails: { ...formData.cocktails, description: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-stone-300 text-xs rounded-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                Tekst Ispod Slika Koktela (Napomena Šanka)
              </label>
              <textarea
                rows={2}
                value={formData.cocktails.bottomNote}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cocktails: { ...formData.cocktails, bottomNote: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-stone-300 text-xs rounded-sm bg-white"
              />
            </div>
          </div>
        )}

        {/* 7. KONTAKT I LOKACIJA */}
        {activeSection === 'contact' && (
          <div className="space-y-4">
            <div className="pb-3 border-b border-stone-200">
              <h4 className="font-serif text-base font-semibold text-[#1e1c18]">
                7. Kontakt & Lokacija
              </h4>
              <p className="text-xs text-[#767269]">
                Podešavanje adrese, radnog vremena, telefona, emaila i naslova sekcije za komentare posetilaca.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                  Nadnaslov Sekcije
                </label>
                <input
                  type="text"
                  value={formData.contact.eyebrow}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, eyebrow: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 text-xs rounded-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                  Glavni Naslov Sekcije
                </label>
                <input
                  type="text"
                  value={formData.contact.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 text-xs rounded-sm bg-white font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                Adresa Restorana
              </label>
              <input
                type="text"
                value={formData.contact.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, address: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-stone-300 text-xs rounded-sm bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                  Fiksni Telefon
                </label>
                <input
                  type="text"
                  value={formData.contact.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, phone: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 text-xs rounded-sm bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                  Mobilni Telefon
                </label>
                <input
                  type="text"
                  value={formData.contact.mobile}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, mobile: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 text-xs rounded-sm bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                  Email Za Komentare
                </label>
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, email: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 text-xs rounded-sm bg-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                  Radno Vreme (Radni Dani)
                </label>
                <input
                  type="text"
                  value={formData.contact.hoursWeek}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, hoursWeek: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 text-xs rounded-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                  Radno Vreme (Vikend)
                </label>
                <input
                  type="text"
                  value={formData.contact.hoursWeekend}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, hoursWeekend: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 text-xs rounded-sm bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                Kratka Napomena za Poručivanje
              </label>
              <input
                type="text"
                value={formData.contact.note}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, note: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-stone-300 text-xs rounded-sm bg-white"
              />
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-sm space-y-3">
              <span className="text-xs uppercase tracking-wider text-stone-700 font-semibold block">
                Forma za Komentare Posetilaca
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-stone-500 mb-1">Naslov Forme</label>
                  <input
                    type="text"
                    value={formData.contact.formTitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, formTitle: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 border border-stone-300 text-xs rounded-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-stone-500 mb-1">Opis Ispod Naslova Forme</label>
                  <input
                    type="text"
                    value={formData.contact.formDesc}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, formDesc: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 border border-stone-300 text-xs rounded-sm bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 8. FOOTER SECTION */}
        {activeSection === 'footer' && (
          <div className="space-y-4">
            <div className="pb-3 border-b border-stone-200">
              <h4 className="font-serif text-base font-semibold text-[#1e1c18]">
                8. Podnožje Sajta (Footer)
              </h4>
              <p className="text-xs text-[#767269]">
                Podešavanje naziva brenda, opisa restorana, autorskih prava i dugmeta za preuzimanje sajta.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                  Glavni Naslov Brendu u Footeru
                </label>
                <input
                  type="text"
                  value={formData.footer.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      footer: { ...formData.footer, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 text-xs font-serif font-bold uppercase rounded-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                  Podnaslov u Footeru
                </label>
                <input
                  type="text"
                  value={formData.footer.subtitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      footer: { ...formData.footer, subtitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 text-xs uppercase rounded-sm bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                Kratak Opis Restorana u Footeru
              </label>
              <textarea
                rows={3}
                value={formData.footer.aboutText}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    footer: { ...formData.footer, aboutText: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-stone-300 text-xs rounded-sm bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                  Copyright Tekst
                </label>
                <input
                  type="text"
                  value={formData.footer.copyright}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      footer: { ...formData.footer, copyright: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 text-xs rounded-sm bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                  Tekst Dugmeta za Preuzimanje Sajta
                </label>
                <input
                  type="text"
                  value={formData.footer.downloadText}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      footer: { ...formData.footer, downloadText: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 text-xs rounded-sm bg-white font-medium"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Bar (Save, Discard, Factory Reset) */}
      <div className="p-4 bg-[#f4f0e8] border-t border-[#e5dfd5] flex flex-wrap items-center justify-between gap-3 shrink-0">
        <button
          type="button"
          onClick={handleResetDefaults}
          className="text-stone-500 hover:text-stone-800 text-xs flex items-center space-x-1.5 transition-colors"
          title="Vrati originalne tekstove sajta"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Vrati Fabrički Tekst</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleDiscard}
            className="px-4 py-2 border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 text-xs font-medium rounded-sm flex items-center space-x-1.5 transition-colors"
          >
            <Undo2 className="w-3.5 h-3.5 text-stone-500" />
            <span>Odbaci Izmene</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase tracking-wider font-semibold rounded-sm flex items-center space-x-1.5 transition-colors shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Sačuvaj Sve Promene</span>
          </button>
        </div>
      </div>
    </div>
  );
};
