import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Sparkles, GlassWater, Check, Citrus } from 'lucide-react';
import { CocktailItem } from '../../types';
import {
  getStoredCocktails,
  saveStoredCocktails,
  resetStoredCocktails,
} from '../../utils/cocktailsStorage';

export const AdminCocktailsTab: React.FC = () => {
  const [cocktails, setCocktails] = useState<CocktailItem[]>(() => getStoredCocktails());
  const [activeCocktailId, setActiveCocktailId] = useState<string>('koktel-1');
  const [notification, setNotification] = useState<{ type: 'success' | 'info'; message: string } | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setCocktails(getStoredCocktails());
    };
    window.addEventListener('slovanka_cocktails_updated', handleUpdate);
    return () => window.removeEventListener('slovanka_cocktails_updated', handleUpdate);
  }, []);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleChange = (id: string, field: keyof CocktailItem, value: string) => {
    setCocktails((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    saveStoredCocktails(cocktails);
    showNotification('Izmene za sve koktele su uspešno sačuvane i primenjene na sajtu!');
  };

  const handleReset = () => {
    if (window.confirm('Da li ste sigurni da želite da vratite podrazumevane nazive, sastojke i opise za sve koktele?')) {
      const reset = resetStoredCocktails();
      setCocktails(reset);
      showNotification('Vraćeni su originalni podaci o koktelima.', 'info');
    }
  };

  const activeCocktail = cocktails.find((c) => c.id === activeCocktailId) || cocktails[0];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#fbf9f5]">
      {/* Top action header */}
      <div className="bg-[#f4f0e8] px-5 py-3 border-b border-[#e5dfd5] flex items-center justify-between shrink-0">
        <div>
          <h4 className="font-serif text-base font-semibold text-[#1e1c18] flex items-center space-x-2">
            <GlassWater className="w-4 h-4 text-[#bda068]" />
            <span>Uređivanje 4 Signature Koktela</span>
          </h4>
          <p className="text-[11px] text-[#767269]">
            Ovde možete promeniti naziv, sastojke, opis i bedž za svaki od četiri koktela na sajtu.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 border border-stone-300 hover:bg-white rounded-sm flex items-center space-x-1 transition-colors"
            title="Vrati originalne nazive i sastojke"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Podrazumevano</span>
          </button>
          <button
            type="button"
            onClick={() => handleSave()}
            className="px-4 py-1.5 bg-[#1e1c18] hover:bg-[#484436] text-white text-xs font-semibold uppercase tracking-wider rounded-sm flex items-center space-x-1.5 shadow-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-[#bda068]" />
            <span>Sačuvaj Koktele</span>
          </button>
        </div>
      </div>

      {notification && (
        <div
          className={`px-5 py-2.5 text-xs font-medium border-b flex items-center space-x-2 ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}
        >
          <Check className="w-4 h-4" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Sub-tabs for 4 cocktails */}
      <div className="flex border-b border-[#e5dfd5] bg-white px-4 pt-2 gap-2 overflow-x-auto shrink-0">
        {cocktails.map((cocktail, index) => {
          const isActive = cocktail.id === activeCocktailId;
          return (
            <button
              key={cocktail.id}
              type="button"
              onClick={() => setActiveCocktailId(cocktail.id)}
              className={`pb-2.5 pt-2 px-3 text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 border-b-2 transition-all shrink-0 ${
                isActive
                  ? 'border-[#bda068] text-[#1e1c18] font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-[#f4f0e8] text-[10px] font-mono flex items-center justify-center text-[#bda068]">
                {index + 1}
              </span>
              <span>{cocktail.name || `Koktel ${index + 1}`}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeCocktail && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="max-w-2xl bg-white border border-[#e5dfd5] rounded-sm p-6 shadow-xs space-y-5"
          >
            <div className="flex items-center space-x-3 pb-3 border-b border-[#f4f0e8]">
              <img
                src={activeCocktail.image}
                alt={activeCocktail.name}
                className="w-14 h-14 object-cover rounded-sm border border-stone-200 shrink-0"
              />
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#bda068] font-semibold">
                  Koktel #{cocktails.findIndex((c) => c.id === activeCocktail.id) + 1}
                </span>
                <h5 className="font-serif text-lg text-[#1e1c18]">{activeCocktail.name}</h5>
              </div>
            </div>

            {/* Naziv i Kategorija */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Naziv Koktela *
                </label>
                <input
                  type="text"
                  required
                  value={activeCocktail.name}
                  onChange={(e) => handleChange(activeCocktail.id, 'name', e.target.value)}
                  placeholder="Npr. Virgin Mojito"
                  className="w-full px-3 py-2 text-sm bg-[#fbf9f5] border border-[#e5dfd5] focus:border-[#1e1c18] focus:bg-white focus:outline-none rounded-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Kategorija / Podnaslov
                </label>
                <input
                  type="text"
                  value={activeCocktail.category}
                  onChange={(e) => handleChange(activeCocktail.id, 'category', e.target.value)}
                  placeholder="Npr. Osvežavajući Mocktail"
                  className="w-full px-3 py-2 text-sm bg-[#fbf9f5] border border-[#e5dfd5] focus:border-[#1e1c18] focus:bg-white focus:outline-none rounded-sm"
                />
              </div>
            </div>

            {/* Sastojci */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Sastojci Koktela *
              </label>
              <textarea
                rows={2}
                required
                value={activeCocktail.ingredients}
                onChange={(e) => handleChange(activeCocktail.id, 'ingredients', e.target.value)}
                placeholder="Npr. Limeta • Sveža nana • Smeđi šećer • Gazirana voda • Drobljeni led"
                className="w-full px-3 py-2 text-xs bg-[#fbf9f5] border border-[#e5dfd5] focus:border-[#1e1c18] focus:bg-white focus:outline-none rounded-sm"
              />
              <p className="text-[10px] text-stone-400 mt-1">
                Navedite sastojke odvojene tačkom (•) ili zarezom za elegantan prikaz na kartici koktela.
              </p>
            </div>

            {/* Tekst / Opis koktela */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Tekst / Opis Koktela *
              </label>
              <textarea
                rows={3}
                required
                value={activeCocktail.description}
                onChange={(e) => handleChange(activeCocktail.id, 'description', e.target.value)}
                placeholder="Opišite ukus, aromu i doživljaj ovog koktela..."
                className="w-full px-3 py-2 text-xs bg-[#fbf9f5] border border-[#e5dfd5] focus:border-[#1e1c18] focus:bg-white focus:outline-none rounded-sm leading-relaxed"
              />
            </div>

            {/* Bedž */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Oznaka / Bedž (opciono)
              </label>
              <input
                type="text"
                value={activeCocktail.badge || ''}
                onChange={(e) => handleChange(activeCocktail.id, 'badge', e.target.value)}
                placeholder="Npr. Favorit Gostiju, Preporuka Kuće (ostavite prazno ako nema)"
                className="w-full px-3 py-2 text-xs bg-[#fbf9f5] border border-[#e5dfd5] focus:border-[#1e1c18] focus:bg-white focus:outline-none rounded-sm"
              />
            </div>

            {/* Save Button for this cocktail */}
            <div className="pt-3 border-t border-[#f4f0e8] flex items-center justify-between">
              <span className="text-[11px] text-stone-400">
                Pritisnite dugme ispod da odmah primenite izmene.
              </span>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#1e1c18] hover:bg-[#484436] text-white text-xs font-semibold uppercase tracking-wider rounded-sm flex items-center space-x-2 shadow-xs transition-colors"
              >
                <Save className="w-3.5 h-3.5 text-[#bda068]" />
                <span>Sačuvaj Ovaj Koktel</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
