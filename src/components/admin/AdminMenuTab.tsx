import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  RotateCcw,
  Sparkles,
  Check,
  AlertCircle,
  FolderPlus,
  Layers,
  Search,
} from 'lucide-react';
import { MenuItem, MenuCategory } from '../../types';
import {
  getStoredCategories,
  getStoredMenuItems,
  saveStoredMenuItems,
  saveStoredCategories,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  addCategory,
  deleteCategory,
  resetMenuToDefault,
} from '../../utils/menuStorage';

export const AdminMenuTab: React.FC = () => {
  const [categories, setCategories] = useState<MenuCategory[]>(() => getStoredCategories());
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => getStoredMenuItems());
  const [activeCategoryKey, setActiveCategoryKey] = useState<string>(() => {
    const cats = getStoredCategories();
    return cats[0]?.key || 'pizze';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isDishFormOpen, setIsDishFormOpen] = useState(false);
  const [editingDishId, setEditingDishId] = useState<string | null>(null);

  // New category form state
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatLabel, setNewCatLabel] = useState('');
  const [newCatTriplePrice, setNewCatTriplePrice] = useState(false);

  // Dish form state
  const [dishForm, setDishForm] = useState<{
    name: string;
    ingredients: string;
    badge: string;
    weight: string;
    singlePrice: string;
    smallPrice: string;
    largePrice: string;
    familyPrice: string;
  }>({
    name: '',
    ingredients: '',
    badge: '',
    weight: '',
    singlePrice: '',
    smallPrice: '',
    largePrice: '',
    familyPrice: '',
  });

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 2800);
  };

  const refreshData = () => {
    const cats = getStoredCategories();
    const items = getStoredMenuItems();
    setCategories(cats);
    setMenuItems(items);
    if (!cats.some((c) => c.key === activeCategoryKey)) {
      setActiveCategoryKey(cats[0]?.key || 'pizze');
    }
  };

  const activeCategory = categories.find((c) => c.key === activeCategoryKey);
  const isTriplePriceCategory =
    activeCategory?.isTriplePrice || activeCategoryKey === 'pizze';

  const categoryItems = menuItems.filter(
    (item) =>
      item.category === activeCategoryKey &&
      (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ingredients.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Category Actions
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatLabel.trim()) return;

    // Generate safe key
    const slug = newCatLabel
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '_')
      .replace(/^_|_$/g, '');

    const key = slug || `cat_${Date.now()}`;

    if (categories.some((c) => c.key === key)) {
      showNotification('Kategorija sa sličnim nazivom već postoji!', 'error');
      return;
    }

    addCategory({
      key,
      label: newCatLabel.trim(),
      isTriplePrice: newCatTriplePrice,
    });

    setNewCatLabel('');
    setNewCatTriplePrice(false);
    setIsAddingCategory(false);
    setActiveCategoryKey(key);
    refreshData();
    showNotification('Kategorija je uspešno dodata!');
  };

  const handleDeleteCategory = (catKey: string, catLabel: string) => {
    if (categories.length <= 1) {
      showNotification('Ne možete obrisati poslednju preostalu kategoriju!', 'error');
      return;
    }

    if (
      confirm(
        `Da li ste sigurni da želite da obrišete kategoriju "${catLabel}" i sva jela koja se nalaze u njoj?`
      )
    ) {
      deleteCategory(catKey);
      refreshData();
      showNotification(`Kategorija "${catLabel}" je obrisana.`);
    }
  };

  // Dish Form Actions
  const openAddDishForm = () => {
    setEditingDishId(null);
    setDishForm({
      name: '',
      ingredients: '',
      badge: '',
      weight: '',
      singlePrice: '',
      smallPrice: '',
      largePrice: '',
      familyPrice: '',
    });
    setIsDishFormOpen(true);
    setTimeout(() => {
      const el = document.getElementById('dish-add-form');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        const input = el.querySelector('input');
        if (input) input.focus();
      }
    }, 60);
  };

  const openEditDishForm = (item: MenuItem) => {
    setEditingDishId(item.id);
    setDishForm({
      name: item.name,
      ingredients: item.ingredients,
      badge: item.badge || '',
      weight: item.weight || '',
      singlePrice: item.prices.single || '',
      smallPrice: item.prices.small || '',
      largePrice: item.prices.large || '',
      familyPrice: item.prices.family || '',
    });
    setIsDishFormOpen(true);
    setTimeout(() => {
      const el = document.getElementById(`dish-edit-form-${item.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const input = el.querySelector('input');
        if (input) input.focus();
      }
    }, 60);
  };

  const handleSaveDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishForm.name.trim() || !dishForm.ingredients.trim()) {
      showNotification('Naziv jela i sastav su obavezna polja!', 'error');
      return;
    }

    const prices: MenuItem['prices'] = {};
    if (isTriplePriceCategory) {
      prices.small = dishForm.smallPrice.trim() || undefined;
      prices.large = dishForm.largePrice.trim() || undefined;
      prices.family = dishForm.familyPrice.trim() || undefined;
    } else {
      prices.single = dishForm.singlePrice.trim() || undefined;
    }

    if (editingDishId) {
      // Update
      const existing = menuItems.find((i) => i.id === editingDishId);
      if (existing) {
        updateMenuItem({
          ...existing,
          name: dishForm.name.trim(),
          ingredients: dishForm.ingredients.trim(),
          badge: dishForm.badge.trim() || undefined,
          weight: dishForm.weight.trim() || undefined,
          prices,
        });
        showNotification(`Jelo "${dishForm.name}" je ažurirano.`);
      }
    } else {
      // Create new
      const newItem: MenuItem = {
        id: `dish_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        name: dishForm.name.trim(),
        category: activeCategoryKey,
        ingredients: dishForm.ingredients.trim(),
        badge: dishForm.badge.trim() || undefined,
        weight: dishForm.weight.trim() || undefined,
        prices,
      };
      addMenuItem(newItem);
      showNotification(`Jelo "${dishForm.name}" je uspešno dodato u jelovnik.`);
    }

    setIsDishFormOpen(false);
    refreshData();
  };

  const handleDeleteDish = (id: string, name: string) => {
    if (confirm(`Da li ste sigurni da želite da uklonite jelo "${name}" iz jelovnika?`)) {
      deleteMenuItem(id);
      refreshData();
      showNotification(`Jelo "${name}" je uklonjeno.`);
    }
  };

  const handleResetToDefault = () => {
    if (
      confirm(
        'Da li ste sigurni da želite da poništite sve izmene i vratite fabrički jelovnik i kategorije Slovanke?'
      )
    ) {
      resetMenuToDefault();
      refreshData();
      showNotification('Jelovnik je vraćen na fabrička podešavanja.');
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`mx-6 mt-3 px-4 py-2.5 rounded text-xs flex items-center justify-between shadow-xs ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Top Categories Bar */}
      <div className="p-4 bg-[#f4f0e8] border-b border-[#e5dfd5] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-[#bda068]" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1e1c18]">
              Kategorije Jelovnika ({categories.length})
            </h4>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsAddingCategory(!isAddingCategory)}
              className="px-2.5 py-1 bg-white border border-[#bda068] text-[#1e1c18] hover:bg-[#bda068] hover:text-white text-xs font-medium rounded-sm flex items-center space-x-1.5 transition-colors"
            >
              <FolderPlus className="w-3.5 h-3.5 text-[#bda068]" />
              <span>+ Nova Kategorija</span>
            </button>
            <button
              onClick={handleResetToDefault}
              title="Vrati originalni meni restorana"
              className="px-2.5 py-1 text-stone-500 hover:text-stone-800 text-xs flex items-center space-x-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Vrati Fabrički</span>
            </button>
          </div>
        </div>

        {/* New category input popdown */}
        {isAddingCategory && (
          <form
            onSubmit={handleCreateCategory}
            className="p-3 bg-white border border-[#bda068]/60 rounded-sm space-y-2.5"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <input
                type="text"
                required
                placeholder="Naziv nove kategorije (npr. Sendviči, Topli Napici)..."
                value={newCatLabel}
                onChange={(e) => setNewCatLabel(e.target.value)}
                className="flex-1 w-full px-3 py-1.5 border border-stone-300 text-xs focus:outline-none focus:border-[#1e1c18] rounded-sm"
              />
              <label className="flex items-center space-x-2 text-xs text-stone-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={newCatTriplePrice}
                  onChange={(e) => setNewCatTriplePrice(e.target.checked)}
                  className="rounded border-stone-300 text-[#bda068] focus:ring-0"
                />
                <span>3 cene / veličine (kao pice)?</span>
              </label>
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  type="submit"
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-[#1e1c18] text-white text-xs font-semibold rounded-sm hover:bg-[#484436]"
                >
                  Dodaj
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(false)}
                  className="px-3 py-1.5 border border-stone-300 text-stone-600 text-xs rounded-sm hover:bg-stone-100"
                >
                  Otkaži
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Categories Chips */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => {
            const count = menuItems.filter((i) => i.category === cat.key).length;
            const isActive = activeCategoryKey === cat.key;
            return (
              <div
                key={cat.key}
                className={`inline-flex items-center rounded-sm text-xs transition-colors ${
                  isActive
                    ? 'bg-[#1e1c18] text-white shadow-xs'
                    : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-400'
                }`}
              >
                <button
                  onClick={() => {
                    setActiveCategoryKey(cat.key);
                    setIsDishFormOpen(false);
                  }}
                  className="px-3 py-1.5 font-medium flex items-center space-x-1.5"
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-[#bda068] text-white' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>

                {/* Delete category icon */}
                {categories.length > 1 && (
                  <button
                    onClick={() => handleDeleteCategory(cat.key, cat.label)}
                    title={`Obriši kategoriju ${cat.label}`}
                    className={`p-1.5 hover:text-red-500 transition-colors border-l ${
                      isActive ? 'border-stone-700 text-stone-400' : 'border-stone-200 text-stone-400'
                    }`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Dishes Area */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
        {/* Active Category Header & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#e5dfd5]">
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#1e1c18] flex items-center space-x-2">
              <span>{activeCategory?.label}</span>
              {isTriplePriceCategory && (
                <span className="text-[10px] font-sans font-normal uppercase tracking-wider text-[#bda068] bg-[#f4f0e8] px-2 py-0.5 rounded border border-[#e5dfd5]">
                  3 Veličine (Mala • Velika • Porodična)
                </span>
              )}
            </h3>
            <p className="text-xs text-[#767269]">
              Upravljajte jelima u ovoj kategoriji. Izmene se odmah odražavaju na sajtu.
            </p>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {/* Search inside category */}
            <div className="relative flex-1 sm:w-48">
              <input
                type="text"
                placeholder="Filtriraj jela..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 bg-white border border-stone-300 text-xs focus:outline-none focus:border-[#1e1c18] rounded-sm"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2 top-1/2 -translate-y-1/2" />
            </div>

            <button
              onClick={openAddDishForm}
              className="px-3 py-1.5 bg-[#1e1c18] text-white hover:bg-[#484436] text-xs font-semibold rounded-sm flex items-center space-x-1.5 transition-colors shrink-0 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-[#bda068]" />
              <span>+ Dodaj Jelo</span>
            </button>
          </div>
        </div>

        {/* Reusable Dish Form Function */}
        {(() => {
          const renderForm = (isInline = false, dishNameTitle?: string) => (
            <form
              id={isInline && editingDishId ? `dish-edit-form-${editingDishId}` : 'dish-add-form'}
              onSubmit={handleSaveDish}
              className={`p-5 bg-white border-2 border-[#bda068] rounded-sm shadow-md space-y-4 animate-fade-in ${
                isInline ? 'mb-3 ring-2 ring-[#bda068]/20' : 'mb-4'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <h4 className="font-serif text-base font-semibold text-[#1e1c18] flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#bda068]" />
                  <span>
                    {editingDishId
                      ? `Izmena Jela: ${dishNameTitle || dishForm.name || 'Izabrano Jelo'}`
                      : `Novo Jelo u Kategoriji: ${activeCategory?.label}`}
                  </span>
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setIsDishFormOpen(false);
                    setEditingDishId(null);
                  }}
                  className="text-stone-400 hover:text-stone-700 text-xs uppercase tracking-wider font-medium px-2 py-1 rounded hover:bg-stone-100 transition-colors"
                >
                  Zatvori ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                    Naziv Jela *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="npr. Capricciosa ili Piletina sa 4 Sira"
                    value={dishForm.name}
                    onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 text-xs focus:outline-none focus:border-[#1e1c18] rounded-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                    Oznaka / Značka (Opciono)
                  </label>
                  <input
                    type="text"
                    placeholder="npr. Specijalitet Kuće, Pikantno, Novo"
                    value={dishForm.badge}
                    onChange={(e) => setDishForm({ ...dishForm, badge: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 text-xs focus:outline-none focus:border-[#1e1c18] rounded-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                  Sastav & Sastojci *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="npr. pelat, sir gauda, origano, šampinjoni, domaća šunkarica, masline"
                  value={dishForm.ingredients}
                  onChange={(e) => setDishForm({ ...dishForm, ingredients: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 text-xs focus:outline-none focus:border-[#1e1c18] rounded-sm"
                />
              </div>

              {/* Price Inputs */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1e1c18] font-medium mb-1">
                  {isTriplePriceCategory
                    ? 'Cene za standardne veličine (RSD)'
                    : 'Cena porcije (RSD)'}
                </label>

                {isTriplePriceCategory ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#fbf9f5] p-3 border border-stone-200 rounded-sm">
                    <div>
                      <span className="block text-[11px] text-stone-500 mb-1">
                        Mala (28cm)
                      </span>
                      <input
                        type="text"
                        placeholder="npr. 520 RSD"
                        value={dishForm.smallPrice}
                        onChange={(e) => setDishForm({ ...dishForm, smallPrice: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-stone-300 text-xs focus:outline-none focus:border-[#1e1c18] rounded-sm bg-white"
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] text-stone-500 mb-1">
                        Velika (32cm)
                      </span>
                      <input
                        type="text"
                        placeholder="npr. 750 RSD"
                        value={dishForm.largePrice}
                        onChange={(e) => setDishForm({ ...dishForm, largePrice: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-stone-300 text-xs focus:outline-none focus:border-[#1e1c18] rounded-sm bg-white font-medium text-[#1e1c18]"
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] text-stone-500 mb-1">
                        Porodična (45cm)
                      </span>
                      <input
                        type="text"
                        placeholder="npr. 1290 RSD"
                        value={dishForm.familyPrice}
                        onChange={(e) => setDishForm({ ...dishForm, familyPrice: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-stone-300 text-xs focus:outline-none focus:border-[#1e1c18] rounded-sm bg-white"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        placeholder="npr. 650 RSD"
                        value={dishForm.singlePrice}
                        onChange={(e) => setDishForm({ ...dishForm, singlePrice: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 text-xs focus:outline-none focus:border-[#1e1c18] rounded-sm font-medium"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Gramaža / porcija (npr. 350g) - Opciono"
                        value={dishForm.weight}
                        onChange={(e) => setDishForm({ ...dishForm, weight: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 text-xs focus:outline-none focus:border-[#1e1c18] rounded-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsDishFormOpen(false);
                    setEditingDishId(null);
                  }}
                  className="px-4 py-2 border border-stone-300 text-stone-600 text-xs font-medium rounded-sm hover:bg-stone-50"
                >
                  Otkaži
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1e1c18] hover:bg-[#484436] text-white text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors shadow-xs"
                >
                  {editingDishId ? 'Sačuvaj Izmene' : 'Dodaj u Jelovnik'}
                </button>
              </div>
            </form>
          );

          return (
            <>
              {/* If adding a NEW dish, render at top */}
              {isDishFormOpen && !editingDishId && renderForm(false)}

              {/* Dishes List */}
              {categoryItems.length === 0 ? (
                <div className="text-center py-12 bg-white border border-dashed border-[#e5dfd5] rounded-sm">
                  <p className="font-serif text-lg text-[#1e1c18]">Nema jela u ovoj kategoriji</p>
                  <p className="text-xs text-[#767269] mt-1">
                    Kliknite na dugme "+ Dodaj Jelo" iznad kako biste uneli prvo jelo.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {categoryItems.map((dish) => {
                    const isEditingThis = isDishFormOpen && editingDishId === dish.id;
                    return (
                      <div key={dish.id} id={`dish-row-${dish.id}`} className="space-y-2">
                        {/* Prozor za izmenu postojeceg jela se otvara iznad izabranog jela */}
                        {isEditingThis && renderForm(true, dish.name)}

                        <div
                          className={`bg-white p-4 rounded-sm border ${
                            isEditingThis
                              ? 'border-[#bda068] ring-2 ring-[#bda068]/30 shadow-xs'
                              : 'border-[#e5dfd5] hover:border-[#bda068]/70'
                          } flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs transition-colors group`}
                        >
                          <div className="space-y-1 flex-1 pr-4">
                            <div className="flex items-center space-x-2 flex-wrap">
                              <h5 className="font-serif text-base font-medium text-[#1e1c18]">
                                {dish.name}
                              </h5>
                              {dish.badge && (
                                <span className="text-[10px] uppercase tracking-wider text-[#bda068] font-semibold bg-[#f4f0e8] px-2 py-0.5 rounded border border-[#e5dfd5]">
                                  {dish.badge}
                                </span>
                              )}
                              {dish.weight && (
                                <span className="text-[10px] text-stone-400">({dish.weight})</span>
                              )}
                            </div>

                            <p className="text-xs text-[#767269] font-light leading-relaxed">
                              {dish.ingredients}
                            </p>

                            {/* Prices display */}
                            <div className="pt-1 text-xs">
                              {dish.prices.single ? (
                                <span className="font-serif font-semibold text-[#1e1c18]">
                                  {dish.prices.single}
                                </span>
                              ) : (
                                <div className="flex items-center space-x-3 text-stone-600">
                                  {dish.prices.small && (
                                    <span>
                                      <strong className="text-stone-400 font-normal">M:</strong>{' '}
                                      <span className="font-serif font-medium">{dish.prices.small}</span>
                                    </span>
                                  )}
                                  {dish.prices.large && (
                                    <span className="text-[#1e1c18] font-semibold">
                                      <strong className="text-[#bda068] font-normal">V:</strong>{' '}
                                      <span className="font-serif">{dish.prices.large}</span>
                                    </span>
                                  )}
                                  {dish.prices.family && (
                                    <span>
                                      <strong className="text-stone-400 font-normal">P:</strong>{' '}
                                      <span className="font-serif font-medium">{dish.prices.family}</span>
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-1.5 self-end sm:self-center shrink-0">
                            <button
                              onClick={() => openEditDishForm(dish)}
                              className={`p-1.5 rounded transition-colors ${
                                isEditingThis
                                  ? 'bg-[#bda068] text-white shadow-2xs'
                                  : 'text-stone-600 hover:text-[#1e1c18] hover:bg-stone-100'
                              }`}
                              title="Izmeni jelo"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDish(dish.id, dish.name)}
                              className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Obriši jelo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
};
