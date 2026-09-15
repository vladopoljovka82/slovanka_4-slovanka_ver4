import React, { useState, useMemo, useEffect } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { MenuItem, MenuCategory } from '../types';
import { getStoredCategories, getStoredMenuItems } from '../utils/menuStorage';

export const MenuSection: React.FC = () => {
  const [categories, setCategories] = useState<MenuCategory[]>(() => getStoredCategories());
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => getStoredMenuItems());
  const [activeCategory, setActiveCategory] = useState<string>('pizze');
  const [searchQuery, setSearchQuery] = useState('');

  const reloadData = () => {
    const updatedCats = getStoredCategories();
    const updatedItems = getStoredMenuItems();
    setCategories(updatedCats);
    setMenuItems(updatedItems);
    setActiveCategory((prev) => {
      if (updatedCats.some((c) => c.key === prev)) return prev;
      return updatedCats[0]?.key || 'pizze';
    });
  };

  useEffect(() => {
    reloadData();
    const handleUpdate = () => reloadData();
    window.addEventListener('slovanka_menu_updated', handleUpdate);
    return () => {
      window.removeEventListener('slovanka_menu_updated', handleUpdate);
    };
  }, []);

  const activeCategoryObj = useMemo(() => {
    return categories.find((c) => c.key === activeCategory);
  }, [categories, activeCategory]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = item.category === activeCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ingredients.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, activeCategory, searchQuery]);

  return (
    <section id="meni" className="py-24 max-w-7xl mx-auto px-6 md:px-12">
      {/* Title & Subheading */}
      <div className="text-center mb-12">
        <span className="text-xs uppercase tracking-luxury text-[#bda068] font-semibold">
          Gastronomski Izbor
        </span>
        <h2 className="font-serif text-4xl md:text-5xl mt-2 tracking-wide uppercase font-light text-[#1e1c18]">
          JELOVNIK
        </h2>
        <div className="w-16 h-px bg-[#bda068] mx-auto mt-4" />
        <p className="text-[#767269] text-xs uppercase tracking-widest mt-4">
          Izaberite kategoriju ili pretražite omiljeni obrok
        </p>

        {/* Search Bar */}
        <div className="mt-8 max-w-md mx-auto relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pretražite jelo ili sastojak (npr. kulen, cezar, nutela)..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e5dfd5] text-xs placeholder:text-stone-400 focus:outline-none focus:border-[#1e1c18] rounded-sm transition-colors"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[10px] text-stone-400 hover:text-stone-700 absolute right-3 top-1/2 -translate-y-1/2 uppercase tracking-wider"
            >
              Obriši
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-8">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-5 py-2.5 text-xs uppercase tracking-widest font-medium border rounded-sm transition-all ${
                activeCategory === cat.key
                  ? 'border-[#1e1c18] bg-[#1e1c18] text-white shadow-xs'
                  : 'border-[#e5dfd5] text-[#1e1c18] hover:border-[#1e1c18] bg-transparent'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pizzas Size Legend (only when viewing pizzas or triple price category) */}
      {(activeCategory === 'pizze' || activeCategoryObj?.isTriplePrice) && (
        <div className="mb-8 p-3.5 bg-[#f4f0e8]/80 border border-[#e5dfd5] rounded-sm flex flex-wrap items-center justify-between text-xs text-[#767269]">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-[#bda068]" />
            <span className="font-medium text-[#1e1c18]">Standardne dimenzije pica:</span>
            <span>Mala (28cm) • Velika (32cm) • Porodična (45cm)</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-[#bda068] font-semibold mt-1 sm:mt-0">
            Cene u RSD (Mala | Velika | Porodična)
          </span>
        </div>
      )}

      {/* Menu Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-[#f4f0e8]/40 border border-dashed border-[#e5dfd5] rounded-sm">
          <p className="font-serif text-xl text-[#1e1c18]">Nije pronađeno nijedno jelo za dati upit</p>
          <p className="text-xs text-[#767269] mt-2">Pokušajte sa drugom rečju ili promenite kategoriju.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('pizze');
            }}
            className="mt-4 px-4 py-2 border border-[#1e1c18] text-xs uppercase tracking-widest"
          >
            Poništi filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-14 gap-y-7">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-sm hover:bg-white/70 transition-colors border-b border-dotted border-stone-300 group"
            >
              <div className="flex items-baseline justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <h3 className="font-serif text-xl font-normal text-[#1e1c18] group-hover:text-[#bda068] transition-colors">
                    {item.name}
                  </h3>
                  {item.badge && (
                    <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-[#f4f0e8] text-[#bda068] border border-[#bda068]/50 rounded-xs font-semibold">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Price Display */}
                <div className="shrink-0 text-right">
                  {item.prices.single ? (
                    <span className="font-serif text-base font-semibold text-[#484436]">
                      {item.prices.single}
                    </span>
                  ) : (
                    <div className="flex items-center space-x-1 font-serif text-base font-semibold text-[#484436]">
                      <span>{item.prices.small}</span>
                      <span className="text-stone-400 font-light">|</span>
                      <span>{item.prices.large}</span>
                      <span className="text-stone-400 font-light">|</span>
                      <span>{item.prices.family}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Ingredients and metadata */}
              <div className="flex justify-between items-center mt-1 text-xs text-[#767269] italic">
                <span>{item.ingredients}</span>
                {item.weight && (
                  <span className="text-[10px] tracking-widest uppercase not-italic text-stone-400 shrink-0 ml-2">
                    {item.weight}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
