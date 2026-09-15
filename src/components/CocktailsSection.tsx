import React, { useState, useEffect } from 'react';
import { Sparkles, Citrus } from 'lucide-react';
import { CocktailItem } from '../types';
import { useSiteContent } from '../utils/useSiteContent';
import { getStoredCocktails } from '../utils/cocktailsStorage';

export const CocktailsSection: React.FC = () => {
  const content = useSiteContent();
  const { cocktails: cocktailsContent } = content;
  const [cocktails, setCocktails] = useState<CocktailItem[]>(() => getStoredCocktails());

  useEffect(() => {
    const handleUpdate = () => {
      setCocktails(getStoredCocktails());
    };
    window.addEventListener('slovanka_cocktails_updated', handleUpdate);
    return () => window.removeEventListener('slovanka_cocktails_updated', handleUpdate);
  }, []);

  return (
    <section id="kokteli" className="bg-[#3f3b2f] text-white py-24 px-6 md:px-12 relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#bda068]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-black/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center space-x-2 text-xs uppercase tracking-luxury text-[#bda068] font-semibold mb-3">
            <Citrus className="w-4 h-4 text-[#bda068]" />
            <span>{cocktailsContent.eyebrow}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light uppercase tracking-wider text-stone-100 mb-5">
            {cocktailsContent.title}
          </h2>

          <div className="w-16 h-px bg-[#bda068] mx-auto mb-6"></div>

          <p className="text-stone-300 text-sm md:text-base font-light leading-relaxed">
            {cocktailsContent.description}
          </p>
        </div>

        {/* Cocktails Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {cocktails.map((cocktail, index) => (
            <div
              key={index}
              className="group bg-[#4a4538]/75 hover:bg-[#4a4538] border border-stone-700/60 hover:border-[#bda068]/60 transition-all duration-300 rounded-sm overflow-hidden flex flex-col shadow-lg"
            >
              {/* Image Container with Hover Zoom */}
              <div className="relative aspect-4/3 overflow-hidden bg-stone-900/40">
                <img
                  src={cocktail.image}
                  alt={cocktail.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity" />

                {cocktail.badge && (
                  <span className="absolute top-3 right-3 bg-[#bda068] text-[#1e1c18] text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-xs shadow-xs">
                    {cocktail.badge}
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex flex-col flex-grow">
                <span className="text-[10px] uppercase tracking-widest text-[#bda068] font-semibold mb-1">
                  {cocktail.category}
                </span>

                <h3 className="font-serif text-xl font-normal text-stone-100 group-hover:text-[#d6be8c] transition-colors mb-2">
                  {cocktail.name}
                </h3>

                <p className="text-xs text-stone-300 font-light leading-relaxed mb-4 flex-grow">
                  {cocktail.description}
                </p>

                <div className="pt-3 border-t border-stone-700/50 mt-auto">
                  <span className="block text-[10px] uppercase tracking-wider text-stone-400 font-medium mb-1">
                    Sastojci:
                  </span>
                  <p className="text-[11px] text-[#e8dfcf] italic font-serif">
                    {cocktail.ingredients}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-14 p-4 sm:p-6 bg-[#353127]/80 border border-stone-700/50 rounded-sm max-w-2xl mx-auto text-center flex flex-col sm:flex-row items-center justify-center gap-3">
          <Sparkles className="w-5 h-5 text-[#bda068] shrink-0" />
          <p className="text-xs text-stone-300 font-light">
            {cocktailsContent.bottomNote || 'Svi naši kokteli se pripremaju na licu mesta od svežeg voća, prirodnih sirupa i domaćih biljaka. Pitajte naše osoblje za sezonska osveženja!'}
          </p>
        </div>
      </div>
    </section>
  );
};
