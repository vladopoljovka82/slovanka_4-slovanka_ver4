import fs from 'fs';
import path from 'path';
import { MENU_ITEMS } from '../src/data/menuData';

function syncStandalone() {
  const standalonePath = path.resolve(process.cwd(), 'public/standalone.html');
  let html = fs.readFileSync(standalonePath, 'utf8');

  // 1. Fix Facebook button icon with official Facebook SVG
  const oldFbPattern = /<a href="https:\/\/www\.facebook\.com\/slovanka\.kafebar\/"[\s\S]*?<\/a>/;
  const newFbHtml = `<a href="https://www.facebook.com/slovanka.kafebar/" target="_blank" rel="noopener noreferrer" class="inline-flex items-center space-x-2.5 px-6 py-3 bg-white text-sphere-dark hover:bg-sphere-gold hover:text-white transition-all text-xs uppercase tracking-widest font-semibold rounded-sm shadow-sm group">
                    <svg class="w-4 h-4 fill-[#1877f2] group-hover:fill-white transition-colors shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span id="standalone-fb-text">Facebook Stranici</span>
                </a>`;

  if (oldFbPattern.test(html)) {
    html = html.replace(oldFbPattern, newFbHtml);
    console.log('Replaced Facebook button with SVG and ID');
  }

  // 2. Ensure applySiteContentToDOM targets standalone-fb-text
  html = html.replace(
    /const fbBtn = specSec\.querySelector\('a span'\);[\s\S]*?if \(fbBtn && content\.specialties\.facebookButtonText\) fbBtn\.textContent = content\.specialties\.facebookButtonText;/,
    `const fbBtn = document.getElementById('standalone-fb-text');
                if (fbBtn && content.specialties && content.specialties.facebookButtonText) fbBtn.textContent = content.specialties.facebookButtonText;`
  );

  // 3. Prepare DEFAULT_MENU_ITEMS JSON
  const menuItemsJson = JSON.stringify(MENU_ITEMS, null, 2);

  // Replace DEFAULT_CATEGORIES and inject DEFAULT_MENU_ITEMS
  const catRegex = /const DEFAULT_CATEGORIES = \[[\s\S]*?\];/;
  const newCatAndMenuCode = `const DEFAULT_CATEGORIES = [
            { id: 'pizze', name: 'Pizze', hasTriplePrice: true },
            { id: 'paste', name: 'Paste & Rezanci', hasTriplePrice: false },
            { id: 'glavna', name: 'Glavna Jela', hasTriplePrice: false },
            { id: 'salate', name: 'Obrok Salate', hasTriplePrice: false },
            { id: 'poslastice', name: 'Palačinke & Poslastice', hasTriplePrice: false },
            { id: 'dorucak', name: 'Doručak & Topla Jela', hasTriplePrice: false }
        ];

        const DEFAULT_MENU_ITEMS = ${menuItemsJson};`;

  html = html.replace(catRegex, newCatAndMenuCode);
  console.log('Injected DEFAULT_MENU_ITEMS');

  // 4. Update getAdminDishes and getAdminCategories
  html = html.replace(
    /function getAdminCategories\(\) \{[\s\S]*?return data && data\.categories \? data\.categories : DEFAULT_CATEGORIES;[\s\S]*?\}/,
    `function getAdminCategories() {
            const data = getStoredMenuData();
            if (data && Array.isArray(data.categories) && data.categories.length > 0) {
                return data.categories;
            }
            return DEFAULT_CATEGORIES;
        }`
  );

  html = html.replace(
    /function getAdminDishes\(\) \{[\s\S]*?return \[\];[\s\S]*?\}/,
    `function getAdminDishes() {
            const data = getStoredMenuData();
            if (data && Array.isArray(data.items) && data.items.length > 0) {
                return data.items;
            }
            return DEFAULT_MENU_ITEMS;
        }`
  );

  // 5. Update renderAdminDishesList
  const oldRenderAdminDishes = /function renderAdminDishesList\(\) \{[\s\S]*?lucide\.createIcons\(\);[\s\S]*?\}/;
  const newRenderAdminDishes = `function renderAdminDishesList() {
            const listEl = document.getElementById('admin-dishes-list');
            if (!listEl) return;

            const dishes = getAdminDishes().filter(d => (d.category === currentAdminMenuCat || d.category === currentAdminMenuCat.toLowerCase()));

            if (dishes.length === 0) {
                listEl.innerHTML = '<p class="text-xs text-stone-500 italic p-4 text-center">Nema unetih jela u ovoj kategoriji.</p>';
                return;
            }

            listEl.innerHTML = dishes.map(dish => {
                let priceDisplay = '';
                if (dish.prices) {
                    if (dish.prices.single) {
                        priceDisplay = dish.prices.single;
                    } else {
                        priceDisplay = (dish.prices.small || '') + ' | ' + (dish.prices.large || '') + ' | ' + (dish.prices.family || '');
                    }
                } else {
                    priceDisplay = dish.price || '';
                }

                return \`
                    <div class="p-3 bg-white border border-stone-200 rounded-sm flex items-center justify-between gap-3 text-xs">
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center space-x-2">
                                <span class="font-semibold text-stone-900 truncate">\${escapeHtml(dish.name)}</span>
                                \${dish.badge ? \`<span class="text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-sphere-surface text-sphere-gold border border-sphere-gold/50 rounded-xs font-semibold">\${escapeHtml(dish.badge)}</span>\` : ''}
                                \${dish.weight ? \`<span class="text-[10px] text-stone-400">(\${escapeHtml(dish.weight)})</span>\` : ''}
                            </div>
                            <p class="text-[11px] text-stone-500 truncate mt-0.5">\${escapeHtml(dish.ingredients || '')}</p>
                        </div>
                        <div class="flex items-center space-x-3 shrink-0">
                            <span class="font-mono font-medium text-stone-800 text-[11px]">\${escapeHtml(priceDisplay)}</span>
                            <button onclick="adminEditDish('\${dish.id}')" class="p-1 text-stone-500 hover:text-stone-900" title="Izmeni">
                                <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                            </button>
                            <button onclick="adminDeleteDish('\${dish.id}')" class="p-1 text-stone-400 hover:text-red-600" title="Obriši">
                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
                    </div>
                \`;
            }).join('');

            lucide.createIcons();
        }`;

  html = html.replace(oldRenderAdminDishes, newRenderAdminDishes);
  console.log('Updated renderAdminDishesList');

  // 6. Update syncPublicMenuDOM
  const oldSyncPublic = /function syncPublicMenuDOM\(\) \{[\s\S]*?applyMenuFilter\(\);[\s\S]*?\}/;
  const newSyncPublic = `function syncPublicMenuDOM() {
            const dishes = getAdminDishes();
            if (!dishes || dishes.length === 0) return;

            const container = document.getElementById('menu-container');
            if (!container) return;

            container.innerHTML = dishes.map(dish => {
                const isTriple = dish.prices && !dish.prices.single;
                return \`
                    <div class="menu-card p-3.5 rounded-sm hover:bg-white/70 transition-colors border-b border-dotted border-stone-300 group" data-cat="\${escapeHtml(dish.category)}" data-id="\${escapeHtml(dish.id)}">
                        <div class="flex items-baseline justify-between gap-4">
                            <div class="flex items-center space-x-2">
                                <h3 class="font-serif text-xl font-normal text-sphere-dark group-hover:text-sphere-gold transition-colors">
                                    \${escapeHtml(dish.name)}
                                </h3>
                                \${dish.badge ? \`<span class="text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-sphere-surface text-sphere-gold border border-sphere-gold/50 rounded-xs font-semibold">\${escapeHtml(dish.badge)}</span>\` : ''}
                            </div>
                            <div class="shrink-0 text-right">
                                \${isTriple ? \`
                                    <div class="flex items-center space-x-1 font-serif text-base font-semibold text-sphere-olive">
                                        <span>\${escapeHtml(dish.prices.small)}</span>
                                        <span class="text-stone-400 font-light">|</span>
                                        <span>\${escapeHtml(dish.prices.large)}</span>
                                        <span class="text-stone-400 font-light">|</span>
                                        <span>\${escapeHtml(dish.prices.family)}</span>
                                    </div>
                                \` : \`
                                    <span class="font-serif text-base font-semibold text-sphere-olive">\${escapeHtml(dish.prices ? (dish.prices.single || '') : (dish.price || ''))}</span>
                                \`}
                            </div>
                        </div>
                        <div class="flex justify-between items-center mt-1 text-xs text-sphere-muted italic">
                            <span>\${escapeHtml(dish.ingredients || '')}</span>
                            \${dish.weight ? \`<span class="text-[10px] tracking-widest uppercase not-italic text-stone-400 shrink-0 ml-2">\${escapeHtml(dish.weight)}</span>\` : ''}
                        </div>
                    </div>
                \`;
            }).join('');

            applyMenuFilter();
        }`;

  html = html.replace(oldSyncPublic, newSyncPublic);
  console.log('Updated syncPublicMenuDOM');

  // 7. Update startup code so syncPublicCategoriesDOM and syncPublicMenuDOM always run
  html = html.replace(
    /const initialMenu = getStoredMenuData\(\);\s*if \(initialMenu\) \{\s*syncPublicCategoriesDOM\(\);\s*syncPublicMenuDOM\(\);\s*\}/,
    `syncPublicCategoriesDOM();
            syncPublicMenuDOM();`
  );

  // 8. Update static HTML inside #menu-container so even before JS it has all items rendered
  const staticCardsHtml = MENU_ITEMS.map(dish => {
    const isTriple = dish.prices && !dish.prices.single;
    const isHidden = dish.category !== 'pizze' ? ' hidden' : '';
    const badgeHtml = dish.badge ? `<span class="text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-sphere-surface text-sphere-gold border border-sphere-gold/50 rounded-xs font-semibold">${dish.badge}</span>` : '';
    const weightHtml = dish.weight ? `<span class="text-[10px] tracking-widest uppercase not-italic text-stone-400 shrink-0 ml-2">${dish.weight}</span>` : '';
    const priceHtml = isTriple ? `
                    <div class="flex items-center space-x-1 font-serif text-base font-semibold text-sphere-olive">
                        <span>${dish.prices.small}</span>
                        <span class="text-stone-400 font-light">|</span>
                        <span>${dish.prices.large}</span>
                        <span class="text-stone-400 font-light">|</span>
                        <span>${dish.prices.family}</span>
                    </div>` : `
                    <span class="font-serif text-base font-semibold text-sphere-olive">${dish.prices?.single || ''}</span>`;

    return `            <div class="menu-card p-3.5 rounded-sm hover:bg-white/70 transition-colors border-b border-dotted border-stone-300 group${isHidden}" data-cat="${dish.category}" data-id="${dish.id}">
                <div class="flex items-baseline justify-between gap-4">
                    <div class="flex items-center space-x-2">
                        <h3 class="font-serif text-xl font-normal text-sphere-dark group-hover:text-sphere-gold transition-colors">${dish.name}</h3>
                        ${badgeHtml}
                    </div>
                    <div class="shrink-0 text-right">
                        ${priceHtml}
                    </div>
                </div>
                <div class="flex justify-between items-center mt-1 text-xs text-sphere-muted italic">
                    <span>${dish.ingredients}</span>
                    ${weightHtml}
                </div>
            </div>`;
  }).join('\n');

  const menuContainerRegex = /<div class="grid grid-cols-1 lg:grid-cols-2 gap-x-14 gap-y-8 fade-in-section" id="menu-container">[\s\S]*?<\/div>\s*<\/section>/;
  const newMenuContainerHtml = `<div class="grid grid-cols-1 lg:grid-cols-2 gap-x-14 gap-y-7 fade-in-section" id="menu-container">\n${staticCardsHtml}\n        </div>\n    </section>`;

  html = html.replace(menuContainerRegex, newMenuContainerHtml);
  console.log('Replaced static #menu-container with complete 53 dishes with badges');

  fs.writeFileSync(standalonePath, html, 'utf8');
  console.log('Successfully updated public/standalone.html');
}

syncStandalone();
